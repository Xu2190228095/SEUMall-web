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
                      autoComplete="on"
                      placeholder="请输入用户名">
            <template v-slot:prefix>
                <svg-icon icon-class="user" class="color-main"></svg-icon>
            </template>
            </el-input>
          </el-form-item>

          <el-form-item prop="password">
            <el-input name="password"
                      :type="pwdType"
                      v-model="loginForm.password"
                      autoComplete="on"
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

          <el-form-item prop="repassword">
            <el-input name="password"
                      :type="pwdType"
                      v-model="loginForm.repassword"
                      autoComplete="on"
                      placeholder="请确认输入密码">
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
            <el-button style="width: 100%" type="primary" @click.prevent="handleRegister">
              注册
            </el-button>
          </el-form-item>
        </el-form>
      </el-card>

      <img :src="login_center_bg" class="login-center-layout">
    </div>
  </template>
  
  <script>
    import { reactive, ref, onMounted, getCurrentInstance } from 'vue'
    import { isvalidUsername } from '@/utils/validate'
    import login_center_bg from '@/assets/images/login_center_bg.png'
    import { register } from '@/api/login'
    import router from '../../router';

    export default {
      setup() {
        const loginForm = ref({
          username: '',
          password: '',
          repassword: '',
          character: ''
        });
        const loginRules = {
          // username: [
          //   { required: true, message: '请输入用户名', trigger: 'blur' },
          //   { validator: isvalidUsername, trigger: 'blur' }
          // ],
          // password: [
          //   { required: true, message: '请输入密码', trigger: 'blur' },
          //   { min: 6, max: 16, message: '密码长度在6到16位之间', trigger: 'blur' }
          // ],
          // repassword: [
          //   { required: true, message: '请确认密码', trigger: 'blur' },
          //   { min: 6, max: 16, message: '密码长度在6到16位之间', trigger: 'blur' }
          // ]
        };
        const pwdType = ref('password');
        const showPwd = () => {
          if (pwdType.value === 'password') {
            pwdType.value = 'text';
          } else {
            pwdType.value = 'password';
          }
        };

        const loginFormRef = ref(null);
        onMounted(() => {
          console.log(loginFormRef);
        });
        const handleRegister = () => {
          register(loginForm.value).then(res => {
            if (res.status === 200) {
              console.log(res);
              if(res.data == -1){
                console.log("用户名已存在");
              }else{
                router.push('/login');
              }
            };
          }).catch(err => {
            console.log(err);
          });
        };
        return {
          loginForm,
          loginRules,
          pwdType,
          showPwd,
          handleRegister,
          login_center_bg
        };
      }
    }

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
  </style>
  