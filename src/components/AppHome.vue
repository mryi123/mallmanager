<template>
  
    <el-container class="container">
      <el-header class="header">
        <el-row>
          <el-col :span="22">
            <h1>电商管理系统</h1>
          </el-col>
          <el-col :span="2">
            <a href="#" @click.prevent="QuitLogin()">退出</a>
          </el-col>
        </el-row>
      </el-header>
      <el-container>
        <el-aside width="200px" class="aside">
          <!-- 导航 -->

          <el-menu default-active="1" class="menu" router>
            <el-submenu v-for="(item, index) in menus" :key="index" :index="index+''">
              <template slot="title">
                <i class="el-icon-s-tools"></i>
                <span>{{item.authName}}</span>
              </template>
              <el-menu-item v-for="(item1, index) in item.children" :key="index" :index="'/'+item1.path">
                  <i class="el-icon-menu"></i>
                  <span>{{item1.authName}}</span>
                <!-- <el-menu-item  index="1-1">选项1</el-menu-item> -->
              </el-menu-item>
            </el-submenu>
          </el-menu>
        </el-aside>
        <el-main>
            <!-- 内容部分 -->
            <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>

</template>

<script>
export default {
  //加载前

  data() {
      return {
        menus:[], //列表
      }
  },methods: {
      QuitLogin(){
        localStorage.removeItem('token');
        this.$router.push({name:'login'});
      }
     
  },
  created() {
    this.$http.get(`menus`)
    .then(rep=>{
      const {data,meta:{msg,status}}=rep.data
      if(status===200){
        this.menus=data
        console.log(data);
      }
     
    })
  },
  
};
</script>

<style scoped>
.header {
  background: rgb(22, 22, 22);
  color: white;
  text-align: center;
  line-height: 60px;
}
.header a {
  color: white;
}
.container,.aside,.menu{
    height: 100%;
}
</style>