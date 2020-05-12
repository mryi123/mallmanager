<template>
  <el-card class="box-card">
    <!--面包屑导航-->
    <cur-breadcrumb level1='用户管理' level2='用户列表'></cur-breadcrumb>

    <!-- 内容搜索 -->
    <el-row class="row">
      <el-col :span="10">
        <el-input placeholder="请输入内容" v-model="search" class="input-with-select">
          <el-button slot="append" icon="el-icon-search" @click="this.loadData"></el-button>
        </el-input>
      </el-col>
      <el-col :span="4">
        <el-button type="success" class="addBtn" @click="dialogFormVisibleAdd=true" plain>添加用户</el-button>
      </el-col>
    </el-row>

    <!-- 表格 -->
    <el-table :data="user" border style="width:100%" v-loading="loading">
      <el-table-column type="index" label="#"></el-table-column>
      <el-table-column prop="username" label="姓名"></el-table-column>
      <el-table-column prop="email" label="邮箱"></el-table-column>
      <el-table-column prop="mobile" label="电话"></el-table-column>
      <el-table-column label="创建日期">
        <!-- //日期函数处理 -->
        <template slot-scope="scope">{{scope.row.create_time|moment('YYYY-MM-DD HH:mm:ss') }}</template>
      </el-table-column>
      <el-table-column label="用户状态">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.mg_state"
            @change="handleChangeState(scope.row.id,scope.row.mg_state)"
            active-color="#13ce66"
            inactive-color="#ff4949"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            type="primary"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row.id)"
            circle
            plain
          ></el-button>
          <el-button
            type="danger"
            icon="el-icon-delete"
            @click="handelDelete(scope.row.id)"
            circle
            plain
          ></el-button>
          <el-button
            type="success"
            icon="el-icon-check"
            @click="handleRole(scope.row)"
            circle
            plain
          ></el-button>
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
    <el-pagination
      class="page"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pagenum"
      :page-sizes="[1,2, 4, 6, 8]"
      :page-size="pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    ></el-pagination>

    <!-- 分页角色表单 -->
    <el-dialog
      title="添加用户"
      :visible.sync="dialogFormVisibleRole"
      width="40%"
      @close="handleClose('RuleRoleForm')"
    >
      <el-form :model="formdata" :rules="rules" ref="RuleRoleForm">
        <el-form-item label="用户名" label-width="120px" prop="username">
          <el-input v-model="formdata.username" :disabled="true" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="活动区域" label-width="120px">
          <el-select v-model="formdata.rid" placeholder="请选择活动区域">
            <el-option v-for="item in role" :key="item.id" :label="item.roleName" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleRole = false">取 消</el-button>
        <el-button type="primary" @click="handleEditRole()">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 修改表单 -->
    <el-dialog
      title="添加用户"
      :visible.sync="dialogFormVisibleEdit"
      width="40%"
      @close="handleClose('RuleEditForm')"
    >
      <el-form :model="formdata" :rules="rules" ref="RuleEditForm">
        <el-form-item label="用户名" label-width="120px" prop="username">
          <el-input v-model="formdata.username" :disabled="true" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" label-width="120px" prop="email">
          <el-input v-model="formdata.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="手机号" label-width="120px" prop="mobile">
          <el-input v-model="formdata.mobile" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleEdit = false">取 消</el-button>
        <el-button type="primary" @click="handleUpdateSeve()">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 添加的表单 -->
    <el-dialog
      title="添加用户"
      :visible.sync="dialogFormVisibleAdd"
      width="40%"
      @close="handleClose('RuleForm')"
    >
      <el-form :model="formdata" :rules="rules" ref="RuleForm">
        <el-form-item label="用户名" label-width="120px" prop="username">
          <el-input v-model="formdata.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" label-width="120px" prop="password">
          <el-input v-model="formdata.password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" label-width="120px" prop="repwd">
          <el-input v-model="formdata.repwd" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" label-width="120px" prop="email">
          <el-input v-model="formdata.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="手机号" label-width="120px" prop="mobile">
          <el-input v-model="formdata.mobile" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleAdd = false">取 消</el-button>
        <el-button type="primary" @click="handleAdd">确 定</el-button>
      </div>
    </el-dialog>
    
  </el-card>
</template>

