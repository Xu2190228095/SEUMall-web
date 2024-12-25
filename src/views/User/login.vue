<template>
    <div>
      <el-card class="login-form-layout">
        <el-form autoComplete="on"
                 :model="loginForm"
                 :rules="loginRules"
                 ref="loginFormRef"
                 label-position="left">
                 
          <div style="text-align: center">
            <svg-icon icon-class="login-mall" style="width: 56px;height: 56px;color: #409EFF"></svg-icon>
          </div>

          <h2 class="login-title color-main">东南易购</h2>

          <el-form-item prop="username">
            <el-input name="username"
                      type="text"
                      v-model="loginForm.username"
                      placeholder="请输入用户名">
            <template v-slot:prefix>
                <svg-icon icon-class="user" class="color-main"></svg-icon>
            </template>
            </el-input>
          </el-form-item>

          <el-form-item prop="password">
            <el-input name="password"
                      :type="pwdType"
                      @keyup.enter="handleLogin"
                      v-model="loginForm.password"
                      placeholder="请输入密码">
            <template v-slot:prefix>
              <svg-icon icon-class="password" class="color-main"></svg-icon>
            </template>
            <template v-slot:suffix>
                <span @click="showPwd">
                  <svg-icon icon-class="eye" class="color-main"></svg-icon>
                </span>
            </template>
            </el-input>
          </el-form-item>

          <el-form-item>
            <el-radio-group v-model="loginForm.character" style="display: flex; justify-content: space-evenly; width: 100%;">
                <el-radio value="ROLE_user">商家</el-radio>
                <el-radio value="ROLE_admin">管理员</el-radio>
            </el-radio-group>
          </el-form-item>

          <el-form-item style="margin-bottom: 60px;text-align: center">
            <el-button style="width: 48%" type="primary" :loading="loading" @click.prevent="handleLogin">
              登录
            </el-button>
            <el-button style="width: 48%" type="primary" @click.prevent="handleRegister">
              注册
            </el-button>
          </el-form-item>
        </el-form>
      </el-card>

      <img :src="login_center_bg" class="login-center-layout">

      <!-- 弹窗 -->
      <!-- <div v-if="showError" class="modal-overlay">
        <div class="modal">
          <p>密码不正确，请重新输入。</p>
          <el-button @click="closeModal">关闭</el-button>
        </div>
      </div> -->
    </div>
  </template>
  
  <script>
  import { reactive, ref, onMounted, getCurrentInstance } from 'vue'
  import { isvalidUsername } from '@/utils/validate'
  import { setToken } from '@/utils/auth'
  import login_center_bg from '@/assets/images/login_center_bg.png'
  import { useRouter } from 'vue-router'
  import { auth,login } from '@/api/login'

  export default {
    setup() {
      //const showError = ref(false);
      const router = useRouter();

      const loginForm = ref({
        username: '',
        password: '',
        character: ''
      })
      const validateUsername = (rule, value, callback) => {
        if (!isvalidUsername(value)) {
          callback(new Error('请输入正确的用户名'))
        } else {
          callback()
        }
      }
      const validatePass = (rule, value, callback) => {
        if (value.length < 3) {
          callback(new Error('密码不能小于3位'))
        } else {
          callback()
        }
      }
      const loginRules = {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { validator: validateUsername, trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { validator: validatePass, trigger: 'blur' }
        ]
      }
      const loading = ref(false)
      const pwdType = ref('password')
      const showPwd = () => {
        if (pwdType.value === 'password') {
          pwdType.value = ''
        } else {
          pwdType.value = 'password'
        }
      }

      const token = ref(null)
      const loginFormRef = ref(null);
      onMounted(() => {
      });
      const handleLogin = () => {
        loginFormRef.value.validate(valid => {
          if (valid) {
            loading.value = true
            console.log(loginForm.value)
            auth(loginForm.value).then(res => {
              if (res.status === 200) {
                token.value = res.data.jwt
              } else {
                //showError.value = true
                console.error(res)
              }
            }).catch(err => {
              console.log(err)
            })
            login(loginForm.value).then(res => {
              if (res.status === 200) {
                  if(res.data != -1){
                    setToken(token.value)
                    if(loginForm.value.character === "ROLE_user"){
                      router.push({ path: '/admin/order_info' })
                    }
                    else{
                      router.push({ path: '/adminUser/user_info' })
                    }
                  }else{
                    console.log("未激活")
                  }
                } else {
                  console.error(res)
                }
                loading.value = false
            }).catch(err => {
              console.log(err)
              loading.value = false
            })
          } else {
            console.log('参数验证不合法！')
            return false
          } 
        })
      }
      const handleRegister = () => {
        router.push({ path: '/register' })
      }
      const closeModal = () => {
        //showError = false;  // 关闭弹窗
      }
      return {
        loginForm,
        loginFormRef,
        loginRules,
        loading,
        pwdType,
        showPwd,
        handleLogin,
        handleRegister,
        login_center_bg,
        //showError,  // 控制弹窗的显示
        closeModal
      }
    }
  }
    // import {isvalidUsername} from '@/utils/validate';
    // import login_center_bg from '@/assets/images/login_center_bg.png'
    // import axios from 'axios';
  
    // export default {
    //   name: 'login',
    //   data() {
    //     const validateUsername = (rule, value, callback) => {
    //       if (!isvalidUsername(value)) {
    //         callback(new Error('请输入正确的用户名'))
    //       } else {
    //         callback()
    //       }
    //     };
    //     const validatePass = (rule, value, callback) => {
    //       if (value.length < 3) {
    //         callback(new Error('密码不能小于3位'))
    //       } else {
    //         callback()
    //       }
    //     };
    //     return {
    //       loginForm: {
    //         username: '',
    //         password: '',
    //         character: ''
    //       },
    //       loginRules: {
    //         username: [{required: true, trigger: 'blur', validator: validateUsername}],
    //         password: [{required: true, trigger: 'blur', validator: validatePass}]
    //       },
    //       loading: false,
    //       pwdType: 'password',
    //       login_center_bg,
    //     }
    //   },
    //   created() {
    //   },
    //   methods: {
    //     showPwd() {
    //       if (this.pwdType === 'password') {
    //         this.pwdType = ''
    //       } else {
    //         this.pwdType = 'password'
    //       }
    //     },
    //     handleLogin() {
    //       this.$refs.loginForm.validate(valid => {
    //         if (valid) {
    //           axios.post('/login', this.loginForm).then(res => {
    //             if (res.data.code === 200) {
    //               this.$router.push({path: '/'})
    //             } else {
    //               this.$message.error(res.data.msg);
    //             }
    //           }).catch(err => {
    //             console.log(err);
    //           })
    //         } else {
    //           console.log('参数验证不合法！');
    //           return false
    //         }
    //       })
    //     },
    //     handleRegister(){
    //         this.$router.push({path: '/register'});
    //     }
    //   }
    // }
  </script>
  
  <style scoped>
    .login-form-layout {
      position: absolute;
      left: 0;
      right: 0;
      width: 360px;
      margin: 140px auto;
      border-top: 10px solid #409EFF;
    }
  
    .login-title {
      text-align: center;
    }
  
    .login-center-layout {
      background: #409EFF;
      width: auto;
      height: auto;
      max-width: 100%;
      max-height: 100%;
      margin-top: 200px;
    }
    /* 弹窗样式 */
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .modal {
    background-color: white;
    padding: 20px;
    border-radius: 5px;
    width: 300px;
    text-align: center;
  }
  </style>
  