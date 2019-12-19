/**
 * 定位接口
 */
import Router from 'koa-router'
import axios from 'axios'

// import Province from '../dbs/models/province'
import serverConfig from '../utils/serverConf'

let router = new Router({
  prefix: '/position'
})

// const sign = '5a73404d53ba42252abb65581300b672'

router.get('/getPosition', async (ctx) => {
  let {status, data: {province, city}} = await axios.get(serverConfig.signUrl + `/geo/getPosition?sign=${serverConfig.sign}`)
  if(status === 200){
    ctx.body = {
      province,
      city
    }
  }else{
    ctx.body = {
      province: '',
      city: ''
    }
  }
})

router.get('/province', async (ctx) => {
  // 从数据库读取地址信息
  // let province = await Province.find()
  // ctx.body = {
  //   province: province.map(item => {
  //     return {
  //       id: item.id,
  //       name: item.value[0]
  //     }
  //   })
  // }
  let {status, data: {province}} = await axios.get(serverConfig.signUrl + `/geo/province?sign=${serverConfig.sign}`)
  ctx.body = {
    province: status === 200 ? province : []
  }
})

router.get('/menu', async (ctx) => {
  // const result = await Menu.findOne()
  // ctx.body = {
  //   menu: result
  // }

  let {status, data: {menu}} = await axios.get(serverConfig.signUrl + `/geo/menu?sign=${serverConfig.sign}`)
  if(status === 200){
    ctx.body = {
      menu
    }
  }else{
    ctx.body = {
      menu: []
    }
  }
})

router.get('/province/:id', async (ctx) => {
  // let city = await city.findOne({id: ctx.params.id})

  // ctx.body = {
  //   code: 0,
  //   city: city.value.map(item => {
  //     return {
  //       province: item.province,
  //       id: item.id,
  //       name: item.name
  //     }
  //   })
  // }
  let {status, data: {city}} = await axios.get(serverConfig.signUrl + `/geo/province/${ctx.params.id}?sign=${serverConfig.sign}`)
  if(status === 200){
    ctx.body = {
      city
    }
  }else{
    ctx.body = {
      city: []
    }
  }
})

router.get('/city', async (ctx) => {
  // let city = []
  // let result = await city.find()
  // result.forEach(item => {
  //   city = city.concat(item.value)
  // })
  // ctx.body = {
  //   code: 0,
  //   city: city.map(item => {
  //     return {
  //       province: item.province,
  //       id: item.id,
  //       name: item.name === `市辖区` || item.name === `省直辖县级行政区划` ? item.province : item.name
  //     }
  //   })
  // }
  let {status, data: {city}} = await axios.get(serverConfig.signUrl + `/geo/city?sign=${serverConfig.sign}`)
  if(status === 200){
    ctx.body = {
      city
    }
  }else{
    ctx.body = {
      city: []
    }
  }
})

router.get('/hotCity', async (ctx) => {
  let {status, data: {hots}} = await axios.get(serverConfig.signUrl + `/geo/hotCity?sign=${serverConfig.sign}`)
  if(status === 200){
    ctx.body = {
      hots
    }
  }else{
    ctx.body = {
      hots: []
    }
  }
})

export default router