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
import {API} from "~/api.service";

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
      let api = new API(this);

      api.checkin(
          this.$props.tripId,
          this.$props.lineName,
          this.$props.start.id,
          this.$props.destination.id,
          this.$props.departure,
          this.$props.arrival,
          false,
          this.statusText
      ).then((response) => {
        console.log(response);
        const status = response.data.status;
        const points = response.data.points;
        alert({
          title: "Checkin Success!",
          message: `You've successfully checked into ${status.train.lineName} with ${points.points} points in status id ${status.id}`,
          okButtonText: "NICE!"
        }).then(() => {
          this.$modal?.close();
        })
        console.info(response);
      }).catch(console.error);
    }
  }
});
</script>

<style scoped lang="scss">
@import '@nativescript/theme/scss/variables/ruby';

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
