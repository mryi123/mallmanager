<template>
<el-card class="box-card">
    <!-- 面包屑 -->
    <cur-breadcrumb level1='角色管理' level2='角色列表'></cur-breadcrumb>
    <el-button class="addBtn" @click="dialogFormVisible=true" plain>添加用户</el-button>
    <!-- 表格 -->
    <el-table :data="role" border style="width:100%" v-loading="loading">
        <el-table-column type="expand">
            <template slot-scope="scope">
                <div class="nochlidren" v-if="scope.row.children.length===0">未分配权限</div>
                <el-row v-for="(item, index) in scope.row.children" :key="index">

                    <el-col :span="3">
                        <el-tag @close="handleTagClose(scope.row,item.id)" type="" closable>{{item.authName}}</el-tag>
                        <i class="el-icon-arrow-right"></i>
                    </el-col>

                    <el-col :span="21">
                        <el-row v-for="(item1, index) in item.children" :key="index">
                            <el-col :span="4">
                                <el-tag @close="handleTagClose(scope.row,item1.id)" type="success" closable>{{item1.authName}}</el-tag>
                                <i class="el-icon-arrow-right"></i>
                            </el-col>

                            <el-col :span="20">
                                <el-tag @close="handleTagClose(scope.row,item2.id)" closable type="warning" v-for="(item2, index) in item1.children" :key="index">
                                    {{item2.authName}}
                                </el-tag>
                            </el-col>
                        </el-row>
                    </el-col>
                </el-row>
            </template>
        </el-table-column>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="roleName" label="角色名称"></el-table-column>
        <el-table-column prop="roleDesc" label="角色描述"></el-table-column>
        <el-table-column label="操作">
            <template slot-scope="scope">
                <el-button type="primary" icon="el-icon-edit" @click="handleOpenRoleDia(scope.row)" circle plain></el-button>
                <el-button type="danger" icon="el-icon-delete" @click="handleDeleteRole(scope.row.id)" circle plain></el-button>
                <el-button type="success" icon="el-icon-check" @click="handleShowRight(scope.row)" circle plain></el-button>
            </template>
        </el-table-column>
    </el-table>
    <!-- 权限对话框 -->
    <el-dialog title="提示" :visible.sync="dialogVisible" width="30%">
        <el-tree :data="treeData" ref="tree" show-checkbox node-key="id" v-loading="loading" :default-expanded-keys="[2, 3]" :default-checked-keys="defaultCheck" :props="defaultProps" :default-expand-all="true">
        </el-tree>
        <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisibles()">取 消</el-button>
            <el-button type="primary" @click="handleSeveRole()">确 定</el-button>
        </span>
    </el-dialog>

    <!-- 添加和修改的对话框 -->
    <el-dialog :title="(roleEdit.id==null?'添加':'修改')+'用户'" @close="dialogColseRole()" :visible.sync="dialogFormVisible" width="30%">
        <el-form :model="roleEdit" :rules="rules" ref="dialogColseRoles">
            <el-form-item label="角色名称" prop="roleName" label-width="90px">
                <el-input v-model="roleEdit.roleName" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="角色描述" prop="roleDesc" label-width="90px">
                <el-input v-model="roleEdit.roleDesc" autocomplete="off"></el-input>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="handleEdid()">确 定</el-button>
        </div>
    </el-dialog>
</el-card>
</template>

