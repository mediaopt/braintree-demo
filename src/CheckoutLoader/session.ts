import { fetchCoCoOAuthToken } from "../CtUtils/services/auth";
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
