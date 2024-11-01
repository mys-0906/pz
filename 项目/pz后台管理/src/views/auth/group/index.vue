<template>
  <div class="btns">
    <el-button :icon="Plus" type="success" @click="open(null)" size="small">添加</el-button>
  </div>
  <el-table :data="tableData.list">
    <el-table-column prop="id" label="id"/>
    <el-table-column prop="name" label="昵称"/>
    <el-table-column prop="permissionsName" label="菜单权限"/>
    <el-table-column label="操作">
      <template #default="scope">
        <el-button type="success" @click="open(scope.row)">编辑</el-button>
      </template>
    </el-table-column>
  </el-table>
  <div class="pagination-info">
    <el-pagination
      v-model:current-page="paginationData.pageNum"
      :page-size="paginationData.pageSize"
      :background="false"
      size="small"
      layout="total, prev, pager, next"
      :total="tableData.total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
  <el-dialog
    v-model="dialogFormVisable"
    :before-close="beforeClose"
    title="添加权限"
    width="500px"
    >
    <el-form
    ref="formRef"
    label-width="100px"
    label-position="left"
    :model="form"
    :rules="rules"
    >
      <el-form-item label="名称" prop="name">
        <el-input v-model="form.name" placeholder="请填写权限名称且名称不能重复"></el-input>
      </el-form-item>
      <el-form-item label="权限" prop="permissions">
        <el-tree 
        ref="treeRef"
        style="max-width: 600px"
        :data="data"
        show-checkbox
        node-key="id"
        :default-checked-keys="[2]"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button type="success" @click="confirm(formRef)">确认</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { authGroup,menuList } from '../../../api/index'
import { ref,reactive,onMounted,nextTick } from 'vue'
import { Plus } from '@element-plus/icons-vue';
// 表单数据
  const form = reactive({
    id:'',
    name: '',
    permissions:'',
  })
// 菜单数据
  const data = [
    {
      id: 1,
      label: '控制台',
    },
    {
      id: 2,
      label: '权限管理',
      children: [
        {
          id: 21,
          label: '账号管理',
        },
        {
          id: 22,
          label: '菜单管理',
        }
      ],
    },
    {
      id: 3,
      label: 'xx陪诊',
      children: [
        {
          id: 31,
          label: '陪护管理',
        },
        {
          id: 32,
          label: '订单管理'
        },
    ],
    }
  ]
// 初始状态为关闭状态
  const dialogFormVisable = ref(false)
// 关闭回调
  const beforeClose = () => {
    dialogFormVisable.value = false
    // 重置表单
    formRef.value.resetFields()
    // tree选择重置
    treeRef.value.setCheckedKeys([2])
  }
// 编辑功能
  const open = (rowData ={}) => {
    dialogFormVisable.value = true
    nextTick(() => {
      if(rowData) {
        Object.assign(form,{ id: rowData.id,name: rowData.name })
        treeRef.value.setCheckedKeys(rowData.permissions)
      }
    })
  }
// 列表数据
  const tableData = reactive({
    list: [],
    total: 0,
  })
// 列表展示最大数
  const paginationData = reactive({
    pageNum: 1,
    pageSize: 10,
  })
  // 分页的两个回调
  const handleSizeChange = (val) => {
    paginationData.pageSize = val
    getListData()
  }
  const handleCurrentChange =(val) => {
    paginationData.pageNum = val
    getListData()
  }
  onMounted(() => {
    getListData()
  })
  // 调用列表数据接口
  const getListData = () => {
    menuList(paginationData).then(({data}) => {
      tableData.list = data.list
      tableData.total = data.total
      tableData.list.forEach((item,index) => {
        item.id = (index + 1) + (paginationData.pageNum - 1) * 10
      })
    })
  }
  const treeRef = ref()
  const formRef = ref()
  // 表单校验
  const rules = reactive({
    name: [{ required: true,trigger: 'blur',message: '请输入权限名称' }]
  })
  // 表单提交
  const confirm = async (formEL) => {
    if(!formEL) return
    await formEL.validate((valid,fields) => {
      if(valid) {
        const arr = treeRef.value.getCheckedNodes()
        let permissionsName = ""
        const permissions = JSON.stringify(treeRef.value.getCheckedKeys())
        const name = form.name

        arr.map((item) => {
          permissionsName += item.label
          permissionsName += " "
        })
        authGroup({permissions: permissions,name: name, permissionsName: permissionsName,})
        window.location.reload()
      }else {
        console.log('error submit',fields);
      }
    })
  }
</script>

<style lang="less" scoped>
  .btns{
    padding: 10px 0 10px 10px;
    background-color: #fff;
  }
</style>