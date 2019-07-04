<template>
  <div class="home">
    <q-header></q-header>
    <q-tab tab="user"></q-tab>
    <!--<router-view></router-view>-->
    <user-table></user-table>
    <q-footer></q-footer>
  </div>
</template>

<script>
  import QHeader from '@/views/q-header/QHeader.vue'
  import QTab from '@/views/q-tab/QTab.vue'
  import QFooter from '@/views/q-footer/QFooter.vue'
  import UserTable from "./components/UserTable";

  export default {
    name: 'UserManage',
    components: {
      UserTable,
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
