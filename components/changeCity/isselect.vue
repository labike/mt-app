<template>
  <div class="m-iselect">
    <span class="name">按省份选择:</span>
    <el-select v-model="provinceValue" placeholder="请选择省份">
      <el-option
        v-for="item in province"
        :key="item.value"
        :label="item.label"
        :value="item.value">
      </el-option>
    </el-select>
    <el-select v-model="cityValue" :disabled="!city.length" placeholder="请选择城市">
      <el-option
        v-for="item in city"
        :key="item.value"
        :label="item.label"
        :value="item.value">
      </el-option>
    </el-select>
    <el-autocomplete
      v-model="input"
      :fetch-suggestions="querySearchAsync"
      placeholder="请输入城市名称"
      @select="handleSelect"
    ></el-autocomplete>
  </div>
</template>

<script>
  import _ from 'lodash'

  export default {
    data(){
      return{
        province: [],
        provinceValue: '',
        city: [],
        cityValue: '',
        input: ''
      }
    },
    watch: {
      async provinceValue(newPvalue){
        const _this = this
        let {status, data: {city}} = await _this.$axios.get(`/position/province/${newPvalue}`)
        if(status === 200){
          _this.city = city.map(item => {
            return {
              value: item.id,
              label: item.name
            }
          })
          _this.cityValue = ''
        }
      }
    },
    async mounted(){
      const _this = this
      let {status, data: {province}} = await _this.$axios.get('/position/province')
      if(status === 200){
        _this.province = province.map(item => {
          return {
            value: item.id,
            label: item.name
          }
        })
      }
    },
    methods: {
      querySearchAsync: _.debounce(async function(query, cb){
        const _this = this
        if(_this.city.length){
          // 城市过滤搜索, 比如搜索带'西'的城市, 会返回'西安, 西宁...'
          cb(_this.city.filter(item => item.value.indexOf(query) > -1))
        }else{
          let {status, data: {city}} = await _this.$axios.get('/position/city')
          if(status === 200){
            _this.cities = city.map(item => {
              return {
                value: item.name
              }
            })
            cb(_this.cities.filter(item => item.value.indexOf(query) > -1))
          }else{
            cb([])
          }
        }
      }, 200),
      handleSelect(item){
        location.href = '/'
      }
    }
  }
</script>

<style lang="scss">
@import '@/assets/css/changecity/iselect.scss'
</style>