<template>
<el-card class="box-card">
    <!--面包屑导航-->
    <cur-breadcrumb level1="订单管理" level2="订单列表"></cur-breadcrumb>

    <!-- 订单列表 -->
    <el-table :data="formdata" style="width: 100%">
        <el-table-column type="index" label="#" width="80">
        </el-table-column>
        <el-table-column prop="order_number" label="订单编号" width="180">
        </el-table-column>
        <el-table-column prop="order_price" label="订单价格">
        </el-table-column>
        <el-table-column label="是否付款">
            <template slot-scope="scope">
                <el-button v-if="scope.row.pay_status==='1'" type="success" plain>已付款</el-button>
                <el-button v-if="scope.row.pay_status==='0'" type="primary" plain>未付款</el-button>  
            </template>
            
        </el-table-column>
        <el-table-column prop="is_send" label="是否发货">
        </el-table-column>
        <el-table-column prop="create_time" label="下单时间">
        </el-table-column>
        <el-table-column label="操作">
            <template slot-scope="scope">
                <el-button type="primary" @click="handleUpdataT(scope.row)" circle icon="el-icon-edit"></el-button>
            </template>
        </el-table-column>
    </el-table>
    <!-- 分页 -->  
     <el-pagination class="page"   @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pagenum" :page-sizes="[5, 10, 15, 20]" :page-size="pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total">    
    </el-pagination>

    <!-- 修改 添加  -->
    <el-dialog title="修改" :visible.sync="dialogFormVisible" @close="CloseDialog" width="40%">
        <el-form :model="ordersdata">
            <el-form-item label="订单号:" v-model="ordersdata.order_number" label-width="120px">
                {{ordersdata.order_number}}
            </el-form-item> 

            <el-form-item label="是否发货:" label-width="120px">
                <el-switch v-model="is_send" active-color="#13ce66" inactive-color="#ff4949">
                </el-switch>
            </el-form-item>

            <el-form-item label="订单支付:" label-width="120px">
               <el-radio-group v-model="ordersdata.order_pay">
                <el-radio label="0">未支付</el-radio>
                <el-radio label="1">支付宝</el-radio>
                <el-radio label="2">微信</el-radio>
                <el-radio label="3">银行卡</el-radio>
           </el-radio-group>
            </el-form-item>

            <el-form-item label="订单价格:" label-width="120px">
                <el-input v-model="ordersdata.order_price"></el-input>
            </el-form-item>

            <el-form-item label="省市区:" label-width="120px">
                <el-cascader size="large" 
                :options="options" 
                v-model="selectedOptions"
                value="110101" 
               ></el-cascader>
            </el-form-item>
            
            <el-form-item label="详细地址:" label-width="120px">
                <el-input v-model="addree"></el-input>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="handleEdit()">确 定</el-button>
        </div>
    </el-dialog>
</el-card>
</template>

<script>
import {
    provinceAndCityData,
    regionData,
    provinceAndCityDataPlus,
    regionDataPlus,
    CodeToText,
    TextToCode
} from 'element-china-area-data'
export default {
    data() {
        return {
            formdata: [], //订单列表
            total: 0, //总条数
            pagesize: 5, //每页显示条数
            pagenum: 1, //当前页
            dialogFormVisible: false, //控制dialog的开关
            selectedOptions: [], //获取值
            options: regionData, //绑定值
            ordersdata: {}, //选中的对象
            is_send: false, //判断是否发货
            addree:'123',//详细地址
          
        }

    },
    created() {
        this.loadData()
    },
    methods: {
        async loadData() {
            await this.$http.get(`orders?pagenum=${this.pagenum}&pagesize=${this.pagesize}`)
                .then(rep => {
                    const {
                        data,
                        meta: {
                            msg,
                            status
                        }
                    } = rep.data
                 
                    if (status === 200) {
                        this.$message.success(msg)
                        this.formdata = data.goods
                        this.total = data.total
                    
                    }
                })

        }, //当前页改变时
        handleCurrentChange(val) {
            this.pagenum = val
            this.loadData()
        }, //每页显示条数改变 时
        handleSizeChange(val) {
            this.pagesize = val
            this.loadData()
        }, //dialog关闭时
        CloseDialog() {
            this.ordersdata={}
            this.selectedOptions=[]
        }, //修改填值
        handleUpdataT(rows) {
            if (rows.is_send === '否') {
                this.is_send = false
            } else {
                this.is_send = true
            }
            this.selectedOptions=
           rows.consignee_addr===''?[]:rows.consignee_addr.split(",",3)
           this.addree=rows.consignee_addr===''?''
           :rows.consignee_addr.substring(rows.consignee_addr.lastIndexOf(',')+1)
          
            this.ordersdata = rows
            this.dialogFormVisible = true
        }, 
       //修改
        handleEdit(){
            if (this.is_send === false) {
                this.ordersdata.is_send = 0
            } else {
                this.ordersdata.is_send = 1
            } 
            this.ordersdata.consignee_addr=
            this.selectedOptions.length===0?''
            :this.selectedOptions.join(',')
            +(this.addree===''?'':(',')+this.addree)
           
            if(this.ordersdata.order_pay==='0'){
                this.ordersdata.pay_status='0'
            }else{
                this.ordersdata.pay_status='1'
            }   
            this.$http.put(`orders/${this.ordersdata.order_id}`,this.ordersdata)
            .then(rep=>{
                const {data,meta:{msg,status}}=rep.data
                
                if(status===201){
                    this.loadData()
                    this.dialogFormVisible=false
                    this.$message.success(msg)   
                }
            })

            
        }
    },
}
</script>

<style scoped>
.page {
    text-align: center;
}
</style>
