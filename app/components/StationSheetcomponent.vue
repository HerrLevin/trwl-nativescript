<template>
  <Frame>
    <Page>
      <ActionBar title="Select point of departure">
        <ActionItem @tap="$modal.close(null)"
                    text="Cancel" ios.position="left"
                    android.position="actionBar" />
        <ActionItem @tap="$modal.close(null)"
                    text="GPS" ios.position="right"
                    android.position="actionBar" />
      </ActionBar>
        <GridLayout rows="auto, *">
          <SearchBar hint="Search hint" row="0" v-model="searchPhrase" @textChange="onTextChanged" @loaded="onSearchBarLoaded"/>
          <ListView for="item in stations" row="1" ref="list" class="list-group">
            <v-template>
              <Label :text="item" @tap="onTapListItem(item)" class="list-group-item"/>
            </v-template>
          </ListView>
        </GridLayout>
    </Page>
  </Frame>
</template>

<script lang="ts">
import Vue from "nativescript-vue";

export default Vue.extend({
  data() {
    return {
      stations: ['a', 'b', 'c'],
      searchPhrase: ''
    }
  },
  methods: {
    onTextChanged() {
      this.stations.forEach((value, index) => {
        this.stations[index] = this.searchPhrase;
      });
      this.$refs.list.refresh();
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

<style scoped lang="scss">
@import '@nativescript/theme/scss/variables/blue';

// Custom styles
.fas {
  @include colorize($color: accent);
}

.info {
  font-size: 20;
  horizontal-align: center;
  vertical-align: center;
}
</style>
