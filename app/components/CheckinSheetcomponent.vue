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
          <GridLayout columns="auto,auto,*,auto" class="p-0 m-0" rows="auto">
            <Button col="0" class="fas round m-r-1" :text="visibilityIcon" @tap="changeVisibility"></Button>
            <Button col="1" class="fas round m-x-0" :text="businessIcon" @tap="changeBusiness"></Button>
            <Button
                col="3"
                class="fab"
                :class="toot ? 'round' : '-outline'"
                text.decode="&#xf4f6;"
                @tap="changeToot"
            />
          </GridLayout>
          <DockLayout>
            <Button text="Cancel" class="-outline cancel" dock="left" @tap="$modal.close(null)"/>
            <Button text="checkin" class="round" @tap="runCheckin" dock="right"/>
          </DockLayout>
        </StackLayout>
    </Page>
  </Frame>
</template>

<script lang="ts">
import Vue from "nativescript-vue";
import {API, Business, Visibility} from "~/api.service";

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
      statusText: "",
      showPicker: false,
      visibility: <Visibility> Visibility.Public,
      business: <Business> Business.Private,
      toot: false,
    }
  },
  computed: {
    actionBarTitle() {
      return this.$props.lineName + " ➜ " + this.$props.destination.name;
    },
    visibilityIcon() {
      let icons = ["\uf0ac", "\uf3c1", "\uf500", "\uf023", "\uf4fc"];

      return icons[this.visibility.toFixed()];
    },
    businessIcon() {
      let icons = ["\uf183", "\uf0b1", "\uf1ad"];

      return icons[this.business.toFixed()];
    }
  },
  methods: {
    changeVisibility() {
      if (this.visibility === Visibility.Authenticated) {
        this.visibility = 0;
        return;
      }
      this.visibility++;
    },
    changeBusiness() {
      if (this.business === 2) {
        this.business = 0;
        return;
      }
      this.business++;
    },
    changeToot() {
      this.toot = !this.toot;
    },
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
          this.statusText,
          this.business,
          this.visibility,
          null,
          this.toot
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
//  @include colorize($color: accent);
}

.info {
  font-size: 20;
  horizontal-align: center;
  vertical-align: center;
}

.round {
  android-elevation: 0;
  background-color: $btn-color-secondary;
  border-radius: 50%;
  text-align: center;
  border: 1px solid $btn-color-secondary;
}

.cancel {
  border-color: $complementary !important;
}

Button.-outline {
  android-elevation: 0;
  background-color: transparent;
  border-radius: 50%;
  text-align: center;
}
</style>
