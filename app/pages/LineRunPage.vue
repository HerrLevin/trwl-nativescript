<script lang="ts">
import Vue from 'vue'
const demo = require("~/demoData/trip.json");

export default Vue.extend({
  name: "LineRunPage",
  props: {
    train: {
      type: Object
    }
  },
  data() {
    return {
      stopovers: demo.data.stopovers
    }
  },
})
</script>

<template>
  <Page>
    <ActionBar :title="`${$props.train.line.name} ➜ ${$props.train.direction}`"/>
    <ListView for="stop in stopovers" class="list-group">
      <v-template>
        <GridLayout columns="100, *, 40">
          <Label col="0">RE 1435</Label>
          <Label col="1" :text="stop.name" class="list-group-item"/>
          <Label col="2">12:14</Label>
        </GridLayout>
      </v-template>
    </ListView>
  </Page>
</template>

<style scoped lang="scss">
@import '@nativescript/theme/scss/variables/blue';

</style>
