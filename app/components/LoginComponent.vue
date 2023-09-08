<template>
  <Page @loaded="getKey">
    <ActionBar>
      <Label text="Login"/>
    </ActionBar>

    <StackLayout>
      <Label class="info">
        <FormattedString>
          <Span class="fas" text.decode="&#xf135; "/>
          <Span :text="message"/>
        </FormattedString>
      </Label>
      <TextField v-model="keyInput"/>
      <Button text="oauth login" @tap="onLoginTap" />
      <Button text="oauth logout" @tap="onLogoutTap" />
      <Button v-if="!apiKey" text="Get your API token" @tap="getToken"/>
      <Button v-if="!apiKey" text="Login" @tap="setKey"/>
      <Button v-else text="Logout" @tap="logout"/>
    </StackLayout>
  </Page>
</template>

<script lang="ts">
import Vue from "nativescript-vue";
import {isEmpty} from "lodash-es";
import {logout} from "~/api.service";
import { Utils } from "@nativescript/core";
const File = require("@nativescript/core/file-system");
const appSettings = require("@nativescript/core/application-settings");
import { tnsOauthLogin, tnsOauthLogout } from "~/auth-service";

export default Vue.extend({
  data() {
    return {
      apiKey: false,
      keyInput: "",
      file: <File.File|null> null,
      userdata: <any> {}
    }
  },
  computed: {
    message() {
      return this.apiKey ? "You're logged in!" : "You're logged out!";
    }
  },
  methods: {
    onLoginTap() {
      tnsOauthLogin("myCustomProvider", (tokenResult, error) => {
        if (error) {
          console.error("back to main page with error: ");
          console.error(error);
        } else {
          console.log("WTF");
          this.keyInput = tokenResult.accessToken;
          this.setKey();
        }
      });
    },
    onLogoutTap() {
      tnsOauthLogout();
    },
    getToken() {
      Utils.openUrl("https://traewelling.de/settings/security/api-tokens");
    },
    logout() {
      this.readFile();
      logout().then(() => {
        this.keyInput = "";
        this.setKey();
        this.writeFile({});
        this.apiKey = false;
      })
      this.apiKey = false;
    },
    getKey() {
      this.openFile();
      this.readFile();
      this.apiKey = !isEmpty(appSettings.getString("API"));
    },
    setKey() {
      console.log("setting...");
      this.writeFile({token: this.keyInput}).then(() => {
        this.apiKey = true;
        appSettings.setString("API", this.keyInput);
        console.log("set!");
      });
    },
    openFile() {
      this.file = File.knownFolders.documents().getFile("userAuth.json");
    },
    readFile() {
      this.file.readText().then((content: string) => {
        if (!isEmpty(content)) {
          this.userdata = JSON.parse(content);
          appSettings.setString("API", this.userdata.token);
          this.keyInput = this.userdata.token;
          if (this.userdata.token) {
            this.$modal?.close();
          }
          this.apiKey = !isEmpty(this.keyInput);
          console.log(this.userdata);
        }
      }).catch(console.error);
    },
    writeFile(data: object) {
      return this.file.writeText(JSON.stringify(data));
    }
  }
});
</script>

<style scoped lang="scss">
@import '@nativescript/theme/scss/variables/ruby';

// Custom styles
.fas {
  @include colorize($color: accent);
}

.info {
  font-size: 20;
  horizontal-align: center;
  vertical-align: center;
}
</style>
