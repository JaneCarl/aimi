<template>
  <div class="coach-list">
    <div class="page-header">
      <h2 class="page-title">教练管理</h2>
      <el-button type="primary" @click="showAddDialog">
        <el-icon><Plus /></el-icon>
        新增教练
      </el-button>
    </div>

    <div class="search-form">
      <el-form :inline="true" :model="searchForm">
        <el-form-item label="关键词">
          <el-input v-model="searchForm.keyword" placeholder="请输入关键词" clearable />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">查询</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </div>

    <el-table :data="list" border stripe v-loading="loading">
      <el-table-column prop="id" label="ID" width="80" />
      <el-table-column prop="nickname" label="昵称" />
      <el-table-column prop="phone" label="手机号" />
      <el-table-column prop="openid" label="OpenID" show-overflow-tooltip />
      <el-table-column label="操作" width="200" fixed="right">
        <template #default="{ row }">
          <el-button type="primary" link size="small" @click="showEditDialog(row)">编辑</el-button>
          <el-button type="danger" link size="small" @click="handleDelete(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-container">
      <el-pagination
        v-model:current-page="searchForm.page"
        v-model:page-size="searchForm.pageSize"
        :total="total"
        :page-sizes="[10, 20, 50, 100]"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="getList"
        @current-change="getList"
      />
    </div>

    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="500px"
      @close="handleDialogClose"
    >
      <el-form ref="formRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="昵称" prop="nickname">
          <el-input v-model="form.nickname" placeholder="请输入昵称" />
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="form.phone" placeholder="请输入手机号" />
        </el-form-item>
        <el-form-item label="OpenID" prop="openid">
          <el-input v-model="form.openid" placeholder="请输入OpenID" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getCoaches, createCoach, updateCoach, deleteCoach } from '@/api/coach'

const loading = ref(false)
const list = ref([])
const total = ref(0)
const dialogVisible = ref(false)
const dialogTitle = computed(() => form.id ? '编辑教练' : '新增教练')
const formRef = ref()

const searchForm = reactive({
  keyword: '',
  page: 1,
  pageSize: 10
})

const form = reactive({
  id: null,
  nickname: '',
  phone: '',
  openid: ''
})

const rules = {
  nickname: [{ required: true, message: '请输入昵称', trigger: 'blur' }],
  openid: [{ required: true, message: '请输入OpenID', trigger: 'blur' }]
}

const getList = async () => {
  try {
    loading.value = true
    const data = await getCoaches(searchForm)
    list.value = data.list
    total.value = data.total
  } catch (error) {
    console.error('获取教练列表失败:', error)
  } finally {
    loading.value = false
  }
}

const handleSearch = () => {
  searchForm.page = 1
  getList()
}

const handleReset = () => {
  searchForm.keyword = ''
  searchForm.page = 1
  getList()
}

const showAddDialog = () => {
  Object.assign(form, {
    id: null,
    nickname: '',
    phone: '',
    openid: ''
  })
  dialogVisible.value = true
}

const showEditDialog = (row) => {
  Object.assign(form, {
    id: row.id,
    nickname: row.nickname,
    phone: row.phone,
    openid: row.openid
  })
  dialogVisible.value = true
}

const handleDialogClose = () => {
  formRef.value?.resetFields()
}

const handleSubmit = async () => {
  try {
    await formRef.value.validate()
    if (form.id) {
      await updateCoach(form.id, form)
      ElMessage.success('更新成功')
    } else {
      await createCoach(form)
      ElMessage.success('创建成功')
    }
    dialogVisible.value = false
    getList()
  } catch (error) {
    console.error('提交失败:', error)
  }
}

const handleDelete = (row) => {
  ElMessageBox.confirm('确定要删除该教练吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    try {
      await deleteCoach(row.id)
      ElMessage.success('删除成功')
      getList()
    } catch (error) {
      console.error('删除失败:', error)
    }
  }).catch(() => {})
}

getList()
</script>

<style scoped lang="scss">
.coach-list {
  @extend .app-container;
}
</style>
