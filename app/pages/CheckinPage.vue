<script lang="ts">
import Vue from 'vue'
import StationSheetcomponent from "~/components/StationSheetcomponent.vue";
import LineRunPage from "~/pages/LineRunPage.vue";

const appSettings = require("@nativescript/core/application-settings");
import {API, TrainStopover} from "~/api.service";
import dayjs from "dayjs";

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
        }, {
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
        props: {train, start: this.station}
      });
    },
    renderDeparture(timestring: string): string {
      let date = Date.parse(timestring);
      let time = new Date(date);
      return time.toLocaleTimeString()
    },
    convertTime(time: string | null) {
      const newTime = dayjs(time);
      return newTime.format("HH:mm")
    },
    delay(stopover: object) {
      let planned;
      let real;
      if (stopover.when && stopover.plannedWhen) {
        planned = dayjs(stopover.plannedWhen);
        real = dayjs(stopover.when);
      } else {
        return 0;
      }

      return Math.round(real.diff(planned) / 60000);
    },
    getDeparturesFrom() {
      this.departures = [];
      this.$refs.departuresListView.refresh();

      let api = new API(this);
      api.getDepartures(this.inputText).then((response) => {
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
          <GridLayout columns="100, *, 45, 45" @tap="tapListItem(departure)" class="list-group-item">
            <Label col="0" :text="departure.line.name"/>
            <Label col="1" :text="departure.direction"/>
            <Label col="2" :text="convertTime(departure.when)"/>
            <Label
                col="3"
                :text="`+${delay(departure)}`"
                :class="(delay(departure) < 2) ? 'green' : (delay(departure) < 5) ? 'yellow' : 'red'"
            />
          </GridLayout>
        </v-template>
      </ListView>
    </GridLayout>
  </Page>
</template>

<style scoped lang="scss">
@import '@nativescript/theme/scss/variables/ruby';

.green {
  color: forestgreen;
}

.yellow {
  color: orange;
}

.red {
  color: orangered;
}
</style>
