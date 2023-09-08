import {configureTnsOAuth, TnsOAuthClient, TnsOAuthClientLoginBlock} from "nativescript-oauth2";
import {TnsOaProvider} from "nativescript-oauth2/providers";
import {TnsOaMyCustomProviderOptions, TnsOaProviderMyCustomProvider} from "./my-oauth-provider";

let client: TnsOAuthClient;

export function configureOAuthProviders() {
  const myCustomProvider = configureOAuthProviderMyCustomProvider();
  configureTnsOAuth([myCustomProvider]);
}

function configureOAuthProviderMyCustomProvider(): TnsOaProvider {
  const traewellingProviderOptions: TnsOaMyCustomProviderOptions = {
    openIdSupport: "oid-none",
    clientId: process.env.TRWL_API_CLIENT_ID ? process.env.TRWL_API_CLIENT_ID : "",
    clientSecret: "",
    redirectUri: process.env.TRWL_CALLBACK ? process.env.TRWL_CALLBACK : "",
    scopes: [
      "read-statuses","read-statuses", "read-notifications", "read-statistics", "read-search", "write-statuses",
      "write-likes", "write-notifications", "write-exports", "write-follows", "write-followers", "write-blocks",
      "write-event-suggestions", "write-support-tickets", "read-settings", "write-settings-profile",
      "read-settings-profile", "write-settings-mail", "write-settings-profile-picture", "write-settings-privacy",
      "read-settings-followers", "write-settings-calendar", "extra-write-password", "extra-terminate-sessions",
      "extra-delete"
    ]
  };
  return new TnsOaProviderMyCustomProvider(traewellingProviderOptions);
}

export function tnsOauthLogin(providerType: string, completion?: TnsOAuthClientLoginBlock) {
  client = new TnsOAuthClient(providerType);

  client.loginWithCompletion(completion);
}

export function tnsOauthLogout() {
  if (client) {
    client.logout();
  }
}