<script>
export default {
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === "" || value === undefined) {
        callback(new Error("请输入密码"));
      } else if (value !== this.formdata.password) {
        callback(new Error("两次密码不一样"));
      } else {
        callback();
      }
    };
    var validatorEmail = (rule, value, callback) => {
      let email = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
      if (value === "" || value === undefined) {
        callback(new Error("请填写邮箱"));
      } else if (!email.test(value)) {
        callback(new Error("邮箱格式不正确"));
      } else {
        callback();
      }
    };
    var validatorPhone = (rule, value, callback) => {
      let email = /^1(3|4|5|7|8)\d{9}$/;
      if (value === "" || value === undefined) {
        callback(new Error("请填写手机号"));
      } else if (!email.test(value)) {
        callback(new Error("手机号格式不正确"));
      } else {
        callback();
      }
    };

    return {
      role:{},//角色数据
      loading:false,//加载
      user: [], //用户数据
      search: "", //搜索
      pagenum: 1, //当前页码
      pagesize: 2, //每页显示条数
      total: 0,
      dialogFormVisibleAdd: false, //添加用户框的控制
      dialogFormVisibleEdit: false, //修改用户框的控制
      dialogFormVisibleRole: false, //分配角色
      formdata: {},
      rules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 2, max: 10, message: "长度在2~10之间", trigger: "blur" }
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 6, max: 16, message: "长度在6~16之间", trigger: "blur" }
        ],
        repwd: [{ required: true, validator: validatePass, trigger: "blur" }],
        email: [{ required: true, validator: validatorEmail, trigger: "blur" }],
        mobile: [{ required: true, validator: validatorPhone, trigger: "blur" }]
      }
    };
  },
  created() {
    this.loadData();
  },
  methods: {
    //分配角色
    handleEditRole(){
      
        if(this.formdata.rid===undefined){
          console.log('rid='+this.formdata.rid);
           this.$message.warning("请分配角色")
           return
        }
        this.$http.put(`users/${this.formdata.id}/role`,this.formdata)
         .then(rep => {
              const {
                data,
                meta: { msg, status }
              } = rep.data;
              if (status === 200) {
                this.loadData()
               this.dialogFormVisibleRole = false
               this.$message.success(msg)
              }
            });
    },
    //打开角色分配对话框
    handleRole(user) {
       this.$http
            .get(`users/${user.id}`)
            .then(rep => {
              const {
                data,
                meta: { msg, status }
              } = rep.data;
              if (status === 200) {
                this.formdata=data
                this.formdata.rid=data.rid==-1?undefined:data.rid
              } 
            });
         
          this.$http.get(`roles`).then(rep => {
            console.log(rep);
            const {
              data,
              meta: { msg, status }
            } = rep.data;
            if(status === 200){
              this.role=data
             
            }
          });

          this.dialogFormVisibleRole = true;
    
    },

    //修改保存
    handleUpdateSeve() {
      this.$refs["RuleEditForm"].validate(valid => {
        if (valid) {
          this.$http
            .put(`users/${this.formdata.id}`, this.formdata)
            .then(rep => {
              const {
                data,
                meta: { msg, status }
              } = rep.data;
              if (status === 200) {
                this.loadData();
                this.$message.success(msg);
                this.dialogFormVisibleEdit = false;
              }
            });
        }
      });
    },
    //修改之前的添加值
    handleUpdate(id) {
      console.log(id);
      this.$http.get(`users/${id}`).then(rep => {
        const {
          data,
          meta: { msg, status }
        } = rep.data;
        if (status === 200) {
          this.formdata = data;
          this.dialogFormVisibleEdit = true;
        }
      });
    },

    //添加用户
    handleAdd() {
      this.$refs["RuleForm"].validate(valid => {
        if (valid) {
          //验证成功
          this.$http.post(`users`, this.formdata).then(rep => {
            const {
              data,
              meta: { msg, status }
            } = rep.data;
            if (status === 201) {
              this.loadData();
              //关闭对话框
              this.dialogFormVisibleAdd = false;
              this.$message.success(msg);
            } 
          });
        }
      });
    },
    //关闭用户添加对话框时
    handleClose(formName) {
      this.formdata = {};
      //重置rule
      this.$refs[formName].resetFields();
    },
    //删除用户
    handelDelete(id) {
      this.$confirm("确定删除用户吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.$http.delete(`users/${id}`).then(rep => {
          const {
            data,
            meta: { msg, status }
          } = rep.data;
          if (status === 200) {
            this.loadData();
            this.$message.success("删除成功");
          }
        });
      });
    },

    //修改
    handleChangeState(id, state) {
      this.$http.put(`users/${id}/state/${state}`).then(rep => {
        const {
          data,
          meta: { msg, status }
        } = rep.data;
        if (status === 200) {
          this.loadData();
          this.$message.success(msg);
        }
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
      this.loading=true;
     await this.$http
        .get(
          `users?query=${this.search}&pagenum=${this.pagenum}&pagesize=${this.pagesize}`
        )
        .then(rep => {
          const {
            data,
            meta: { msg, status }
          } = rep.data;
          console.log(rep);
          if (status === 200) {
            this.user = data.users;
            this.pagenums = data.pagenum;
            this.total = data.total;
          }
        })
        .catch(rep => {
          console.log(rep);
        });
         this.loading=false;
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