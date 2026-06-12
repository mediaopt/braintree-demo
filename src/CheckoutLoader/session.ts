import { fetchCoCoOAuthToken } from "../CtUtils/services/auth";

export type PaymentTemplateData = {
  projectKey: string;
  region: string;
  sessionId: string;
  logInfo: boolean;
  logWarn: boolean;
  logError: boolean;
};

export const buildPaymentTemplateData = async (
  cartId: string,
): Promise<PaymentTemplateData> => {
  const sessionId = await getSessionId(cartId);
  if (typeof (window as any).process === "undefined") {
    (window as any).process = { env: { NODE_ENV: "development" } };
  }
  return {
    projectKey: import.meta.env.VITE_CTP_PROJECT_KEY,
    region: import.meta.env.VITE_CTP_REGION,
    sessionId,
    logInfo: true,
    logWarn: true,
    logError: true,
  };
};

export const getSessionId = async (cartId: string): Promise<string> => {
  const oAuthToken = await fetchCoCoOAuthToken();

  const res = await fetch(
    `https://session.${import.meta.env.VITE_CTP_REGION}.commercetools.com/${import.meta.env.VITE_CTP_PROJECT_KEY}/sessions`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${oAuthToken}`,
      },
      body: JSON.stringify({
        cart: { cartRef: { id: cartId } },
        metadata: {
          applicationKey: import.meta.env.VITE_CTP_APPLICATION_KEY,
        },
      }),
    },
  );

  const data = await res.json();

  if (!res.ok) {
    console.error("Not able to create session:", data);
    throw new Error("Not able to create session");
  }

  return data.id as string;
};
