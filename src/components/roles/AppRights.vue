<template>
<el-card class="box-card">
    <!--面包屑导航-->
    <cur-breadcrumb level1="权限管理" level2="权限列表"></cur-breadcrumb>
    <!-- 表格 -->
    <!-- 表格 -->
    <el-table :data="right" border class="tabs" style="width:100%" height="400px" v-loading="loading">
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="authName" label="权限名"></el-table-column>
        <el-table-column prop="path" label="路径"></el-table-column>
        <el-table-column label="层级">
            <template slot-scope="scope">
                <span v-if="scope.row.level==='0'">一级</span>
                <span v-if="scope.row.level==='1'">二级</span>
                <span v-if="scope.row.level==='2'">三级</span>
            </template>
        </el-table-column>

    </el-table>

</el-card>
</template>

<script>
export default {
    data() {
        return {
            right: [], //权限列表
            loading:false,
        }
    },
    created() {
        this.loadData();
    },
    methods: {
        async loadData() {
            this.loading = true;
            await this.$http.get(`/rights/list`)
                .then(rep => {
                    const {
                        data,
                        meta: {
                            msg,
                            status
                        }
                    } = rep.data;
                    if (status === 200) {
                        this.right = data
                    }
                  
                }).catch(rep => {
                    console.log(rep);
                })
            this.loading = false;
        }
    },
}
</script>

<style scoped>
.tabs {
    margin: 30px 0;
}
</style>
