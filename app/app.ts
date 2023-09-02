import Vue from 'nativescript-vue'
import MainView from "~/components/MainView.vue";
import RadListView from 'nativescript-ui-listview/vue'

Vue.use(RadListView)

declare let __DEV__: boolean;

// Prints Vue logs when --env.production is *NOT* set while building
Vue.config.silent = !__DEV__

new Vue({
  template: `
    <Frame id="main">
    <MainView />
    </Frame>
  `,
  components: {
    MainView
  }
}).$start()
