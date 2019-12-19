<template>
  <div>
    <dl class="m-categroy">
      <dt>按拼音首字母选择:</dt>
      <dd v-for="item in list" :key="item">
        <a :href="'#city-' + item">{{item}}</a>
      </dd>
    </dl>
    <dl v-for="item in block" :key="item.title" class="m-categroy-section">
      <dt :id="'city-' + item.title">{{item.title}}</dt>
      <dd>
        <span v-for="c in item.city" :key="c">{{c}}</span>
      </dd>
    </dl>
  </div>
</template>

<script>
  import pinyin from 'js-pinyin'

  export default {
    data(){
      return{
        list: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split(''),
        block: []
      }
    },
    async mounted() {
      const _this = this
      let blocks = []
      let {status, data: {city}} = await _this.$axios.get('/position/city')
      if(status === 200){
        let p
        let c
        let d = {}
        // 去重
        let cityResult = {};
        let cityFinalResult=[];
        for(let i=0;i<city.length;i++){
          cityResult[city[i].name]=city[i];
        }
        for(let item in cityResult){
          cityFinalResult.push(cityResult[item]);
        }
        cityFinalResult.forEach(item => {
          p = pinyin.getFullChars(item.name).toLocaleLowerCase().slice(0, 1)
          c = p.charCodeAt(0)
          if( c > 96 && c < 123){
            if(!d[p]){
              d[p] = []
            }
            d[p].push(item.name)
          }
        })
        for(let [k, v] of Object.entries(d)){
          blocks.push({
            title: k.toUpperCase(),
            city: v
          })
        }
        blocks.sort((a, b) => a.title.charCodeAt(0) - b.title.charCodeAt(0))
        _this.block = blocks
      }
    },
  }
</script>

<style lang="scss">
@import '@/assets/css/changecity/categroy.scss'
</style>