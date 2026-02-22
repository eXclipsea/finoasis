'use client';

import { useState, useEffect } from 'react';
import { usePlaidLink } from 'react-plaid-link';
import { Building2, Loader2 } from 'lucide-react';

export default function PlaidLinkButton() {
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const createLinkToken = async () => {
      try {
        const response = await fetch('/api/plaid/create-link-token', {
          method: 'POST',
        });
        const data = await response.json();
        setToken(data.link_token);
      } catch (error) {
        console.error('Error creating link token:', error);
      }
    };
    
    createLinkToken();
  }, []);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onSuccess = async (public_token: string, metadata: any) => {
    setLoading(true);
    try {
      const response = await fetch('/api/plaid/exchange-public-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          public_token,
          institution_name: metadata.institution?.name || 'Unknown Bank',
        }),
      });
      
      if (response.ok) {
        // Refresh the page or update state to show the linked account
        window.location.reload();
      }
    } catch (error) {
      console.error('Error exchanging public token:', error);
      setLoading(false);
    }
  };

  const { open, ready } = usePlaidLink({
    token: token!,
    onSuccess,
  });

  return (
    <button
      onClick={() => open()}
      disabled={!ready || loading}
      className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Building2 className="h-4 w-4" />
      )}
      Link Bank Account
    </button>
  );
}
