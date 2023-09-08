import { TnsOaProvider, TnsOaProviderOptions, OpenIdSupportNone, TnsOaUnsafeProviderOptions } from "nativescript-oauth2/providers";
import { ITnsOAuthTokenResult } from "nativescript-oauth2";

export interface TnsOaMyCustomProviderOptions extends TnsOaUnsafeProviderOptions { }

export class TnsOaProviderMyCustomProvider implements TnsOaProvider {
  public options: TnsOaProviderOptions;
  public openIdSupport: OpenIdSupportNone = "oid-none";
  public providerType = "myCustomProvider";
  public authority = "http://127.0.0.1:8000";
  public tokenEndpointBase = "http://127.0.0.1:8000";
  public authorizeEndpoint = "/oauth/authorize";
  public tokenEndpoint = "/oauth/token";
  public cookieDomains = ["facebook.com"];

  constructor(options: TnsOaMyCustomProviderOptions) {
    this.options = options;
  }

  public parseTokenResult(jsonData: ITnsOAuthTokenResult): ITnsOAuthTokenResult {
    return jsonData;
  }
}
