<script lang="ts">
import Vue from 'vue'
import {getLineRun, TrainStopover} from "~/api.service";
import CheckinSheetcomponent from "~/components/CheckinSheetcomponent.vue";
const demo = require("~/demoData/trip.json");
import dayjs from 'dayjs';

export default Vue.extend({
  name: "LineRunPage",
  props: {
    train: {
      type: Object
    }
  },
  data() {
    return {
      stopovers: demo.data.stopovers,
      start: null,
    }
  },
  methods: {
    showCheckInSheet: function (stop: TrainStopover) {
      this.$showModal(
          CheckinSheetcomponent,
          {
            props: {
              lineName: this.$props.train.line.name,
              tripId: this.$props.train.tripId,
              start: this.start,
              destination: stop,
              departure: this.$props.train.plannedWhen,
              arrival: stop.arrival
            }
          }
      );
    },
    convertTime(time: string) {
      const newTime = dayjs(time);
      return newTime.format("HH:mm")
    },
    loadLineRun() {
      console.info("load line run");
      getLineRun(this.$props.train.tripId, this.$props.train.line.name, this.$props.train.stop.id).then((response) => {

        let stationFound: boolean = false;
        this.stopovers = response.data.stopovers.filter((stop: any) => {
          if (!stationFound && stop.evaIdentifier == this.$props.train.stop.id) {
            this.start = stop;
            stationFound = true;
            return false;
          }

          return stationFound;
        });
        console.log(this.stopovers);
        this.$refs.listView.reload();
      })
    }
  }
})
</script>

<template>
  <Page @loaded="loadLineRun">
    <ActionBar :title="`${$props.train.line.name} ➜ ${$props.train.direction}`"/>
    <ListView for="stop in stopovers" class="list-group" ref="listView">
      <v-template>
        <GridLayout columns="100, *, 45" @tap="showCheckInSheet(stop)">
          <Label col="0"></Label>
          <Label col="1" :text="stop.name" class="list-group-item"/>
          <Label col="2" :text="convertTime(stop.arrival)"/>
        </GridLayout>
      </v-template>
    </ListView>
  </Page>
</template>

<style scoped lang="scss">
@import '@nativescript/theme/scss/variables/ruby';

</style>
