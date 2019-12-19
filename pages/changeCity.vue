<template>
  <div class="page-changeCity">
    <el-row>
      <el-col :span="24">
        <city-select />
      </el-col>
      <el-col :span="24">
        <hot-city />
      </el-col>
      <el-col :span="24">
        <categroy />
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import CitySelect from '@/components/changeCity/isselect.vue'
  import HotCity from '@/components/changeCity/hotcity.vue'
  import Categroy from '@/components/changeCity/categroy.vue'

  export default {
    components: {
      CitySelect,
      HotCity,
      Categroy
    }
  }
</script>

<style lang="scss">

</style>