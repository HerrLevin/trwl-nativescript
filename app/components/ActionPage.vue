<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: "ActionPage.vue",
  methods: {
    tapMeTap() {
      alert("tap!");
    }
  }
})
</script>

<template>

  <Page actionBarHidden="true" backgroundcolor="#42b883">
    <StackLayout height="60" verticalAlignment="top">
      <Button text="TAP ME" @tap="tapMeTap" />
    </StackLayout>
  </Page>

</template>

<style scoped lang="scss">

</style>
