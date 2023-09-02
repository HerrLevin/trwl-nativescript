<script lang="ts">
import Vue from 'vue'
import StationSheetcomponent from "~/components/StationSheetcomponent.vue";
import LineRunPage from "~/pages/LineRunPage.vue";

export default Vue.extend({
  name: "CheckinPage",
  data() {
    return {
      inputText: '',
      departures: ['a', 'b', 'c']
    }
  },
  methods: {
    textFieldTap() {
      this.$showModal(StationSheetcomponent).then(this.stationModalCallback);
    },
    stationModalCallback(args: string) {
      console.info(args);
      this.inputText = args;
    },
    tapListItem() {
      console.info("tapped");
      this.$navigateTo(LineRunPage, {
        frame: 'checkin',
        props: {
          lineName: 'RE 1435'
        }
      });
    }
  }
})
</script>

<template>
  <Page>
    <GridLayout rows="60, *">
      <TextField row="0" hint="Enter text" color="orangered" backgroundColor="lightyellow" @tap="textFieldTap"/>
      <ListView row="1" for="departure in departures" class="list-group">
        <v-template>
          <GridLayout columns="100, *, 40" @tap="tapListItem">
            <Label col="0">RE 1435</Label>
            <Label col="1" :text="departure" class="list-group-item"/>
            <Label col="2">12:14</Label>
          </GridLayout>
        </v-template>
      </ListView>
    </GridLayout>
  </Page>
</template>

<style scoped lang="scss">
@import '@nativescript/theme/scss/variables/blue';

</style>
