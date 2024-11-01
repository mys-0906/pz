<template>
  <div class="btns">
    <el-button :icon="Plus" type="success" @click="open(null)" size="small">添加</el-button>
  </div>
  <el-table :data="tableData.list">
    <el-table-column prop="id" label="id"/>
    <el-table-column prop="nicheng" label="昵称"/>
    <el-table-column prop="name" label="所属组别" />
    <el-table-column prop="phone" label="手机号"/>
    <el-table-column prop="active" label="状态">
      <template #default="scope">
        <el-tag class="ml-2" :type="scope.row.active ? 'success' : 'danger'">{{ scope.row.active ? '正常' : '失效' }}</el-tag>
      </template>
    </el-table-column>
    <el-table-column label="创建时间">
      <template #default="scope">
        <div class="flex-box">
          <el-icon><Clock /></el-icon>
          <span style="margin-left: 5px;">{{ scope.row.time }}</span>
        </div>
      </template>
    </el-table-column>
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
    title="编辑权限"
    width="500px"
    >
      <el-form
      ref="formRef"
      label-width="100px"
      label-position="left"
      :model="form"
      :rules="rules">
      <el-form-item label="手机号" prop="phone">
        <el-input v-model="form.phone"></el-input>
      </el-form-item>
      <el-form-item label="昵称" prop="nicheng">
        <el-input v-model="form.nicheng"></el-input>
      </el-form-item>
      <el-form-item label="菜单权限" prop="name">
        <el-select
          v-model="form.name"
          placeholder="请选择权限"
          style="width: 240px;"
        >
          <el-option 
            v-for="(item) in options"
            :key="item.id"
            :label="item.name"
            :value="item.name"
          />
        </el-select>
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
import { Clock } from '@element-plus/icons-vue';
import { authAdmin,getList,userSetMenu } from '../../../api/index'
import { reactive,onMounted,ref,nextTick } from 'vue'
import dayjs from 'dayjs'
const insert = ref(true)
  const paginationData = reactive({
    pageNum: 1,
    pageSize: 10
  })
  // 列表数据
  const tableData = reactive({
    list: [],
    total: 0,
    })
  onMounted(() => {
    getListData()
    // 只获得菜单的id,name
    getList().then(({data}) => {
      options.value = data.list
    })
  })
  // 用户列表详细数据
  const getListData = () => {
    authAdmin(paginationData).then(({data}) => {
      data.list.forEach((item) => {
        item.time = dayjs(Number(item.time)).format('YYYY-MM-DD')
      })
      tableData.list = data.list
      tableData.total = data.total
    })
  }
  const options = ref([])
  // 根据返回权限id匹配名称
  const permissionsName = (id) => {
    const data = options.value.find(el => el.id == id)
    return data ? data.name : '超级管理员'
  }
    // 分页的两个回调
  const handleSizeChange = (val) => {
    paginationData.pageSize = val
    getListData()
  }
  const handleCurrentChange =(val) => {
    paginationData.pageNum = val
    getListData()
  }
  // 弹窗
  const dialogFormVisable = ref(false)
  const beforeClose = () => {
    dialogFormVisable.value = false
    formRef.value.resetFields()
  }
  // 表单校验
  const rules = reactive({
    nicheng:[{required:true,trigger:'blur',message:'请填写昵称'}]
  })
  // 表单 
  const form = reactive({
    // 此处name是名称不是所属组
    name: '',
    id:'',
    nicheng:'',
    phone:'',
  })
  const formRef = ref()
  // 表单提交
  const confirm = async (formEL) => {
    if(!formEL) return
    await formEL.validate((valid,fields) => {
      if(valid) {
        const { name,id,nicheng,phone } = form
        userSetMenu({name: name,id: id,nicheng: nicheng,insert: insert.value,phone: phone}).then(({data}) => {
          if(data.status == 0) {
            dialogFormVisable.value = false
            getListData()
          }
        })
      }else {
        console.log('error submit',fields);
      }
    })
  }
  const open = (rowData ={}) => {
    dialogFormVisable.value = true
    nextTick(() => {
      if (rowData) {
        insert.value = false
        Object.assign(form,{ name: rowData.name,id: rowData.id,nicheng: rowData.nicheng,phone: rowData.phone })
      } else {
        insert.value = true
        Object.assign(form,{ name: rowData.name,id: rowData.id,nicheng: rowData.nicheng,phone: rowData.phone })
      }
    })
  }

</script>

<style lang="less" scoped>
  .flex-box {
    display: flex;
    align-items: center;
  }
  .btns{
    padding: 10px 0 10px 10px;
    background-color: #fff;
  }
</style>