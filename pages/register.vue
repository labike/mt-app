<template>
  <div class="page-register">
    <article class="header">
      <header>
        <a href="/" class="site-logo"></a>
        <span class="login">
          <em class="bold">已有美团账号?</em>
          <router-link to="/login">
            <el-button type="primary" size="small">登录</el-button>
          </router-link>
        </span>
      </header>
    </article>
    <section>
      <el-form :rules="rules" ref="ruleForm" :model="ruleForm" label-width="80px" size="mini">
        <el-form-item label="昵称" prop="name">
          <el-input v-model="ruleForm.name" />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="ruleForm.email" />
          <el-button type="mini" round @click="sendEmailMsg">发送验证码</el-button>
          <span class="status">{{statusMsg}}</span>
        </el-form-item>
        <el-form-item label="验证码" prop="code">
          <el-input v-model="ruleForm.code" maxlength="4"/>
        </el-form-item>
        <el-form-item label="密码" prop="pwd">
          <el-input v-model="ruleForm.pwd" type="password"/>
        </el-form-item>
        <el-form-item label="确认密码" prop="cpwd">
          <el-input v-model="ruleForm.cpwd" type="password"/>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="sure">同意并注册</el-button>
          <div class="error">{{error}}</div>
        </el-form-item>
        <el-form-item>
          <a class="f1" href="http://www.meituan.com/about/terms" target="_blank">《美团网用户协议》</a>
        </el-form-item>
      </el-form>
    </section>
  </div>
</template>

<script>
  import CryptoJS from 'crypto-js'

  export default {
    layout: 'empty',
    data(){
      return {
        statusMsg: '',
        error: '',
        ruleForm: {
          name: '',
          code: '',
          pwd: '',
          cpwd: '',
          email: ''
        },
        rules: {
          name: [
            {
              required: true,
              type: 'string',
              message: '昵称不能为空!',
              trigger: 'blur'
            }
          ],
          email: [
            {
              required: true,
              type: 'email',
              message: '邮箱不能为空或格式错误!',
              trigger: 'blur'
            }
          ],
          pwd: [
            {
              required: true,
              message: '密码不能为空!',
              trigger: 'blur'
            }
          ],
          cpwd: [
            {
              required: true,
              message: '确认密码不能为空!',
              trigger: 'blur'
            },
            {
              validator: (rule, value, callback) => {
                if(value === ''){
                  callback(new Error('请再次输入密码'))
                }else if(value !== this.ruleForm.pwd){
                  callback(new Error('两次输入密码不一致'))
                }else{
                  callback()
                }
              },
              trigger: 'blur'
            }
          ]
        }
      }
    },
    methods: {
      sendEmailMsg(){
        const _this = this
        let namePass, emailPass
        if(_this.timerId){
          return false
        }
        this.$refs['ruleForm'].validateField('name', valid => {
          namePass = valid
        })
        _this.statusMsg = ''
        if(namePass){
          return false
        }
        this.$refs['ruleForm'].validateField('email', valid => {
          emailPass = valid
        })
        if(!namePass && !emailPass){
          _this.$axios.post('/users/verify', {
            username: window.encodeURIComponent(_this.ruleForm.name), 
            email: _this.ruleForm.email
          }).then(({status, data}) => {
            if(status === 200 && data && data.code === 0){
                let count = 60
                _this.statusMsg = `验证码已发送, 剩余${count--}秒`
                _this.timerId = setInterval(() => {
                  _this.statusMsg = `验证码已发送, 剩余${count--}秒`
                  if(count == 0){
                    clearInterval(_this.timerId)
                    _this.statusMsg = ''
                  }
                }, 1000)
            }else{
                _this.statusMsg = data.msg
            }
          })
        }
      },
      sure(){
        let _this = this
        this.$refs['ruleForm'].validate(valid => {
          if(valid){
            _this.$axios.post('/users/signup', {
              username: window.encodeURIComponent(_this.ruleForm.name),
              password: CryptoJS.MD5(_this.ruleForm.pwd).toString(),
              email: _this.ruleForm.email,
              code: _this.ruleForm.code
            }).then(({status, data}) => {
              if(status === 200){
                if(data && data.code === 0){
                  window.location.href = '/login'
                }else{
                  _this.statusMsg = data.msg
                }
              }else{
                _this.error = `服务端出错, 错误码${status}`
              }
              setTimeout(() => {
                _this.error = ''
              }, 500)
            })
          }
        })
      }
    }
  }
</script>

<style lang="scss">
@import '@/assets/css/register/index.scss'
</style>