<template>
<el-card>
    <cur-breadcrumb level1='商品管理' level2='分类参数'></cur-breadcrumb>
    <el-alert type="warning" class="alert" :closable="closablealert" title="只允许为第三级分类设置参数" show-icon></el-alert>
    <!-- 遍历级联 -->
    <el-row>
        <span>商品名称</span>
        <el-cascader :options="category" clearable :props="defaultdata" @change="handleTabs" v-model="selectoption">
        </el-cascader>
    </el-row>
    <!-- 导航 -->
    <el-tabs class="alert" v-model="active" type="card" @tab-click="handleTabs">
        <el-tab-pane label="用户管理" name="1">
            <el-button type="danger" @click="dialogFormVisible = true" :disabled="selectoption.length===0">设置动态参数</el-button>
            <el-table :data="goodsParams" style="width: 100%">
                <el-table-column type="expand">
                    <template slot-scope="scope">

                        <el-tag :key="tag" v-for="tag in scope.row.attr_vals" closable :disable-transitions="false" @close="handleClose(scope.row,tag)">
                            {{tag}}
                        </el-tag>
                        <el-input class="input-new-tag" v-if="inputvisible" v-model="inputval" ref="saveTagInput" size="small" @keyup.enter.native="handleInputConfirm(scope.row)" @blur="handleInputConfirm(scope.row)">
                        </el-input>
                        <el-button class="button-new-tag" v-else size="small" @click="showInput">+ New Tag</el-button>
                    </template>
                </el-table-column>
                <el-table-column prop="attr_name" label="属性名称" width="180">
                </el-table-column>
                <el-table-column prop="address" label="操作">
                    <template slot-scope="scope">
                        <el-button type="primary" @click="handleUpdataT(scope.row.attr_id)" circle icon="el-icon-edit"></el-button>
                        <el-button type="danger" @click="handleDelete(scope.row)" circle icon="el-icon-delete"></el-button>
                    </template>
                </el-table-column>

            </el-table>
        </el-tab-pane>

        <el-tab-pane label="配置管理" name="2">
            <el-button type="danger" @click="dialogFormVisibleJ=true" :disabled="selectoption.length===0">设置静态参数</el-button>
            <el-table :data="goodsParamsonly" style="width: 100%">
                <el-table-column type="index" label="#" width="180">
                </el-table-column>
                <el-table-column prop="attr_name" label="属性名称" width="180">
                </el-table-column>
                <el-table-column prop="attr_vals" label="属性值" width="180">
                </el-table-column>
                <el-table-column prop="address" label="操作">
                    <template slot-scope="scope">

                        <el-button type="primary" @click="handleUpdataT(scope.row.attr_id)" circle icon="el-icon-edit"></el-button>
                        <el-button type="danger" @click="handleDelete(scope.row)" circle icon="el-icon-delete"></el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-tab-pane>
    </el-tabs>

    <!-- 设置动态参数 -->
    <el-dialog :title="(formdata.attr_id!=null?'修改':'添加')+'动态参数'" :visible.sync="dialogFormVisible" @close="handleCoses">
        <el-form :model="formdata">
            <el-form-item label="参数名称" label-width="120px">
                <el-input v-model="formdata.attr_name" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="参数属性" label-width="120px">
                <el-row>
                    <el-col :span="20">
                        <el-input v-model="formdata.attr_vals" autocomplete="off"></el-input>
                    </el-col>
                    <el-col :span="4">以，隔开</el-col>
                </el-row>

            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="handleEdit">确 定</el-button>
        </div>
    </el-dialog>

    <!-- 设置静态参数 -->
    <el-dialog :title="(formdata.attr_id!=null?'修改':'添加')+'静态参数'" :visible.sync="dialogFormVisibleJ" @close="handleCoses">
        <el-form :model="formdata">
            <el-form-item label="属性名称" label-width="120px">
                <el-input v-model="formdata.attr_name" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="属性值" label-width="120px">
                <el-row>
                    <!-- <el-col :span="20"> -->
                    <el-input v-model="formdata.attr_vals" autocomplete="off"></el-input>
                    <!-- </el-col>
                    <el-col :span="4">以，隔开</el-col> -->
                </el-row>

            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisibleJ = false">取 消</el-button>
            <el-button type="primary" @click="handleonlyEdit">确 定</el-button>
        </div>
    </el-dialog>
</el-card>
</template>

