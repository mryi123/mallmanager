<template>
    <el-card class="box-card">
        <!--面包屑导航-->
    <cur-breadcrumb level1="数据统计" level2="数据报表"></cur-breadcrumb>
        <div id="mian" style="width:800px;height:400px"></div>
    </el-card>
</template>

<script>
    export default {
        data() {
            return {
                
            }
        },
        async mounted() {
            var echarts=require('echarts')
            //形成图形
            //基于准备好的dom，初始化echarts实例
            var mychart=echarts.init(document.getElementById('mian'))
            //指定图表的配置项和数据
            var option1={
                title:{
                    text:'区域销售情况统计'
                },
                tooltop:{
                },
                
                toolbox:{
                    feature:{
                        saveAsImage:{}
                    }
                }

            }
            // //发送请求获取数据
            var res = await this.$http.get(`reports/type/1`)
            console.log(res)
            var option2=res.data.data
            
            var option={
                ...option1,
                ...option2
            }
            // 使用刚指定的配置项和数据显示图表。
            console.log(res);
            mychart.setOption(option)
            
        }, 

    }
</script>

<style scoped>

</style>