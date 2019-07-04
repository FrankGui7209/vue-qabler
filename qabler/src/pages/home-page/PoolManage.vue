<template>
  <div class="home">
    <q-header></q-header>
    <q-tab tab="pool"></q-tab>
    <!--<router-view></router-view>-->
    <pool-table></pool-table>
    <q-footer></q-footer>
  </div>
</template>

<script>
  import QHeader from '@/views/q-header/QHeader.vue'
  import QTab from '@/views/q-tab/QTab.vue'
  import QFooter from '@/views/q-footer/QFooter.vue'
  import PoolTable from "./components/PoolTable";

  export default {
    name: 'PoolManage',
    components: {
      PoolTable,
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
