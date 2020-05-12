<template>
<el-card class="box-card">
    <!--面包屑导航-->
    <cur-breadcrumb level1='商品管理' level2='商品列表'></cur-breadcrumb>

    <!-- 内容搜索 -->
    <el-row class="row">
        <el-col :span="10">
            <el-input placeholder="请输入内容" v-model="search" class="input-with-select">
                <el-button slot="append" icon="el-icon-search" @click="this.loadData"></el-button>
            </el-input>
        </el-col>
        <el-col :span="4">
            <el-button type="success" class="addBtn" @click="$router.push({name:'goodsadd'})" plain>添加商品</el-button>
        </el-col>
    </el-row>

    <!-- 表格 -->
    <el-table :data="goods" border style="width:100%" v-loading="loading">
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="goods_name" label="商品名称"></el-table-column>
        <el-table-column prop="goods_price" label="商品价格(元)" width="100px"></el-table-column>
        <el-table-column prop="goods_weight" label="商品重量" width="100px"></el-table-column>
        <el-table-column label="创建日期" width="160px">
            <!-- //日期函数处理 -->
            <template slot-scope="scope">{{scope.row.add_time|moment('YYYY-MM-DD HH:mm:ss') }}</template>
        </el-table-column>
        <el-table-column label="操作" width="120px">
            <template slot-scope="scope">
                <el-button type="primary" icon="el-icon-edit" @click="handleUpdate(scope.row.goods_id)" circle plain></el-button>
                <el-button type="danger" icon="el-icon-delete" @click="handelDelete(scope.row.goods_id)" circle plain></el-button>
            </template>
        </el-table-column>
    </el-table>

    <!-- 分页 
    size-change  显示页码总条数
    current-change 当前页
    current-page  当前页码
    page-sizes  每页支持显示条数
    page-size 每页显示条数
    layoutlayout  组件布局
    、total 总条数
    -->
    <el-pagination class="page" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pagenum" :page-sizes="[10,20,30,40]" :page-size="pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>

</el-card>
</template>

<script>
export default {
    data() {
        return {
            loading: false, //加载
            goods: [], //用户数据
            search: "", //搜索
            pagenum: 1, //当前页码
            pagesize: 10, //每页显示条数
            total: 0,
        }
    },
    created() {
        this.loadData();
    },
    methods: {

        //删除用户
        handelDelete(id) {
            this.$confirm("确定删除用户吗?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            }).then(() => {
                this.$http.delete(`goods/${id}`).then(rep => {
                    const {
                        data,
                        meta: {
                            msg,
                            status
                        }
                    } = rep.data;
                    if (status === 200) {
                        this.loadData();
                        this.$message.success("删除成功");
                    }
                });
            });
        },

        //页码大小发生变化
        handleSizeChange(val) {
            this.pagesize = val;
            this.loadData();
        },
        //页码变化
        handleCurrentChange(val) {
            this.pagenum = val;
            this.loadData();
        },
        async loadData() {
            this.loading = true;
            await this.$http
                .get(
                    `goods?query=${this.search}&pagenum=${this.pagenum}&pagesize=${this.pagesize}`
                )
                .then(rep => {
                    const {
                        data,
                        meta: {
                            msg,
                            status
                        }
                    } = rep.data;

                    if (status === 200) {
                        this.goods = data.goods;
                        this.pagenums = data.pagenum;
                        this.total = data.total;
                    }
                })
                .catch(rep => {
                    console.log(rep);
                });
            this.loading = false;
        },
        handleUpdate(id) {
            this.$router.push({
                name: 'goodsedit',
                params: {
                    id: id
                }
            })
        }
    }
};
</script>

<style scoped>
.row {
    margin: 20px 0;
}

.addBtn {
    margin-left: 10px;
}

.page {
    text-align: center;
    margin: 10px 0;
}
</style>
