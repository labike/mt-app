<template>
  <div class="page-index">
    <el-row>
      <el-col :span="5">
        <emenu />
      </el-col>
      <el-col :span="19">
        <life />
      </el-col>
    </el-row>
    <el-row :span="24">
      <art />
    </el-row>
  </div>
</template>

<script>
import Emenu from '@/components/index/menu.vue'
import Life from '@/components/index/life.vue'
import Art from '@/components/index/artistic.vue'

export default {
  components: {
    Emenu,
    Life,
    Art
  }
}
</script>

<style lang="scss">
  @import '@/assets/css/index/index.scss'
</style>