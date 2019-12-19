import Router from 'koa-router'
import axios from 'axios'

// import Categroy from '../dbs/models/categroy'
import serverConfig from '../utils/serverConf'

let router = new Router({
  prefix: '/categroy'
})

// const sign = '5a73404d53ba42252abb65581300b672'

router.get('/crumbs', async (ctx) => {
  let {status, data: {areas, types}} = await axios.get(serverConfig.signUrl + '/categroy/crumbs', {
    params: {
      city: ctx.query.city.replace('市', '') || '西安',
      sign: serverConfig.sign
    }
  })
  ctx.body = {
    areas: status === 200 ? areas : [],
    types: status === 200 ? types: []
  }
})

export default router