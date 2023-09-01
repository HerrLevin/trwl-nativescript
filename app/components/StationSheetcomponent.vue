<template>
  <Frame>
    <Page>
      <ActionBar title="Select point of departure">
        <ActionItem @tap="$modal.close(null)"
                    text="Cancel" ios.position="left"
                    android.position="actionBar" />
      </ActionBar>
        <GridLayout rows="auto, *">
          <SearchBar hint="Search hint" row="0" v-model="searchPhrase" @textChange="onTextChanged"/>
          <ListView for="item in items" row="1" ref="list">
            <v-template>
              <Label :text="item" @tap="onTapListItem(item)"/>
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
      items: ['a', 'b', 'c'],
      searchPhrase: ''
    }
  },
  methods: {
    onTextChanged() {
      this.items.forEach((value, index) => {
        this.items[index] = this.searchPhrase;
      });
      this.$refs.list.refresh();
    },
    onTapListItem(args) {
      this.$modal.close(args);
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
