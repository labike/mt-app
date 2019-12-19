<template>
  <div class="search-panel">
    <el-row class="m-header-searchbar">
      <el-col :span="3" class="left">
        <a href="/">
          <img src="https://s0.meituan.net/bs/fe-web-meituan/e5eeaef/img/logo.png" alt="美团">
        </a>
      </el-col>
      <el-col :span="15" class="center">
        <div class="wrapper">
          <el-input placeholder="搜索商家或地点" v-model="search" @focus="focus" @blur="blur" @input="input"/>
          <button class="el-button el-button--primary">
            <i class="el-icon-search"></i>
          </button>
          <!--获取焦点无关键词-->
          <dl class="hotPlace" v-if="isHotPlace">
            <dt>热门搜索</dt>
            <dd v-for="(item, idx) in $store.state.home.hotPlace.slice(0, 5)" :key="idx">
              <a :href="'/products?keyword=' + encodeURIComponent(item.name)">{{item.name}}</a>
            </dd>
          </dl>
          <!--获取焦点输入关键词-->
          <dl class="searchList" v-if="isSearchList">
            <dd v-for="(item, idx) in searchList" :key="idx">
              <a :href="'/products?keyword=' + encodeURIComponent(item.name)">{{item.name}}</a>  
            </dd>
          </dl>
        </div>
        <!--搜索框底部固定内容-->
        <p class="suggest">
          <a 
            :href="'/products?keyword=' + encodeURIComponent(item.name)" 
            v-for="(item, idx) in $store.state.home.hotPlace.slice(0, 5)" 
            :key="idx"
          >{{item.name}}</a>
        </p>
        <ul class="nav">
          <li>
            <nuxt-link to="/" class="takeout">美团外卖</nuxt-link>
          </li>
          <li>
            <nuxt-link to="/" class="movie">猫眼电影</nuxt-link>
          </li>
          <li>
            <nuxt-link to="/" class="hotel">美团酒店</nuxt-link>
          </li>
          <li>
            <nuxt-link to="/" class="apartment">民宿公寓</nuxt-link>
          </li>
          <li>
            <nuxt-link to="/" class="business">商家入驻</nuxt-link>
          </li>
        </ul>
      </el-col>
      <el-col :span="6" class="right">
        <ul class="security">
          <li>
            <i class="refund"></i>
            <p class="txt">随时退</p>  
          </li> 
          <li>
            <i class="single"></i>
            <p class="txt">不满意免单</p>  
          </li> 
          <li>
            <i class="overdue"></i>
            <p class="txt">过期退</p>  
          </li>  
        </ul> 
      </el-col>
    </el-row>
  </div>
</template>

<script>
import _ from 'lodash'

export default {
  data(){
    return{
      search: '',
      isFocus: false,
      hotPlace: [],
      searchList: []
    }
  },
  computed: {
    // 热门推荐必须是聚焦状态和无关键词, 搜索推荐必须有关键词
    isHotPlace(){
      return this.isFocus && !this.search
    },
    isSearchList(){
      return this.isFocus && this.search
    }
  },
  methods: {
    focus(){
      this.isFocus = true
    },
    blur(){
      let _this = this
      setTimeout(() => {
        _this.isFocus = false
      }, 100)
    },
    input: _.debounce(async function(){
        let _this = this
        let city = _this.$store.state.position.position.city.replace('市', '')
        _this.searchList = []
        let {status, data: {top}} = await _this.$axios.get('/search/top', {
          params: {
            input: _this.search,
            city
          }
        })
        _this.searchList = top.slice(0, 10)
      }, 300)
    }
  
}
</script>

<style lang="scss">
  
</style>