<script lang="ts">
import Vue from "nativescript-vue";
import debounce from 'lodash-es/debounce'
import {autocomplete, ShortTrainStation} from "~/api.service";

export default Vue.extend({
  data() {
    return {
      stations: <ShortTrainStation[]>[],
      searchPhrase: '',
      onTextchanged: <any> null
    }
  },
  mounted() {
    this.onTextchanged = debounce(this.fetchStations, 200);
  },
  destroyed() {
    if (this.onTextchanged) {
      this.onTextchanged.cancel();
    }
  },
  methods: {
    fetchStations() {
      autocomplete(this.searchPhrase).then((result) => {
        this.stations = result.data;
        this.$refs.list.refresh();
      });
    },
    onTapListItem(args: string) {
      this.$modal.close(args);
    },
    onSearchBarLoaded(args: any) {
      args.object.focus();
    }
  }
});
</script>

<template>
  <Frame>
    <Page>
      <ActionBar title="Select point of departure">
        <ActionItem @tap="$modal.close(null)"
                    text="Cancel" ios.position="left"
                    android.position="actionBar"/>
        <ActionItem @tap="$modal.close(null)"
                    text="GPS" ios.position="right"
                    android.position="actionBar"/>
      </ActionBar>
      <GridLayout rows="auto, *">
        <SearchBar hint="Search hint" row="0" v-model="searchPhrase" @textChange="onTextchanged"
                   @loaded="onSearchBarLoaded"/>
        <ListView for="station in stations" row="1" ref="list" class="list-group">
          <v-template>
            <GridLayout class="list-group-item">
              <Label
                  :text="`${station.name} ${station.rilIdentifier ? '(' + station.rilIdentifier + ')' : ''}`"
                  @tap="onTapListItem(station.name)"
              />
            </GridLayout>
          </v-template>
        </ListView>
      </GridLayout>
    </Page>
  </Frame>
</template>

<style scoped lang="scss">
@import '@nativescript/theme/scss/variables/ruby';

// Custom styles
.fas {
  @include colorize($color: accent);
}

</style>
