<template>
  <div class="m-menu">
    <dl class="nav" @mouseleave="leave">
      <dt>全部分类</dt>
      <dd v-for="(item, idx) in $store.state.home.menu" :key="idx" @mouseenter="enter">
        <i :class="item.type"></i>
        {{item.name}}
        <span class="arrow"></span>
      </dd>
    </dl>
    <div class="detail" v-if="kind" @mouseenter="sover" @mouseleave="sleaveout">
      <template v-for="(item, idx) in currentDetail.child">
        <h4 :key="idx">{{item.title}}</h4>
        <span v-for="v in item.child" :key="v">{{v}}</span>
      </template>
    </div>
  </div>
</template>

<script>
export default {
  data(){
    return{
      kind: '',
      menu: []
    }
  },
  computed: {
    currentDetail(){
      return this.$store.state.home.menu.filter(item => item.type === this.kind)[0]
    }
  },
  methods: {
    leave(){
      let _this = this
      _this.timer = setTimeout(() => {
        _this.kind = ''
      }, 150)
    },
    enter(e){
      this.kind = e.target.querySelector('i').className
    },
    sleaveout(){
      this.kind = ''
    },
    sover(){
      clearTimeout(this.timer)
    }
  }
}
</script>

<style lang="scss">
  
</style>