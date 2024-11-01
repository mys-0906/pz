<template>
  <div class="btns">
    <el-button :icon="Plus" type="success" @click="open(null)" size="small">添加</el-button>
    <el-popconfirm
      confirm-button-text="是"
      cancel-button-text="否"
      :icon="InfoFilled"
      icon-color="#626AEF"
      title="是否确认删除所选内容"
      @confirm="confirmEvent"
    >
      <template #reference>
        <el-button :icon="Delete" type="danger" size="small">删除</el-button>
      </template>
    </el-popconfirm>
  </div>
  <el-table
   :data="tableData.list"
    style="width: 100%;"
    @selection-change="handleSelectionChange"
  >
    <el-table-column type="selection" width="55" />
    <el-table-column prop="id" label="id"/>
    <el-table-column prop="name" label="姓名"/>
    <el-table-column label="头像">
      <template #default="scope">
        <el-image 
          style="width: 65px;height: 60px;"
          :src="scope.row.avatar"
        />
      </template>
    </el-table-column>
    <el-table-column prop="sex" label="性别">
      <template #default="scope">
        {{ scope.row.sex ==='1' ? '男':'女' }}
      </template>
    </el-table-column>
    <el-table-column prop="phone" label="手机号"/>
    <el-table-column prop="active" label="状态">
      <template #default="scope">
        <el-tag class="ml-2" :type="scope.row.active ? 'success' : 'danger'">{{ scope.row.active ? '正常' : '失效' }}</el-tag>
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
    title="添加陪护师"
    width="500px"
    >
    <el-form
      ref="formRef"
      label-width="100px"
      label-position="left"
      :model="form"
      :rules="rules"
    >
      <el-form-item v-show="false" prop="id">
        <el-input v-model="form.id" />
      </el-form-item>
      <el-form-item label="姓名" prop="name">
        <el-input v-model="form.name" placeholder="请输入姓名"/>
      </el-form-item>
      <!-- <el-form-item label="头像" prop="avatar">
        <el-button v-if="!form.avatar" type="success">点击上传</el-button>
        <el-image
          v-else
          :src="form.avatar"
          style="width: 100px;height: 100px;"
        />
      </el-form-item> -->
      <el-form-item label="头像" prop="avatar">
        <el-upload
        class="avatar-uploader"
        action=""
        :show-file-list="false"
        :before-upload="beforeAvatarUpload"
        :on-change="handleFileChange"
        :auto-upload="false">
        <div v-if="previewUrl" class="avatar-preview">
          <img :src="previewUrl" class="avatar">
          <div class="mask">
            <el-icon><Edit /></el-icon>
          </div>
        </div>
        <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
      </el-upload>
      </el-form-item>
      <el-form-item label="性别" prop="sex">
        <el-select v-model="form.sex" placeholder="请选择性别">
          <el-option label="男" value="1"></el-option>
          <el-option label="女" value="0"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="年龄" prop="age">
        <el-input-number v-model="form.age" :min="20" :max="50"/>
      </el-form-item>
      <el-form-item label="手机号" prop="phone">
        <el-input v-model="form.phone" placeholder="请输入手机号"/>
      </el-form-item>
      <el-form-item label="是否生效" prop="active">
         <el-radio-group v-model="form.active">
          <el-radio :value="0">失效</el-radio>
          <el-radio :value="1">生效</el-radio>
         </el-radio-group>
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
import { Plus, Edit,InfoFilled,Delete } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';
import { ref,reactive,onMounted,nextTick} from 'vue'
import { addPzs,getPzs,updataPzs,deletePzs } from '../../../api/index'

let isAdd = ref(true)
const previewUrl = ref('');
// 表格数据
const paginationData = reactive({
    pageNum: 1,
    pageSize: 10
  })
  // 列表数据
const tableData = reactive({
    list: [],
    total: 0,
    })

const form = reactive({
  id: '',
  phone: '',
  active: 1,
  age: 25,
  avatar: '',
  name: '',
  sex: '',
})
// 获得所有陪诊师数据
const getPzsList = () => {
  getPzs(paginationData).then(({data}) => {
    data.list.forEach((item,index) => {
      item.active = Number(item.active)
    })
    tableData.list = data.list
    tableData.total = data.total
  })
}
onMounted(() => {
  getPzsList()
})
// 文件上传前的检查
const beforeAvatarUpload = (file) => {
  const isJPG = ['image/jpeg', 'image/png', 'image/gif', 'image/bmp'].includes(file.type);
  const isLt2M = file.size / 1024 / 1024 < 5;
  if (!isJPG) {
    ElMessage.error('上传头像图片只能是 JPG PNG GIF BMP 格式!');
  }
  if (!isLt2M) {
    ElMessage.error('上传头像图片大小不能超过 5MB!');
  }
  return isJPG && isLt2M;
};
// 文件选择后的处理并将图片保存为base64编码格式
const handleFileChange = (file, fileList) => {
  if (!file.raw) {
    return;
  }
  const reader = new FileReader();
  reader.onload = (e) => {
    previewUrl.value = e.target.result;
    form.avatar = previewUrl.value
  };
  reader.readAsDataURL(file.raw);
};
// 表单有关
const dialogFormVisable = ref(false)
const beforeClose = () => {
  dialogFormVisable.value = false
  formRef.value.resetFields()
}

const formRef = ref()
// 手机号校验
const validateUser = (rule,value,callback) => {
    if(value ==='') {
      callback(new Error('账号不能为空'))
    }else {
      const phoneReg = /^1(3[0-9]|4[01456879]|5[0-35-9]|6[2567]|7[0-8]|8[0-9]|9[0-35-9])\d{8}$/
      phoneReg.test(value) ? callback() : callback(new Error('手机号格式错误,请输入正确手机号')) 
    }
  }
  // 表单规则校验
const rules = reactive({
    name: [{ required: true,trigger: 'biur',message: '请填写姓名' }],
    avatar: [{ required: true,message: '请添加头像' }],
    sex: [{ required: true,trigger: 'change',message: '请选择性别' }],
    phone: [{ required: true,validator: validateUser,trigger: 'blur' }],
})
// 表单提交
const confirm = async (formEL) => {
    if(!formEL) return
    await formEL.validate((valid,fields) => {
      if(valid) {
        if(isAdd.value) {
          addPzs(form)
        }else {
          updataPzs(form)
        }
        beforeClose()
        getPzsList()
      }else {
        console.log('error submit',fields);
      }
    })
  }
const open = (rowData={}) => {
  dialogFormVisable.value = true
  nextTick(() => {
    // 如果是编辑
    if(rowData) {
      Object.assign(form,rowData)
      isAdd.value = false
    }else {
      isAdd.value = true
    }
  })
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
// 列表多选
const selectTabeData = ref([])
const handleSelectionChange = (val) => {
  selectTabeData.value = val
}
// 删除实现
const confirmEvent = () => {
// 用户没有选择
  if(!selectTabeData.value.length) {  
    return ElMessage.warning('请选择至少一项数据')
  }else {
    const arr = selectTabeData.value.map((item) => {
      return item.id
    })
    deletePzs({id: arr}).then(({data}) => {
      if(data.status === 0) {
        ElMessage.success(data.message)
        getPzsList()
      }else {
        ElMessage.warning(data.message)
      }
    })
  }
}
</script>

<style lang="less" scoped>
  .btns{
    padding: 10px 0 10px 10px;
    background-color: #fff;
  }
</style>