<script>
export default {
    data() {
        return {
            closablealert: false, //不能关闭提示
            defaultdata: { //绑定的值
                label: 'cat_name',
                value: 'cat_id'
            },
            category: [], //绑定级联
            selectoption: [], //获得级联的值
            goodsParamsonly: [], //静态
            goodsParams: [], //动态
            active: "1", //默认1
            goodsAttr_vals: [], //分类数组
            inputval: '',
            inputvisible: false,
            dialogFormVisible: false, //设置动态参数
            formdata: {}, //动态参数对象  和静态
            dialogFormVisibleJ: false,
        }
    },
    methods: {
        loadData() {

            this.$http.get(`categories?type=3`)
                .then(rep => {
                    const {
                        data,
                        meta: {
                            msg,
                            status
                        }
                    } = rep.data
                    if (status === 200) {
                        this.category = data
                    }
                })
        },
        // //当标签页被选中时
        async handleTabs() {

            if (this.active === '1') {
                //动态
                await this.loadDataParams('many')

                // if (this.goodsParams != null) {
                //     console.log('ok');
                //     console.log(this.goodsParams);
                //     this.goodsParams.map(item => {
                //         console.log(1);
                //         this.goodsAttr_vals = item.attr_vals.length === 0 ? '' : item.attr_vals.split(',')
                //     })
                // }

            } else if (this.active === '2') {
                //静态
                await this.loadDataParams('only')

            }

        }, //分类参数
        loadDataParams(type) {
            let cate_id = this.selectoption[2]
            if (cate_id === undefined) {
                cate_id = this.selectoption[1]
            }
            this.$http.get(`categories/${cate_id}/attributes?sel=${type}`)
                .then(rep => {

                    if (rep.status === 200) {
                        if (type === 'only') {
                            this.goodsParamsonly = rep.data.data
                        } else {
                            this.goodsParams = rep.data.data
                            console.log(this.goodsParams);
                            if (this.goodsParams != null) {
                                this.goodsParams.map(item => {
                                    item.attr_vals = item.attr_vals.length === 0 ? '' : item.attr_vals.split(',')
                                })
                            }

                        }

                    } else {
                        this.$message.error(rep.data.meta.msg)
                    }
                })
        }, //删除
        handleClose(props, tag) {
            props.attr_vals.forEach((item, index) => {
                if (item === tag) {
                    props.attr_vals.splice(index, 1)
                }
            })
            let formdata = {
                ...props
            }
            formdata.attr_vals = formdata.attr_vals.length === 0 ? '' : formdata.attr_vals.join(',')
            this.$http.put(`categories/${this.selectoption[2]}/attributes/${formdata.attr_id}`, formdata)
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
                    } 
                })
        },
        //标签动态输入
        showInput() {
            this.inputvisible = true
        },
        //标签动态添加
        handleInputConfirm(props) {
            let inputValue = this.inputval;
            props.attr_vals.push(inputValue)
            if (inputValue) {
                let formdata = {
                    ...props
                }
                formdata.attr_vals = formdata.attr_vals.length === 0 ? '' : formdata.attr_vals.join(',')
                this.$http.put(`categories/${this.selectoption[2]}/attributes/${formdata.attr_id}`, formdata)
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
                        } 
                    })
            }
            this.inputvisible = false;
            this.inputval = '';
        },
        handleCoses() {
            //关闭dialog时
            this.formdata = {}
        },
        //添加 和修改
        handleEdit() {
            let supers;
            if (this.formdata.attr_id == null) {
                this.formdata.attr_sel = 'many'
                supers = this.$http.post(`categories/${this.selectoption[2]}/attributes`, this.formdata)
            } else {
                supers = this.$http.put(`categories/${this.selectoption[2]}/attributes/${this.formdata.attr_id}`, this.formdata)
            }

            supers.then(rep => {
                const {
                    data,
                    meta: {
                        msg,
                        status
                    }
                } = rep.data
                if (status === 201 || status === 200) {
                    this.$message.success(msg)
                    this.dialogFormVisible = false
                    this.loadDataParams('many')
                }
            })
        },
        //修改
        handleUpdataT(id) {
            console.log(id);
            this.$http.get(`categories/${this.selectoption[2]}/attributes/${id}`)
                .then(rep => {
                    const {
                        data,
                        meta: {
                            msg,
                            status
                        }
                    } = rep.data
                    if (status === 200) {
                        this.formdata = data
                        console.log(this.formdata);
                        if (this.formdata.attr_sel === 'many') {
                            //动态
                            this.dialogFormVisible = true
                        } else {
                            this.dialogFormVisibleJ = true
                        }

                    }
                })
        },
        //删除 动态和静态通用
        handleDelete(row) {
            this.$http.delete(`categories/${this.selectoption[2]}/attributes/${row.attr_id}`)
                .then(rep => {
                    const {
                        data,
                        meta: {
                            msg,
                            status
                        }
                    } = rep.data
                    if (status === 200) {
                        this.loadData()
                        this.$message.success(msg)
                        this.loadDataParams(row.attr_sel)
                    } 
                })
        },
        //静态 添加和修改
        handleonlyEdit() {
            let supers;
            if (this.formdata.attr_id == null) {
                this.formdata.attr_sel = 'only'
                supers = this.$http.post(`categories/${this.selectoption[2]}/attributes`, this.formdata)
            } else {
                supers = this.$http.put(`categories/${this.selectoption[2]}/attributes/${this.formdata.attr_id}`, this.formdata)
            }

            supers.then(rep => {
                const {
                    data,
                    meta: {
                        msg,
                        status
                    }
                } = rep.data
                if (status === 201 || status === 200) {
                    this.$message.success(msg)
                    this.dialogFormVisibleJ = false
                    this.loadDataParams('only')
                } 
            })
        },

    },
    created() {

        this.loadData()

    }
}
</script>

<style scoped>
.alert {
    margin: 10px;
}

.el-tag+.el-tag {
    margin-left: 10px;
}

.button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
}

.input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
}
</style>
