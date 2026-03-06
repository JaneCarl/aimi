<template>
  <div class="financial-list">
    <div class="page-header">
      <h2 class="page-title">财务管理</h2>
      <el-button type="primary" @click="showAddDialog">
        <el-icon><Plus /></el-icon>
        新增财务记录
      </el-button>
    </div>

    <div class="search-form">
      <el-form :inline="true" :model="searchForm">
        <el-form-item label="类型">
          <el-select v-model="searchForm.type" placeholder="请选择类型" clearable>
            <el-option label="收入" value="income" />
            <el-option label="支出" value="expense" />
          </el-select>
        </el-form-item>
        <el-form-item label="日期范围">
          <el-date-picker
            v-model="dateRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="YYYY-MM-DD"
            @change="handleDateChange"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">查询</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </div>

    <el-table :data="list" border stripe v-loading="loading">
      <el-table-column prop="id" label="ID" width="80" />
      <el-table-column label="类型" width="100">
        <template #default="{ row }">
          <el-tag :type="row.type === 'income' ? 'success' : 'danger'">
            {{ row.type === 'income' ? '收入' : '支出' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="category" label="分类" />
      <el-table-column prop="amount" label="金额" width="120">
        <template #default="{ row }">
          <span :style="{ color: row.type === 'income' ? '#67C23A' : '#F56C6C' }">
            {{ row.type === 'income' ? '+' : '-' }}¥{{ row.amount }}
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="description" label="描述" show-overflow-tooltip />
      <el-table-column prop="record_date" label="日期" width="120" />
      <el-table-column prop="created_at" label="创建时间" width="160" />
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
      title="新增财务记录"
      width="500px"
      @close="handleDialogClose"
    >
      <el-form ref="formRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="类型" prop="type">
          <el-select v-model="form.type" placeholder="请选择类型">
            <el-option label="收入" value="income" />
            <el-option label="支出" value="expense" />
          </el-select>
        </el-form-item>
        <el-form-item label="分类" prop="category">
          <el-select v-model="form.category" placeholder="请选择分类">
            <el-option label="课时费" value="课时费" />
            <el-option label="教练薪资" value="教练薪资" />
            <el-option label="场地费用" value="场地费用" />
            <el-option label="其他收入" value="其他收入" />
            <el-option label="其他支出" value="其他支出" />
          </el-select>
        </el-form-item>
        <el-form-item label="金额" prop="amount">
          <el-input-number v-model="form.amount" :min="0" :precision="2" />
        </el-form-item>
        <el-form-item label="日期" prop="record_date">
          <el-date-picker
            v-model="form.record_date"
            type="date"
            placeholder="选择日期"
            value-format="YYYY-MM-DD"
          />
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="form.description" type="textarea" placeholder="请输入描述" />
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
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import { getFinancialRecords, createFinancialRecord } from '@/api/financial'

const loading = ref(false)
const list = ref([])
const total = ref(0)
const dialogVisible = ref(false)
const formRef = ref()
const dateRange = ref([])

const searchForm = reactive({
  type: '',
  startDate: '',
  endDate: '',
  page: 1,
  pageSize: 10
})

const form = reactive({
  type: 'income',
  category: '',
  amount: 0,
  record_date: '',
  description: ''
})

const rules = {
  type: [{ required: true, message: '请选择类型', trigger: 'change' }],
  category: [{ required: true, message: '请选择分类', trigger: 'change' }],
  amount: [{ required: true, message: '请输入金额', trigger: 'blur' }],
  record_date: [{ required: true, message: '请选择日期', trigger: 'change' }]
}

const handleDateChange = (value) => {
  if (value && value.length === 2) {
    searchForm.startDate = value[0]
    searchForm.endDate = value[1]
  } else {
    searchForm.startDate = ''
    searchForm.endDate = ''
  }
}

const getList = async () => {
  try {
    loading.value = true
    const data = await getFinancialRecords(searchForm)
    list.value = data.list
    total.value = data.total
  } catch (error) {
    console.error('获取财务记录失败:', error)
  } finally {
    loading.value = false
  }
}

const handleSearch = () => {
  searchForm.page = 1
  getList()
}

const handleReset = () => {
  searchForm.type = ''
  searchForm.startDate = ''
  searchForm.endDate = ''
  dateRange.value = []
  searchForm.page = 1
  getList()
}

const showAddDialog = () => {
  Object.assign(form, {
    type: 'income',
    category: '',
    amount: 0,
    record_date: new Date().toISOString().split('T')[0],
    description: ''
  })
  dialogVisible.value = true
}

const handleDialogClose = () => {
  formRef.value?.resetFields()
}

const handleSubmit = async () => {
  try {
    await formRef.value.validate()
    await createFinancialRecord(form)
    ElMessage.success('添加成功')
    dialogVisible.value = false
    getList()
  } catch (error) {
    console.error('提交失败:', error)
  }
}

getList()
</script>

<style scoped lang="scss">
.financial-list {
  padding: 20px;
  background: #fff;
  border-radius: 4px;
}
</style>
