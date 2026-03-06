<template>
  <div class="student-list">
    <div class="page-header">
      <h2 class="page-title">学员管理</h2>
      <el-button type="primary" @click="showAddDialog">
        <el-icon><Plus /></el-icon>
        新增学员
      </el-button>
    </div>

    <div class="search-form">
      <el-form :inline="true" :model="searchForm">
        <el-form-item label="关键词">
          <el-input v-model="searchForm.keyword" placeholder="请输入姓名或ID" clearable />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">查询</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </div>

    <el-table :data="list" border stripe v-loading="loading">
      <el-table-column prop="id" label="ID" width="80" />
      <el-table-column prop="name" label="姓名" />
      <el-table-column label="年龄" width="80">
        <template #default="{ row }">
          {{ getAge(row.birth_date) }}
        </template>
      </el-table-column>
      <el-table-column prop="remaining_hours" label="剩余课时" width="100" />
      <el-table-column prop="points" label="积分" width="100" />
      <el-table-column label="操作" width="200" fixed="right">
        <template #default="{ row }">
          <el-button type="primary" link size="small" @click="showEditDialog(row)">编辑</el-button>
          <el-button type="warning" link size="small" @click="showTopupDialog(row)">充值</el-button>
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
        <el-form-item label="姓名" prop="name">
          <el-input v-model="form.name" placeholder="请输入姓名" />
        </el-form-item>
        <el-form-item label="出生日期" prop="birth_date">
          <el-date-picker
            v-model="form.birth_date"
            type="date"
            placeholder="选择出生日期"
            value-format="YYYY-MM-DD"
          />
        </el-form-item>
        <el-form-item label="照片">
          <el-input v-model="form.photo" placeholder="请输入照片URL" />
        </el-form-item>
        <el-form-item label="初始课时">
          <el-input-number v-model="form.remaining_hours" :min="0" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </template>
    </el-dialog>

    <el-dialog
      v-model="topupDialogVisible"
      title="课时充值"
      width="400px"
      @close="handleTopupDialogClose"
    >
      <el-form ref="topupFormRef" :model="topupForm" :rules="topupRules" label-width="80px">
        <el-form-item label="充值课时" prop="amount">
          <el-input-number v-model="topupForm.amount" :min="1" :max="100" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="topupDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleTopupSubmit">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getStudents, createStudent, updateStudent, deleteStudent } from '@/api/student'
import { createHourTopup } from '@/api/financial'
import dayjs from 'dayjs'

const loading = ref(false)
const list = ref([])
const total = ref(0)
const dialogVisible = ref(false)
const topupDialogVisible = ref(false)
const dialogTitle = computed(() => form.id ? '编辑学员' : '新增学员')
const formRef = ref()
const topupFormRef = ref()

const searchForm = reactive({
  keyword: '',
  page: 1,
  pageSize: 10
})

const form = reactive({
  id: null,
  name: '',
  birth_date: '',
  photo: '',
  remaining_hours: 0,
  points: 0
})

const topupForm = reactive({
  student_id: null,
  amount: 10
})

const rules = {
  name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
  birth_date: [{ required: true, message: '请选择出生日期', trigger: 'change' }]
}

const topupRules = {
  amount: [{ required: true, message: '请输入充值课时', trigger: 'blur' }]
}

const getAge = (birthDate) => {
  return dayjs().diff(dayjs(birthDate), 'year')
}

const getList = async () => {
  try {
    loading.value = true
    const data = await getStudents(searchForm)
    list.value = data.list
    total.value = data.total
  } catch (error) {
    console.error('获取学员列表失败:', error)
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
    name: '',
    birth_date: '',
    photo: '',
    remaining_hours: 0,
    points: 0
  })
  dialogVisible.value = true
}

const showEditDialog = (row) => {
  Object.assign(form, {
    id: row.id,
    name: row.name,
    birth_date: row.birth_date,
    photo: row.photo,
    remaining_hours: row.remaining_hours,
    points: row.points
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
      await updateStudent(form.id, form)
      ElMessage.success('更新成功')
    } else {
      await createStudent(form)
      ElMessage.success('创建成功')
    }
    dialogVisible.value = false
    getList()
  } catch (error) {
    console.error('提交失败:', error)
  }
}

const showTopupDialog = (row) => {
  topupForm.student_id = row.id
  topupForm.amount = 10
  topupDialogVisible.value = true
}

const handleTopupDialogClose = () => {
  topupFormRef.value?.resetFields()
}

const handleTopupSubmit = async () => {
  try {
    await topupFormRef.value.validate()
    await createHourTopup(topupForm)
    ElMessage.success('充值成功')
    topupDialogVisible.value = false
    getList()
  } catch (error) {
    console.error('充值失败:', error)
  }
}

const handleDelete = (row) => {
  ElMessageBox.confirm('确定要删除该学员吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    try {
      await deleteStudent(row.id)
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
.student-list {
  padding: 20px;
  background: #fff;
  border-radius: 4px;
}
</style>
