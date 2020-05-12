<template>
<el-card class="box-card">
    <cur-breadcrumb level1='商品管理' level2='商品分类'></cur-breadcrumb>
    <el-button class="fen" @click="dialogFormVisible=true" type="success">添加分类</el-button>
    <el-table :data="goodscate" style="width: 100%">
        <!--
treeKey 绑定到id 给每个节点设置一个唯一值
parentKey 绑定到父id属性 区分父子节点
levelKey 绑定到层级的属性
childKey 绑定到储存子元素的属性
-->
        <el-tree-grid prop="cat_name" label="分类名称" treeKey="cat_id" parentKey="cat_pid" levelKey="cat_level" childKey="children" folderIcon="" :indentSize="30">
        </el-tree-grid>
        <el-table-column label="级别" width="280">
            <template slot-scope="scope">
                 <span v-if="scope.row.cat_level === 0">一级</span>
                <span v-else-if="scope.row.cat_level === 1">二级</span>          
                <span v-else-if="scope.row.cat_level === 2">三级</span>
            </template>
        </el-table-column>
        <el-table-column label="是否有效" width="380">
            <template slot-scope="scope">
                {{scope.row.cat_deleted?'有效':"无效"}}
            </template>
        </el-table-column>
        <el-table-column prop="address" label="操作">
            <template slot-scope="scope">
                <el-button type="primary" @click="handelUpdateT(scope.row)" circle icon="el-icon-edit"></el-button>
                <el-button type="danger" @click="handleDelete(scope.row.cat_id)" circle icon="el-icon-delete"></el-button>
            </template>
        </el-table-column>

    </el-table>
    <!-- 分页 -->  
     <el-pagination class="page"  @size-change="handleSizeChange" @current-change="handleCurrentChange"   :current-page="pagenum" :page-sizes="[5, 10, 15, 20]" :page-size="pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total">    
    </el-pagination>

    <!-- 修改 添加  -->
    <el-dialog :title="(goodscatedata.cat_id!=null?'修改':'添加')" @open="handlezhi" :visible.sync="dialogFormVisible" @close="CloseDialog" width="40%">
        <el-form :model="goodscatedata">
            <el-form-item label="活动名称" label-width="120px">
                <el-input v-model="goodscatedata.cat_name" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item v-if="(goodscatedata.cat_id==null)" label="分类" label-width="120px">
                <el-cascader :options="options" clearable v-model="selectOption" :props="defaultProps" size="320px">
                </el-cascader>
                <span>分类不填，即为根级</span>
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
const ElTreeGrid = require('element-tree-grid')

export default {
    components: {
        ElTreeGrid
    },
    data() {
        return {
            goodscate: [], //商品分类
            pagenum: 1, //当前页
            pagesize: 5, //每页显示条数
            total: 0, //当前总条数
            dialogFormVisible: false, //提示框
            goodscatedata: {}, //商品分类对象
            selectOption: [], //绑定层级级联
            options: [], //绑定级联数据
            defaultProps: { //配置prrp级联
                value: 'cat_id',
                label: 'cat_name',
                children: 'children',
                checkStrictly: true
            },
        }
    },
    methods: {
        async loadData() {
            await this.$http.get(`categories?type=3&pagenum=${this.pagenum}&pagesize=${this.pagesize}`)
                .then(rep => {
                    const {
                        data,
                        meta: {
                            msg,
                            status
                        }
                    } = rep.data
                    console.log(data);
                    this.goodscate = data.result
                    this.total = data.total
                    this.$message.success(msg)
                })

        }, //当前页发生变化
        handleCurrentChange(val) {
            this.pagenum = val
            this.loadData()
        }, //页面条数发生变化
        handleSizeChange(val) {
            this.pagesize = val
            this.loadData()
        }, //删除
        handleDelete(id) {
            this.$confirm("确定删除吗", '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$http.delete(`categories/${id}`)
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
                            this.loadData()
                        } 
                    })
            })
        }, //修改返填
        handelUpdateT(val) {
            this.$http.get(`categories/${val.cat_id}`)
                .then(rep => {
                    const {
                        data,
                        meta: {
                            msg,
                            status
                        }
                    } = rep.data
                    this.goodscatedata = data
                    this.dialogFormVisible = true
                })

        }, //添加和修改
        handleEdit() {
            if (this.selectOption.length === 0) {
                //说明没有选择
                this.goodscatedata.cat_pid = 0
                this.goodscatedata.cat_level = 0
            } else if (this.selectOption.length === 1) {
                //选择了一级 没有选择二级
                this.goodscatedata.cat_pid = this.selectOption[0]
                this.goodscatedata.cat_level = 1
            } else if (this.selectOption.length === 2) {
                //选择了二级
                this.goodscatedata.cat_pid = this.selectOption[1]
                this.goodscatedata.cat_level = 2
            }

            //判断是修改还是增加
            if (this.goodscatedata.cat_id != null) {
                //修改
                this.$http.put(`categories/${this.goodscatedata.cat_id}`, this.goodscatedata)
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
                            this.loadData()
                            this.dialogFormVisible = false
                        } 
                    })
            } else {
                //添加
                this.$http.post(`categories`, this.goodscatedata)
                    .then(rep => {
                        const {
                            data,
                            meta: {
                                msg,
                                status
                            }
                        } = rep.data
                        if (status === 201) {
                            this.$message.success(msg)
                            this.loadData()
                            this.dialogFormVisible = false
                        }
                    })
            }

        }, //弹框关闭时
        CloseDialog() {
            this.goodscatedata = {}
            this.selectOption = []
        }, //弹框填值
        handlezhi() {
            console.log(1);
            this.$http.get(`categories?type=2`)
                .then(rep => {
                    const {
                        data,
                        meta: {
                            msg,
                            status
                        }
                    } = rep.data
                    this.options = data
                })
            this.dialogFormVisible = true
        }

    },
    created() {
        this.loadData()
    },
}
</script>

<style scoped>
.fen {
    margin: 10px;
}

.page {
    text-align: center;
}
</style>
