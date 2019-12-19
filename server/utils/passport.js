/**
 * 第一次从数据库查询用户, 后面用session验证
 */
import passport from 'koa-passport'
import LocalStrategy from 'passport-local'

import UserModel from '../dbs/models/users'

passport.use(new LocalStrategy(async function(username, password, done){
  let where = {
    username 
  }
  let result = await UserModel.findOne(where)
  if(result !== null){
    if(result.password === password){
      return done(null, result)
    }else{
      return done(null, result, '密码错误!')
    }
  }else{
    return done(null, false, '用户名不存在!')
  }
}))

passport.serializeUser(function(user, done){
  done(null, user)
})

passport.deserializeUser(function(user, done){
  return done(null, user)
})

export default passport