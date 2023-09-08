<script lang="ts">
import Vue from "nativescript-vue";
import debounce from 'lodash-es/debounce'
import {API, ShortTrainStation} from "~/api.service";
import {isEmpty} from "lodash-es";

export default Vue.extend({
  data() {
    return {
      stations: <ShortTrainStation[]>[],
      searchPhrase: '',
      onTextchanged: <any> null
    }
  },
  props: {
    input: {type: String, default: ""}
  },
  mounted() {
    this.searchPhrase = this.$props.input;
    this.onTextchanged = debounce(this.fetchStations, 200);
  },
  destroyed() {
    if (this.onTextchanged) {
      this.onTextchanged.cancel();
    }
  },
  methods: {
    fetchStations() {
      let api = new API(this);
      if (isEmpty(this.searchPhrase)) {
        return;
      }
      api.autocomplete(this.searchPhrase).then((result) => {
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
            <GridLayout class="list-group-item" columns="*, 40">
              <Label
                  col="0"
                  :text="`${station.name} ${station.rilIdentifier ? '(' + station.rilIdentifier + ')' : ''}`"
                  @tap="onTapListItem(station.name)"
              />
              <Label col="1">
                <FormattedString>
                  <Span class="far" text.decode="&#xf005; "/>
                </FormattedString>
              </Label>
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
