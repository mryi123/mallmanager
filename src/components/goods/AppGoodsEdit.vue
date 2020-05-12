<template>
<el-card class="box-card">
    <cur-breadcrumb level1='商品管理' level2='商品列表'></cur-breadcrumb>
    <el-alert title="修改商品信息" center class="ti" type="success" show-icon></el-alert>
    <!-- 步骤条 -->
    <el-steps :space="200" :active="active*1+1" align-center finish-status="success">
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
    </el-steps>

    <!-- 导航 -->
    <el-form label-position="top" label-width="80px" :model="formgoods">
        <el-tabs tab-position="left" v-model="active" class="tabs" :before-leave="handlefen" @tab-click="handleTabs()">
            <!-- before-leave  属性调用 不难有括号 -->
            <el-tab-pane label="基本信息" name="0">

                <el-form-item label="商品名称">
                    <el-input v-model="formgoods.goods_name"></el-input>
                </el-form-item>
                <el-form-item label="商品价格">
                    <el-input v-model="formgoods.goods_price"></el-input>
                </el-form-item>
                <el-form-item label="商品重量">
                    <el-input v-model="formgoods.goods_weight"></el-input>
                </el-form-item>
                <el-form-item label="商品数量">
                    <el-input v-model="formgoods.goods_number"></el-input>
                </el-form-item>
                <el-form-item label="商品分类">
                    <el-cascader :options="category" clearable :props="defaultdata" v-model="selectoption">
                    </el-cascader>
                </el-form-item>

            </el-tab-pane>
            <el-tab-pane label="商品参数" name="1">
                <el-form-item v-for="(item, index) in goodsParams" :key="index" :label="item.attr_name">
                    <el-checkbox v-model="item.attr_vals" border v-for="(item1, index) in item.attr_vals" :key="index" :label="item1"></el-checkbox>
                </el-form-item>

            </el-tab-pane>
            <el-tab-pane label="商品属性" name="2">
                <el-form-item :label="item.attr_name" v-for="(item, index) in goodsParamsonly" :key="index">
                    <el-input v-model="item.attr_vals" placeholder=""></el-input>
                </el-form-item>
            </el-tab-pane>
            <el-tab-pane label="商品图片" name="3">
                {{formgoods.pic}}
                <el-upload action="http://localhost:8888/api/private/v1/upload" list-type="picture-card" :before-upload="handlePictureCardPreview" :headers="tokens" :on-success="handlepicsueecss" :on-remove="handleRemove">
                    <i class="el-icon-plus"></i>
                </el-upload>
                <el-dialog :visible.sync="dialogVisible">
                    <img width="100%" :src="dialogImageUrl" alt="">
                </el-dialog>
            </el-tab-pane>
            <el-tab-pane label="商品内容" name="4">
                <!-- 富文本控件 -->
                <quill-editor v-model="formgoods.goods_introduce"></quill-editor>
                <div class="add">
                    <el-button @click="handleAddGoods" type="success">修改</el-button>
                </div>

            </el-tab-pane>
        </el-tabs>
    </el-form>
</el-card>
</template>

<script>
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

import {
    quillEditor
} from 'vue-quill-editor'
export default {
    components: {
        quillEditor
    },
    data() {
        return {
            active: '0', // 绑定步骤条
            formgoods: {
                goods_cat: [],
                pic: [], //图片存放路径
            }, //商品数据
            category: [], //分类
            selectoption: [], //good_cat
            defaultdata: {
                label: 'cat_name',
                value: 'cat_id'
            }, //分类
            goodsParams: [], //被选中的动态参数
            goodsParamsonly: [], //被选中的静态参数
            dialogVisible: false, //loading
            dialogImageUrl: '', //图片
            tokens: {
                'Authorization': localStorage.getItem('token')
            },

        }
    },
    created() {
        this.loadData()
        this.handlefan()
    },
    methods: {
        //返填
        handlefan() {
            let id = this.$route.params.id
            let arr = [];
            this.$http.get(`goods/${id}`)
                .then(rep => {
                    const {
                        data,
                        meta: {
                            msg,
                            status
                        }
                    } = rep.data
                    this.formgoods = data
                    this.selectoption = data.goods_cat.split(',')
                    this.selectoption.forEach(item => {
                        this.selectoption.push(parseInt(item))
                        arr.push(parseInt(item))
                    });
                    this.selectoption = arr

                })
        },
        //修改
        handleAddGoods() {
            let id = this.$route.params.id
            //处理formgoods.attr_cat
            this.formgoods.goods_cat = this.selectoption.join(',');
            //将动态参数和静态参数合并
            let arr1 = this.goodsParams.map(item => {
                let vle = item.attr_vals.length === 0 ? '' : item.attr_vals.join(',')
                return {
                    'attr_id': item.attr_id,
                    'attr_value': vle
                }
            })
            let arr2 = this.goodsParamsonly.map(item => {
                return {
                    'attr_id': item.attr_id,
                    'attr_value': item.attr_vals
                }
            })
            this.formgoods.attrs = [...arr1, ...arr2]
            this.$http.put(`goods/${id}`, this.formgoods)
                .then(rep => {
                    const {
                        data,
                        meta: {
                            msg,
                            status
                        }
                    } = rep.data
                    if (status === 200) {
                        this.formgoods = {}
                        this.$router.push({
                            'path': '/goods'
                        })
                        this.$message.success(msg)
                    }
                })

        },
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
                        console.log(data);
                    }
                })
        }, //没有选分类  就不能跳转
        handlefen() {
            if (this.selectoption.length === 0) {
                this.$message.warning('请选择分类')
                return false;
            }
        },
        //当标签页被选中时
        async handleTabs() {
            if (this.active === '1') {
                //动态
                await this.loadDataParams('many')
                this.goodsParams.forEach(item => {
                    item.attr_vals = item.attr_vals.length === 0 ? '' : item.attr_vals.split(',')
                })
            } else if (this.active === '2') {
                //静态
                await this.loadDataParams('only')
            }

        },
        //分类参数
        async loadDataParams(type) {
            let cate_id = this.selectoption[2]
            if (cate_id === undefined) {
                cate_id = this.selectoption[1]
            }
            await this.$http.get(`categories/${cate_id}/attributes?sel=${type}`)
                .then(rep => {

                    if (rep.status === 200) {
                        if (type === 'only') {
                            this.goodsParamsonly = rep.data.data
                        } else {
                            this.goodsParams = rep.data.data
                        }

                    } 
                })
        },
        //图片上传
        handleRemove(file, fileList) {
            this.formgoods.pic.forEach((item, index) => {
                if (item.pic === file.response.data.tmp_path) {
                    this.formgoods.pic.splice(index, 1)
                }
            })
        },
        //文件上传前
        handlePictureCardPreview(file) {
            const isJPG = file.type === 'image/jpeg'
            const isLt2M = file.size / 1024 / 1024 < 2
            if (!isJPG) {
                this.$message.warning('图片上传只能是jpg格式')
            }
            if (!isLt2M) {
                this.$message.warning('图片的大小要小于2m')
            }
            return isJPG && isLt2M
        },
        //图片上传
        handlepicsueecss(rep, file, fileList) {

            if (rep.meta.status === 200) {
                this.formgoods.pic.push({
                    'pic': rep.data.tmp_path
                })
            }
        }
    },
}
</script>

<style scoped>
.ti {
    margin: 10px;
}

.tabs {
    margin: 20px 10px;
}

.add {
    display: flex;
    justify-content: center;
    margin-top: 40px;
}
</style>
