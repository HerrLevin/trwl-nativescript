import {
  TnsOAuthClient,
  configureTnsOAuth,
  ITnsOAuthTokenResult, TnsOAuthClientLoginBlock
} from "nativescript-oauth2";
import {
  TnsOaProvider
} from "nativescript-oauth2/providers";
import { TnsOaProviderMyCustomProvider, TnsOaMyCustomProviderOptions } from "./my-oauth-provider";

let client: TnsOAuthClient;

export function configureOAuthProviders() {
  const myCustomProvider = configureOAuthProviderMyCustomProvider();
  configureTnsOAuth([myCustomProvider]);
}

function configureOAuthProviderMyCustomProvider(): TnsOaProvider {
  const facebookProviderOptions: TnsOaMyCustomProviderOptions = {
    openIdSupport: "oid-none",
    clientId: "2",
    clientSecret: "",
    redirectUri: "http://example.com/connect/login_succes.html",
    scopes: [
      "read-statuses","read-statuses", "read-notifications", "read-statistics", "read-search", "write-statuses",
      "write-likes", "write-notifications", "write-exports", "write-follows", "write-followers", "write-blocks",
      "write-event-suggestions", "write-support-tickets", "read-settings", "write-settings-profile",
      "read-settings-profile", "write-settings-mail", "write-settings-profile-picture", "write-settings-privacy",
      "read-settings-followers", "write-settings-calendar", "extra-write-password", "extra-terminate-sessions",
      "extra-delete"
    ]
  };
  const facebookProvider = new TnsOaProviderMyCustomProvider(facebookProviderOptions);
  return facebookProvider;
}

export function tnsOauthLogin(providerType: string, completion?: TnsOAuthClientLoginBlock) {
  client = new TnsOAuthClient(providerType);

  client.loginWithCompletion(completion);
  /*
  client.loginWithCompletion((tokenResult: ITnsOAuthTokenResult, error) => {
    if (error) {
      console.error("back to main page with error: ");
      console.error(error);
    } else {
      console.log("back to main page with access token: ");
      console.log(tokenResult);
    }
  }); */
}

export function tnsOauthLogout() {
  if (client) {
    client.logout();
  }
}
