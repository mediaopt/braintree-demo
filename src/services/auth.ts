export const fetchCoCoOAuthToken = async (): Promise<string | undefined> => {
  const headers = new Headers();
  headers.append(
    'Authorization',
    `Basic ${btoa(`${import.meta.env.VITE_CTP_CLIENT_ID}:${import.meta.env.VITE_CTP_CLIENT_SECRET}`)}`
  );
  headers.append('Content-Type', 'application/x-www-form-urlencoded');

  const body = new URLSearchParams();
  body.append('grant_type', 'client_credentials');

  const response = await fetch(`${import.meta.env.VITE_CTP_AUTH_URL}/oauth/token`, {
    method: 'POST',
    headers,
    body,
    redirect: 'follow',
  });

  const token = await response.json();

  if (response.status !== 200) {
    console.log({ title: 'Token fetch failed', message: `Error ${response.status} while fetching token` });
    return undefined;
  }

  return token.access_token as string;
};
