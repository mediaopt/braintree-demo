import { createApiBuilderFromCtpClient } from "@commercetools/platform-sdk";
import { ClientBuilder } from "@commercetools/ts-client";

// --- Configuration ---
const projectKey = import.meta.env.VITE_CTP_PROJECT_KEY ?? "";
const clientId = import.meta.env.VITE_CTP_CLIENT_ID ?? "";
const clientSecret = import.meta.env.VITE_CTP_CLIENT_SECRET ?? "";
const authUrl = `https://auth.${import.meta.env.VITE_CTP_REGION}.commercetools.com`;
const apiUrl = `https://api.${import.meta.env.VITE_CTP_REGION}.commercetools.com`;
const scopes = [import.meta.env.VITE_CTP_SCOPE ?? ""];

// Auth Middleware Options
const authMiddlewareOptions = {
  host: authUrl,
  projectKey,
  credentials: { clientId, clientSecret },
  scopes: scopes,
  httpClient: fetch,
};

const httpMiddlewareOptions = {
  host: apiUrl,
};

// --- Client Creation ---
const client = new ClientBuilder()
  .withProjectKey(projectKey)
  .withClientCredentialsFlow(authMiddlewareOptions)
  .withLoggerMiddleware()
  .withHttpMiddleware(httpMiddlewareOptions)
  .build();

// --- API Root Creation ---
const apiRoot = createApiBuilderFromCtpClient(client).withProjectKey({
  projectKey,
});

export { apiRoot };
