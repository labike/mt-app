/**
 * 搜索查询接口
 */
import Router from 'koa-router'
import axios from 'axios'

// import Poi from '../dbs/models/poi'
import serverConfig from '../utils/serverConf'

const router = new Router({
  prefix: '/search'
})

// const sign = '5a73404d53ba42252abb65581300b672'

router.get('/top', async (ctx) => {
  let {status, data:{top}} = await axios.get(serverConfig.signUrl + '/search/top', {
    params: {
      input: ctx.query.input,
      city: ctx.query.city,
      sign: serverConfig.sign
    }
  })
  ctx.body = {
    top: status === 200 ? top : []
  }
})

router.get('/hotPlace', async (ctx) => {
  let city = ctx.store ? ctx.store.position.position.city : ctx.query.city
  let {status, data: {result}} = await axios.get(serverConfig.signUrl + '/search/hotPlace', {
    params: {
      sign: serverConfig.sign,
      city
    }
  })
  ctx.body = {
    result: status === 200 ? result : []
  }
})

router.get('/resultsByKeywords', async (ctx) => {
  let {city, keyword} = ctx.query
  let {status, data:{count, pois}} = await axios.get(serverConfig.signUrl + '/search/resultsByKeywords', {
    params: {
      city,
      keyword,
      sign: serverConfig.sign
    }
  })
  ctx.body = {
    count: status === 200 ? count : 0,
    pois: status === 200 ? pois : []
  }
})

router.get('/products', async (ctx) => {
  let keyword = ctx.query.keyword || '旅游'
  let city = ctx.query.city || '西安'
  let {status, data: {product, more}} = await axios.get(serverConfig.signUrl + '/search/products', {
    params: {
      keyword,
      city,
      sign: serverConfig.sign
    }
  })
  if(status === 200){
    ctx.body = {
      product,
      more: ctx.isAuthenticated() ? more : [],
      login: ctx.isAuthenticated()
    }
  }else{
    ctx.body = {
      product: {},
      more: ctx.isAuthenticated() ? more : [],
      login: ctx.isAuthenticated()
    }
  }
})

export default router