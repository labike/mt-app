<template>
  <div class="m-hcity">
    <dl>
      <dt>热门城市</dt>
      <dd v-for="item in list" :key="item.id">
        {{item.name === '市辖区' ? item.province : item.name}}
      </dd>
    </dl>
  </div>
</template>

<script>
  export default {
    data(){
      return{
        list: []
      }
    },
    async mounted(){
      let {status, data: {hots}} = await this.$axios.get('/position/hotCity')
      if(status === 200){
        let result = {};
        let finalResult=[];
        for(let i=0;i<hots.length;i++){
            result[hots[i].id]=hots[i];
        }
        for(let item in result){
            finalResult.push(result[item]);
        }
        this.list = finalResult
      }
    }
  }
</script>

<style lang="scss">
@import '@/assets/css/changecity/hot.scss'
</style>