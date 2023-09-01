<script lang="ts">
import Vue from 'vue'
import Page2Page from "~/components/Page2Page.vue";

export default Vue.extend({
  name: "HomePage.vue",
  methods: {
    page1BtnTap(args: any) {
      //this.$navigateTo(Page2Page, { frame: 'main' });
      this.$showModal(Page2Page);
    }
  }
})
</script>

<template>

  <Page>
    <StackLayout>
      <Label text="HomePage"/>
      <Button text="Go to 2" @tap="page1BtnTap" />
    </StackLayout>
  </Page>

</template>

<style scoped lang="scss">

</style>
