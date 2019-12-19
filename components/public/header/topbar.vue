<template>
  <el-row :gutter="0" class="m-header">
    <el-col :span="5">
      <position />
    </el-col>
    <el-col :span="5">
      <user />
    </el-col>
    <el-col :span="14">
      <nav-bar />
    </el-col>
  </el-row>
</template>

<script>
import Position from './position.vue'
import User from './user.vue'
import NavBar from './nav.vue'

export default {
  components: {
    Position,
    User,
    NavBar
  }
}
</script>

<style lang="scss">
  @import '@/assets/css/public/layout.scss';
</style>