<script>
export default {
    data() {
        return {
            loading: true,
            role: [], //角色列表
            roleid: 0, //角色id
            loading: false, //页面加载
            dialogVisible: false, //对话框的开启
            dialogFormVisible: false, //修改和添加对话框
            roleEdit: {},
            defaultProps: {
                id: 'id',
                label: 'authName',
                children: 'children',

            },
            treeData: [],
            defaultCheck: [], //默认选择的数组
            rules: {
                roleName: [{
                    required: true,
                    message: '请输入角色名',
                    trigger: 'blur'
                }, {
                    min: 2,
                    max: 6,
                    message: '长度在2~6',
                    trigger: 'blur'
                }],
                roleDesc: [{
                    required: true,
                    message: '请输入角色名',
                    trigger: 'blur'
                }, {
                    min: 2,
                    max: 10,
                    message: '长度在2~10',
                    trigger: 'blur'
                }]
            }
        }
    },
    created() {
        this.loadData();
    },
    methods: {
        async loadData() {
            this.loading = true; //加载
            await this.$http.get(`roles`)
                .then(rep => {
                    const {
                        data,
                        meta: {
                            msg,
                            status
                        }
                    } = rep.data
                    if (status === 200) {
                        this.role = data
                        console.log(data);
                    }
                })
            this.loading = false; //关闭加载
        },
        handleTagClose(roleid, rightid) {
            console.log(`roleid=${roleid.id},rightid=${rightid}`);
            this.$http.delete(`roles/${roleid.id}/rights/${rightid}`)
                .then(rep => {
                    const {
                        data,
                        meta: {
                            msg,
                            status
                        }
                    } = rep.data
                    if (status === 200) {
                        roleid.children = data
                        this.$message.success(msg)
                    }
                })
        },
        async handleShowRight(role) {
            this.roleid = role.id;
            //打开对话框  
            role.children.forEach(e1 => {
                e1.children.forEach(e2 => {
                    e2.children.forEach(e3 => {
                        this.defaultCheck.push(e3.id)
                    })
                })
            })
            await this.$http.get(`rights/tree`)
                .then(rep => {
                    const {
                        data,
                        meta: {
                            msg,
                            status
                        }
                    } = rep.data
                    if (status === 200) {
                        this.treeData = data;
                    }
                })
            this.dialogVisible = true;
            this.loading = false;
        },
        dialogVisibles() {
            //关闭对话框
            this.dialogVisible = false;
            this.defaultCheck = [];
        },
        handleSeveRole() {
            // 保存权限
            let arr1 = this.$refs['tree'].getCheckedKeys();
            let arr2 = this.$refs['tree'].getHalfCheckedKeys();
            let arr = [...arr1, ...arr2];
            this.$http.post(`roles/${this.roleid}/rights`, {
                    rids: arr.join(',')
                })
                .then(rep => {
                    const {
                        data,
                        meta: {
                            msg,
                            status
                        }
                    } = rep.data
                    if (status === 200) {
                        this.dialogVisible = false;
                        this.loadData();
                        this.$message.success(msg)
                    }
                })
        },
        handleEdid() {
            this.$refs['dialogColseRoles'].validate((valid) => {
                if (valid) {
                    let rep = null;
                    if (!this.roleEdit.id) {
                        rep = this.$http.post(`roles`, this.roleEdit)
                    } else {
                        console.log(this.roleEdit);
                        rep = this.$http.put(`roles/${this.roleEdit.id}`, this.roleEdit)
                    }
                    rep.then(res => {
                        const {
                            data,
                            meta: {
                                msg,
                                status
                            }
                        } = res.data
                        console.log(status);
                        if (status === 200 || status === 201) {
                            this.dialogFormVisible = false
                            this.loadData()
                            this.$message.success(msg)
                        }
                    }).catch(rep => {
                        console.log(rep);
                    })
                } else {
                    console.log(valid);
                    // return false;
                }
            })

        },
        //关闭用户对话框
        dialogColseRole() {

            this.roleEdit = {}
            this.dialogFormVisible = false
            //重置表单验证
            this.$refs['dialogColseRoles'].resetFields();
        },
        handleOpenRoleDia(role) {
            this.roleEdit = {
                ...role
            }
            this.dialogFormVisible = true
        },
        handleDeleteRole(id) {
            this.$confirm('确实删除角色吗', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$http.delete(`roles/${id}`)
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
                        }
                    })
            })
        }

    },
}
</script>

<style scoped>
.addBtn {
    margin: 20px 0;
}

.nochlidren {
    text-align: center;
    color: rgb(236, 112, 112);
}
</style>
