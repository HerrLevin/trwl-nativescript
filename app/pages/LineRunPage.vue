<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: "LineRunPage",
  props: {
    lineName: {
      type: String,
      default: 'LINIENNUMMER'
    }
  },
  data() {
    return {
      departures: ['a', 'b', 'c']
    }
  },
})
</script>

<template>
  <Page>
    <ActionBar :title="$props.lineName"/>
    <ListView for="departure in departures" class="list-group">
      <v-template>
        <GridLayout columns="100, *, 40">
          <Label col="0">RE 1435</Label>
          <Label col="1" :text="departure" class="list-group-item"/>
          <Label col="2">12:14</Label>
        </GridLayout>
      </v-template>
    </ListView>
  </Page>
</template>

<style scoped lang="scss">
@import '@nativescript/theme/scss/variables/blue';

</style>
