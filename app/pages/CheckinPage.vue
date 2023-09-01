<script lang="ts">
import Vue from 'vue'
import StationSheetcomponent from "~/components/StationSheetcomponent.vue";

export default Vue.extend({
  name: "CheckinPage",
  data() {
    return {
      inputText: ''
    }
  },
  methods: {
    textFieldTap() {
      this.$showModal(StationSheetcomponent).then(this.stationModalCallback);
    },
    stationModalCallback(args: string) {
      console.info(args);
      this.inputText = args;
    }
  }
})
</script>

<template>
  <Page>
    <StackLayout>
      <TextField hint="Enter text" color="orangered" backgroundColor="lightyellow" @tap="textFieldTap"/>
    </StackLayout>
  </Page>
</template>

<style scoped lang="scss">
@import '@nativescript/theme/scss/variables/blue';

</style>
