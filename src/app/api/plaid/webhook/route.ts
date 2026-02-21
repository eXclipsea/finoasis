import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { plaidClient } from '@/lib/plaid/client';
import { WebhookType, SandboxItemFireWebhookRequestWebhookCodeEnum } from 'plaid';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { webhook_type, webhook_code, item_id, new_transactions } = body;

    console.log(`Received Plaid webhook: ${webhook_type} - ${webhook_code}`);

    if (webhook_type === WebhookType.Transactions) {
      if (
        webhook_code === 'INITIAL_UPDATE' ||
        webhook_code === 'HISTORICAL_UPDATE' ||
        webhook_code === 'DEFAULT_UPDATE' ||
        webhook_code === SandboxItemFireWebhookRequestWebhookCodeEnum.DefaultUpdate
      ) {
        // Find the user associated with this item_id
        const supabase = await createClient();
        const { data: account, error: accountError } = await supabase
          .from('bank_accounts')
          .select('id, user_id, plaid_access_token')
          .eq('plaid_item_id', item_id)
          .single();

        if (accountError || !account) {
          console.error('Account not found for item_id:', item_id);
          return NextResponse.json({ error: 'Account not found' }, { status: 404 });
        }

        // Fetch recent transactions from Plaid
        // In a real app, you'd use the Sync endpoint (transactionsSync) which is more robust,
        // but for the MVP we'll fetch the last 30 days.
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - 30);
        const endDate = new Date();

        const response = await plaidClient.transactionsGet({
          access_token: account.plaid_access_token,
          start_date: startDate.toISOString().split('T')[0],
          end_date: endDate.toISOString().split('T')[0],
          options: {
            count: new_transactions || 50,
          },
        });

        const transactions = response.data.transactions;
        let totalXpEarned = 0;
        let savingsAmount = 0;

        // Process transactions and calculate gamification impact
        for (const txn of transactions) {
          // Check if transaction already exists to prevent duplicate processing
          const { data: existingTxn } = await supabase
            .from('transactions')
            .select('id')
            .eq('plaid_transaction_id', txn.transaction_id)
            .single();

          if (existingTxn) continue;

          // Simple MVP Gamification Logic:
          // Negative amount in Plaid means money entering the account (income/savings transfer) -> Good!
          // Positive amount means money leaving (spending) -> Bad if it's over budget, but we'll simplify.
          
          let xpAwarded = 0;
          let isSavings = false;

          if (txn.amount < 0) {
            // Income or transfer in! Award XP.
            xpAwarded = 50;
            totalXpEarned += xpAwarded;
            savingsAmount += Math.abs(txn.amount);
            isSavings = true;
          } else if (txn.amount > 0 && txn.amount < 20) {
            // Small responsible spending (e.g., coffee) - minor XP
            xpAwarded = 5;
            totalXpEarned += xpAwarded;
          } else if (txn.amount > 100) {
            // Large expense - Pet loses health in MVP logic unless it's categorized as rent/bills
            // We'll handle pet health down below.
          }

          // Insert transaction
          await supabase.from('transactions').insert({
            user_id: account.user_id,
            account_id: account.id,
            plaid_transaction_id: txn.transaction_id,
            amount: txn.amount,
            date: txn.date,
            name: txn.name,
            merchant_name: txn.merchant_name,
            category: txn.category,
            pending: txn.pending,
            xp_awarded: xpAwarded,
          });
        }

        // Apply Gamification Updates to Pet and City
        if (totalXpEarned > 0 || savingsAmount > 0) {
          // 1. Update City (Base Builder)
          const { data: city } = await supabase
            .from('cities')
            .select('funds, population')
            .eq('user_id', account.user_id)
            .single();

          if (city) {
            await supabase
              .from('cities')
              .update({
                funds: Number(city.funds) + savingsAmount,
                population: city.population + Math.floor(totalXpEarned / 10), // 10 XP = 1 new citizen
              })
              .eq('user_id', account.user_id);
          }

          // 2. Update Pet (Tamagotchi)
          const { data: pet } = await supabase
            .from('pets')
            .select('happiness, health, stage')
            .eq('user_id', account.user_id)
            .single();

          if (pet) {
            let newHappiness = Math.min(100, pet.happiness + 10);
            let newHealth = Math.min(100, pet.health + 5);
            let newStage = pet.stage;

            // Simple evolution logic
            if (pet.stage === 'egg' && totalXpEarned > 50) newStage = 'baby';
            else if (pet.stage === 'baby' && city?.population > 150) newStage = 'teen';

            await supabase
              .from('pets')
              .update({
                happiness: newHappiness,
                health: newHealth,
                stage: newStage,
              })
              .eq('user_id', account.user_id);
          }

          // 3. Update User Profile XP
          const { data: profile } = await supabase
            .from('profiles')
            .select('current_xp, level')
            .eq('id', account.user_id)
            .single();

          if (profile) {
            const newXp = profile.current_xp + totalXpEarned;
            const newLevel = Math.floor(newXp / 500) + 1; // Level up every 500 XP

            await supabase
              .from('profiles')
              .update({
                current_xp: newXp,
                level: newLevel,
              })
              .eq('id', account.user_id);
          }
        }
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error processing Plaid webhook:', error);
    return NextResponse.json(
      { error: 'Failed to process webhook' },
      { status: 500 }
    );
  }
}
