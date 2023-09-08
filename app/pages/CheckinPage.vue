<script lang="ts">
import Vue from 'vue'
import StationSheetcomponent from "~/components/StationSheetcomponent.vue";
import LineRunPage from "~/pages/LineRunPage.vue";

const appSettings = require("@nativescript/core/application-settings");
import {API} from "~/api.service";
import dayjs from "dayjs";
import {isEmpty} from "lodash-es";

const demo = require("~/demoData/departures.json");

export default Vue.extend({
  name: "CheckinPage",
  data() {
    return {
      inputText: '',
      station: null,
      when: dayjs().subtract(5, "minutes"),
      departures: []
    }
  },
  computed: {

  },
  methods: {
    dateChange(args: any) {
      this.when = dayjs(args.value);
      this.getDeparturesFrom();
    },
    textFieldTap(condition: any = null) {
      if (isEmpty(condition)) {
        this.$showModal(StationSheetcomponent, {props: {input: this.inputText}}).then(this.stationModalCallback);
      }
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
    prev() {
      this.when = this.when.subtract(15, "minutes");
      this.getDeparturesFrom();
    },
    next() {
      this.when = this.when.add(15, "minutes");
      this.getDeparturesFrom();
    },
    getDeparturesFrom() {
      this.departures = [];
      this.$refs.departuresListView.refresh();

      let api = new API(this);
      api.getDepartures(this.inputText, this.when.toISOString()).then((response) => {
        this.inputText = response.meta.station.name;
        this.station = response.meta.station;
        this.departures = response.data;

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
  <Page @loaded="textFieldTap(inputText)">
    <GridLayout rows="60, 60, *">
      <TextField
          row="0"
          hint="Stationsname oder DS100"
          v-model="inputText"
          @tap="textFieldTap"
      />
      <GridLayout row="1" columns="auto, *, auto" width="100%">
        <Button dock="left" class="fas" col="0" text.decode="&#xf0a8;" @tap="prev"/>
        <DateTimePickerFields col="1" :date="when.toISOString()" locale="de_DE" @dateChange="dateChange"/>
        <Button dock="right" class="fas" col="2" text.decode="&#xf0a9;" @tap="next"/>
      </GridLayout>
      <ListView row="2" for="departure in departures" class="list-group" ref="departuresListView">
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
