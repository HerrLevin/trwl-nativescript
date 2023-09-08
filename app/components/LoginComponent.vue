<template>
  <Page>
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


const appSettings = require("@nativescript/core/application-settings");

export default Vue.extend({
  data() {
    return {
      apiKey: false,
      keyInput: ""
    }
  },
  computed: {
    message() {
      return this.apiKey ? "You're logged in!" : "You're logged out!";
    }
  },
  methods: {
    getToken() {
      Utils.openUrl("https://traewelling.de/settings/security/api-tokens");
    },
    logout() {
      logout().then(() => {
        this.keyInput = "";
        this.setKey();
        this.apiKey = false;
      })
    },
    getKey() {
      this.apiKey = isEmpty(appSettings.getString("API"));
    },
    setKey() {
      this.apiKey = true;
      appSettings.setString("API", this.keyInput);
      appSettings.flush();
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
