import Router from 'koa-router'
import axios from 'axios'
import md5 from 'crypto-js/md5'

import Order from '../dbs/models/order'
import Cart from '../dbs/models/cart'

let router = new Router({
  prefix: '/order'
})

router.post('/createOrder', async (ctx) => {
  let {id, price, count} = ctx.request.body
  let time = Date()
  let orderId = md5(Math.random() * 1000 + time).toString()
  if(!ctx.isAuthenticated()){
    ctx.body = {
      code: -1,
      msg: '请登录'
    }
  }else{
    let findCart = await Cart.findOne({
      cartNo: id
    })
    let order = new Order({
      id: orderId,
      count,
      total: price * count,
      time,
      user: ctx.session.passport.user,
      name: findCart.detail[0].name,
      imgs: findCart.detail[0].imgs,
      status: 0
    })
    try{
      let result = await order.save()
      if(result){
        await findCart.remove()
        ctx.body = {
          code: 0,
          id: orderId,
        }
      }else{
        ctx.body = {
          code: -1
        }
      }
    }catch(e){
      ctx.body = {
        code: -1
      }
    }
  }
})

router.post('/getOrders', async (ctx) => {
  if(!ctx.isAuthenticated()){
    ctx.body = {
      code: -1,
      list: [],
      msg: '请登录'
    }
  }else{
    try{
      let result = await Order.find()
      if(result){
        ctx.body = {
          code: 0,
          list: result
        }
      }else{
        ctx.body = {
          code: -1,
          list: []
        }
      }
    }catch(e){
      ctx.body = {
        code: -1,
        list: []
      }
    }
  }
})

export default router