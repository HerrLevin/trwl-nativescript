<template>
  <Page>
  <TabView androidTabsPosition="bottom" iosIconRenderingMode="alwaysOriginal" @loaded="storeKey">
    <TabViewItem title="Home">
      <Frame id="items">
        <HomePage />
      </Frame>
    </TabViewItem>
    <TabViewItem title="Top">
      <Frame id="browse">
        <ActionPage />
      </Frame>
    </TabViewItem>
    <TabViewItem title="Checkin">
      <Frame id="checkin">
        <CheckinPage />
      </Frame>
    </TabViewItem>
    <TabViewItem title="Statistics">
      <Frame id="browse">
        <ActionPage />
      </Frame>
    </TabViewItem>
    <TabViewItem title="Login">
      <Frame id="login">
        <LoginComponent />
      </Frame>
    </TabViewItem>
  </TabView>
  </Page>
</template>

<script lang="ts">
  import Vue from "nativescript-vue";
  import HomePage from "~/components/HomePage.vue";
  import ActionPage from "~/components/ActionPage.vue";
  import { Screen } from "@nativescript/core/platform";
  import LoginComponent from "~/components/LoginComponent.vue";
  import CheckinPage from "~/pages/CheckinPage.vue";
  const appSettings = require("@nativescript/core/application-settings");

  export default Vue.extend({
    components: {CheckinPage, LoginComponent, ActionPage, HomePage},
    computed: {
      message() {
        return "Blank {N}-Vue app";
      }
    },
    methods: {
      actionFrameLoaded(args: any) {
        const frame = args.object;

        frame.translateY = Screen.mainScreen.heightDIPs - 180;
      },
      storeKey() {
        appSettings.setString("API", "");
      }
    }
  });
</script>

<style scoped lang="scss">
  @import '@nativescript/theme/scss/variables/ruby';

</style>
