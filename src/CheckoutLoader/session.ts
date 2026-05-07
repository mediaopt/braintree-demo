import { fetchCoCoOAuthToken } from '../CtUtils/services/auth';

export interface CheckoutData {
  sessionId: string;
  processorUrl: string;
  merchantAccountId?: string;
  currencyCode: string;
  countryCode: string;
  paymentMethods: unknown;
}

export const buildCheckoutData = async (cartId: string, currencyCode: string, countryCode: string): Promise<CheckoutData> => {
  const jwt = await fetchJwt();
  const [sessionId, paymentMethods] = await Promise.all([
    getSessionId(cartId),
    fetchPaymentMethods(jwt),
  ]);
  return {
    sessionId,
    processorUrl: import.meta.env.VITE_PROCESSOR_URL,
    merchantAccountId: import.meta.env.BRAINTREE_MERCHANT_ACCOUNT_ID,
    currencyCode,
    countryCode,
    paymentMethods,
  };
};

const projectKey = import.meta.env.VITE_CTP_PROJECT_KEY;

export const fetchJwt = async (): Promise<string> => {
  const res = await fetch(`${import.meta.env.VITE_PROCESSOR_URL}/jwt/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      iss: 'https://issuer.com',
      sub: 'test-sub',
      'https://issuer.com/claims/project_key': projectKey,
    }),
  });
  return (await res.json()).token;
};

export const fetchPaymentMethods = async (jwt: string) => {
  const res = await fetch(`${import.meta.env.VITE_PROCESSOR_URL}/operations/payment-components`, {
    headers: { Authorization: `Bearer ${jwt}` },
  });
  return res.json();
};

// Extend here when payment method selection is driven from Storybook
const allowedPaymentMethods = ['card', 'invoice', 'purchaseorder'];

export const getSessionId = async (cartId: string): Promise<string> => {
  const oAuthToken = await fetchCoCoOAuthToken();

  const res = await fetch(`${import.meta.env.VITE_CTP_SESSION_URL}/${projectKey}/sessions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${oAuthToken}`,
    },
    body: JSON.stringify({
      cart: { cartRef: { id: cartId } },
      metadata: {
        processorUrl: import.meta.env.VITE_PROCESSOR_URL,
        allowedPaymentMethods,
      },
    }),
  });

  const data = await res.json();

  if (!res.ok) {
    console.error('Not able to create session:', data);
    throw new Error('Not able to create session');
  }

  return data.id as string;
};
