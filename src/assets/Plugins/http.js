import axios from 'axios';
import { Message } from 'element-ui'
//定义插件
const MyPlugin={}

//开发插件
MyPlugin.install=function(Vue,options){
    //基准地址设置
    axios.defaults.baseURL='http://localhost:8888/api/private/v1/'
    //设置全局头token   因为是全局 所以只会加载一次 会出现无效tokken的问题  要使用拦截器
    // let AUTH_TOKEN=localStorage.getItem('token')
    // axios.defaults.headers.common['Authorization'] = AUTH_TOKEN

    //拦截器
    axios.interceptors.request.use(function(config){
        //发送请求之前 执行什么
        if(config!='login'){
            let AUTH_TOKEN=localStorage.getItem('token')
            config.headers['Authorization']=AUTH_TOKEN   //这个是每次请求都会加载
            // axios.defaults.headers.common['Authorization'] = AUTH_TOKEN   这个是全局 只会加载一次
        }
        return config
    },function(error){
        //发生错误 执行什么
        return Promise.reject(error);
    })

    //响应
    axios.interceptors.response.use(function(response){
      
        const {meta:{msg,status}}=response.data
        if(status!==200 && status!==201){
            Message.error(msg)
        }
        return response
    },function(error){
          //错误响应后做点啥
          Message.error('服务器维护中')
          return Promise.reject(error)
    })
   
       
    

    //添加实例属性
    Vue.prototype.$http=axios
}

//导出插件
export default MyPlugin