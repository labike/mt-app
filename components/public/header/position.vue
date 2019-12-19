<template>
  <div class="m-geo">
    <i class="el-icon-location" />{{$store.state.position.position.city}}
    <nuxt-link class="change-city" to="/changecity">切换城市</nuxt-link>
    [陕西 西安 未央区]
  </div>
</template>