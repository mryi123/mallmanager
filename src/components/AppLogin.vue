<template>
  <div class="login">
    <el-form
      label-position="top"
      label-width="80px"
      :model="formdata"
      class="myform"
      :rules="rules"
      ref="ruleForm"
    >
      <h2>用户登录</h2>
      <el-form-item label="用户名" prop="username">
        <el-input v-model="formdata.username"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="formdata.password" show-password></el-input>
      </el-form-item>
      <el-button @click="handleLogin('ruleForm')" type="primary" style="width:100%">登录</el-button>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "HelloWorld",
  data() {
    return {
      formdata: {
        username: 'admin',
        password: '123456'
      },
      rules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 3, max: 6, message: "长度在3~6个字符", trigger: "blur" }
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 6, max: 16, message: "长度在6~16个字符", trigger: "blur" }
        ]
      }
    };
  },methods: {
    handleLogin(formName){
        //表单验证
        this.$refs[formName].validate((vali)=>{
          //vali 是回调
          if(vali){
            //发送网络请求
            this.$http.post(`login`,this.formdata)
            //处理结果
            .then(rep=>{
              let {data,meta:{msg,status}}=rep.data
              if(status === 200){
                 localStorage.setItem('token',data.token)
                  //登录成功 
                  this.$message.success(msg)
                  //跳转
                  this.$router.push({path:'/'});
                 
                  
              }
             
            }).catch(rep=>{console.log(rep);})
          }else{

            return false;
          }
        })
    }
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.login {
  background: #344050;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.myform {
  width: 450px;
  background: white;
  padding: 20px;
  border-radius: 10px;
}
</style>
