<template>
  <div class="home">
    <q-header></q-header>
    <q-tab></q-tab>
    <!--<router-view></router-view>-->
    <dashboard></dashboard>
    <q-footer></q-footer>
  </div>
</template>

<script>
  import QHeader from '@/views/q-header/QHeader.vue'
  import QTab from '@/views/q-tab/QTab.vue'
  import QFooter from '@/views/q-footer/QFooter.vue'
  import Dashboard from './components/Dashboard.vue'

  export default {
    name: 'HomePage',
    components: {
      QHeader,
      QTab,
      QFooter,Dashboard
    },
    data() {
      return {}
    },
  }
</script>

<style lang="stylus" scoped>
</style>
