<script lang="ts">
import Vue from 'vue'
import Page2Page from "~/components/Page2Page.vue";
import {API, Status} from "~/api.service";

export default Vue.extend({
  name: "HomePage.vue",
  data() {
    return {
      items: <Status[]> []
    }
  },
  methods: {
    fetchDashboard() {
      let api = new API(this);
      api.getDashboard().then((result) => {
        this.items = result.data;
        this.$refs.dashboardListView.refresh();
      }).catch(console.error);
    }
  }
})
</script>

<template>
  <Page @loaded="fetchDashboard">
    <RadListView for="item in items" ref="dashboardListView">
      <v-template>
        <StackLayout class="cars-list__item">
          <GridLayout class="cars-list__item-content" columns="*, 40" rows="*, *, *">
            <Label :text="'@' + item.username" class="cars-list__item-name font-weight-bold"/>
            <Label class="m-r-5" col="1" horizontalAlignment="right">
              <FormattedString>
                <Span text.decode="&hearts;"/>
                <Span text="..."/>
              </FormattedString>
            </Label>

            <Label class="hr m-y-5" colSpan="2" row="1"/>

            <StackLayout row="2" colSpan="2" verticalAlignment="center">
              <Label class="p-b-10">
                <FormattedString ios.fontFamily="system">
                  <Span class="fas cars-list__item-icon" text.decode="&#xf041;    "></Span>
                  <Span :text="item.train.origin.name"/>
                </FormattedString>
              </Label>
              <Label class="p-b-10">
                <FormattedString ios.fontFamily="system">
                  <Span class="fas cars-list__item-icon" text.decode="&#xf11e;    "/>
                  <Span :text="item.train.destination.name"/>
                </FormattedString>
              </Label>
            </StackLayout>
          </GridLayout>
        </StackLayout>
      </v-template>
    </RadListView>
  </Page>
</template>

<style scoped lang="scss">
@import '@nativescript/theme/scss/variables/ruby';
// Custom styles
.cars-list {
  &__item {
    padding: 0 0 8 0;
    @include colorize($background-color: background-alt-10);

    &-content {
      padding: 8 15 4 15;
      @include colorize($background-color: background);
    }

    &-name,
    &-icon {
      @include colorize($contrasted-color: complementary background 30% 0%);
    }
  }
}
</style>
