<template>
  <Frame>
    <Page>
      <ActionBar :title="actionBarTitle">
        <ActionItem @tap="$modal.close(null)"
                    text="Cancel" ios.position="left"
                    android.position="actionBar" />
      </ActionBar>
        <StackLayout stretchLastChild="false">
          <TextView
              v-model="statusText"
              hint="Enter text..."
              @loaded="onTextViewLoaded"
              autocorrect="true"
          />
          <DockLayout>
            <Button text="checkin" @tap="runCheckin" dock="right"/>
          </DockLayout>
        </StackLayout>
    </Page>
  </Frame>
</template>

<script lang="ts">
import Vue from "nativescript-vue";
import {checkin} from "~/api.service";

export default Vue.extend({
  name: "CheckinSheetComponent",
  props: {
    lineName: {
      type: String
    },
    tripId: {
      type: String
    },
    start: {
      type: Object
    },
    destination: {
      type: Object
    },
    departure: {
      type: String
    },
    arrival: {
      type: String
    }
  },
  data() {
    return {
      statusText: ""
    }
  },
  computed: {
    actionBarTitle() {
      return this.$props.lineName + " ➜ " + this.$props.destination.name;
    }
  },
  methods: {
    onTextViewLoaded(args: any) {
      args.object.focus();
    },
    runCheckin() {
      checkin(
          this.$props.tripId,
          this.$props.lineName,
          this.$props.start.id,
          this.$props.destination.id,
          this.$props.departure,
          this.$props.arrival,
          false,
          this.statusText
      ).then((response) => {
        console.info(response);
      });
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
