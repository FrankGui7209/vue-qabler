<template>
  <div class="home">
    <q-header></q-header>
    <q-tab tab="device"></q-tab>
    <!--<router-view></router-view>-->
    <device-table></device-table>
    <q-footer></q-footer>
  </div>
</template>

<script>
  import QHeader from '@/views/q-header/QHeader.vue'
  import QTab from '@/views/q-tab/QTab.vue'
  import QFooter from '@/views/q-footer/QFooter.vue'
  import DeviceTable from "./components/DeviceTable";

  export default {
    name: 'DeviceManage',
    components: {
      DeviceTable,
      QHeader,
      QTab,
      QFooter
    },
    data() {
      return {}
    },
  }
</script>

<style lang="stylus" scoped>
</style>
