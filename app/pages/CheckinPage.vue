<script lang="ts">
import Vue from 'vue'
import StationSheetcomponent from "~/components/StationSheetcomponent.vue";
import LineRunPage from "~/pages/LineRunPage.vue";
const appSettings = require("@nativescript/core/application-settings");
import {getDepartures} from "~/api.service";
const demo = require("~/demoData/departures.json");

export default Vue.extend({
  name: "CheckinPage",
  data() {
    return {
      inputText: '',
      station: null,
      departures: [
        {
          when: '2023-01-06T13:49:00+01:00',
          direction: 'Zürich HB',
          line: {
            name: 'EC 60'
          }
        },{
          when: '2023-01-06T13:50:00+01:00',
          direction: 'Karlsruhe Hbf',
          line: {
            name: 'ICE 123'
          }
        },
      ]
    }
  },
  methods: {
    textFieldTap() {
      this.$showModal(StationSheetcomponent).then(this.stationModalCallback);
    },
    stationModalCallback(args: string) {
      console.info(args);
      this.inputText = args;
      this.getDeparturesFrom();
    },
    tapListItem(train: any) {
      this.$navigateTo(LineRunPage, {
        frame: 'checkin',
        props: { train, start: this.station}
      });
    },
    renderDeparture(timestring: string): string {
      let date = Date.parse(timestring);
      let time = new Date(date);
      return time.toLocaleTimeString()
    },
    getDeparturesFrom() {
      this.departures = [];
      this.$refs.departuresListView.refresh();

      getDepartures(this.inputText).then((response) => {
        console.info("done");
        this.inputText = response.meta.station.name;
        this.station = response.meta.station;
        this.departures = response.data;
        console.log(response);

        this.$refs.departuresListView.refresh();
      }).catch((e) => {
        console.error("some error?");
        console.error(e);
      });

      console.log("wha");

    }
  }
})
</script>

<template>
  <Page>
    <GridLayout rows="60, *">
      <TextField
          row="0"
          hint="Stationsname oder DS100"
          v-model="inputText"
          color="orangered"
          backgroundColor="lightyellow"
          @tap="textFieldTap"
      />
      <ListView row="1" for="departure in departures" class="list-group" ref="departuresListView">
        <v-template>
          <GridLayout columns="100, *, 60" @tap="tapListItem(departure)" class="list-group-item">
            <Label col="0" :text="departure.line.name" />
            <Label col="1" :text="departure.direction"/>
            <Label col="2" :text="renderDeparture(departure.when)" />
          </GridLayout>
        </v-template>
      </ListView>
    </GridLayout>
  </Page>
</template>

<style scoped lang="scss">
@import '@nativescript/theme/scss/variables/ruby';

</style>
