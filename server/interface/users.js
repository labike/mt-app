/**
 * 登录, 注册, 邮箱验证, 登出, 获取用户信息
 */
import Router from 'koa-router'
import Redis from 'koa-redis'
import nodeMailer from 'nodemailer'

import UserModel from '../dbs/models/users'
import Passport from '../utils/passport'
import Email from '../dbs/config'
import axios from '../utils/axios'

let router = new Router({
  prefix: '/users'
})

let Store = new Redis().client

router.post('/signup', async (ctx) => {
  const {username, password, email, code} = ctx.request.body
  // 从redis中读取存储的code
  if(code){
    const saveCode = await Store.hget(`nodemail: ${username}`, 'code')
    const saveExpire = await Store.hget(`nodemail: ${username}`, 'expire')
    if(code === saveCode){
      if(new Date().getTime() - saveExpire > 0){
        ctx.body = {
          code: -1,
          msg: '验证码已过期, 请重新发送!'
        }
        return false
      }
    }else{
      ctx.body = {
        code: -1,
        msg: '请填写正确的验证码!'
      }
    }
  }else{
    ctx.body = {
      code: -1,
      msg: '请填写验证码!'
    }
  }
  // 验证用户名密码
  let user = await UserModel.find({username})
  if(user.length){
    ctx.body = {
      code: -1,
      msg: '用户名已注册!'
    }
    return 
  }
  // 写入数据库
  let newUser = await UserModel.create({
    username,
    password,
    email
  })
  if(newUser){
    let res = await axios.post('/users/signin', {username, password})
    if(res.data && res.data.code === 0){
      ctx.body = {
        code: 0,
        msg: '注册成功!',
        user: res.data.user
      }
    }else{
      ctx.body = {
        code: -1,
        msg: '服务端出错!'
      }
    }
  }else{
    ctx.body = {
      code: -1,
      msg: '注册失败!'
    }
  }
})

router.post('/signin', async (ctx, next) => {
  return Passport.authenticate('local', function(err, user, info, status){
    if(err){
      ctx.body = {
        code: -1,
        msg: err
      }
    }else{
      if(user){
        ctx.body = {
          code: 0,
          msg: '登录成功',
          user
        }
        return ctx.login(user)
      }else{
        ctx.body = {
          code: -1,
          msg: info
        }
      }
    }
  })(ctx, next)
})

router.post('/verify', async (ctx, next) => {
  let username = ctx.request.body.username
  let saveExpire = await Store.hget(`nodemail: ${username}`, 'expire')
  if(saveExpire && new Date().getTime() - saveExpire < 0){
    ctx.body = {
      code: -1,
      msg: '请勿频繁刷新! 一分钟一次!'
    }
    return false
  }
  // 发送邮件
  let transport = nodeMailer.createTransport({
    host: Email.smtp.host,
    port: 587,
    secure: false,
    auth: {
      user: Email.smtp.user,
      pass: Email.smtp.pass
    }
  })
  let ko = {
    code: Email.smtp.code(),
    expire: Email.smtp.expire(),
    email: ctx.request.body.email,
    user: ctx.request.body.username
  }
  let mailOptions = {
    from: `"认证邮件" <${Email.smtp.user}>`,
    to: ko.email,
    subject: '美团网注册',
    html: `美团网注册验证码为: ${ko.code}`
  }
  await transport.sendMail(mailOptions, (err, info) => {
    if(err){
      return err
    }else{
      Store.hmset(`nodemail: ${ko.user}`, 'code', ko.code, 'expire', ko.expire, 'email', ko.email)
    }
  })
  ctx.body = {
    code: 0,
    msg: '验证码已发送, 请注意查收! 一分钟内有效!'
  }
})

router.get('/exit', async (ctx, next) => {
  await ctx.logout()
  if(!ctx.isAuthenticated()){
    ctx.body = {
      code: 0
    } 
  }else{
    ctx.body = {
      code: -1
    }
  }
})

router.get('/getUser', async (ctx, next) => {
  if(ctx.isAuthenticated()){
    const {username, email} = ctx.session.passport.user
    ctx.body = {
      user: username,
      email
    }
  }else{
    ctx.body = {
      user: '',
      email: ''
    }
  }
})

export default router