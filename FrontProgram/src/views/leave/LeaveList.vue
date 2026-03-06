<template>
  <div class="leave-list">
    <div class="page-header">
      <h2 class="page-title">请假审批</h2>
    </div>

    <el-table :data="list" border stripe v-loading="loading">
      <el-table-column prop="id" label="ID" width="80" />
      <el-table-column prop="student_name" label="学员姓名" />
      <el-table-column prop="parent_nickname" label="家长" />
      <el-table-column prop="class_name" label="课程" />
      <el-table-column prop="class_date" label="上课日期" width="120" />
      <el-table-column prop="reason" label="请假原因" show-overflow-tooltip />
      <el-table-column label="状态" width="100">
        <template #default="{ row }">
          <el-tag :type="getStatusType(row.status)">
            {{ getStatusText(row.status) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="created_at" label="申请时间" width="160" />
      <el-table-column label="操作" width="200" fixed="right">
        <template #default="{ row }">
          <el-button
            v-if="row.status === 'pending'"
            type="success"
            link
            size="small"
            @click="handleApprove(row, 'approved')"
          >
            批准
          </el-button>
          <el-button
            v-if="row.status === 'pending'"
            type="danger"
            link
            size="small"
            @click="handleApprove(row, 'rejected')"
          >
            拒绝
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getPendingLeaveRequests, approveLeaveRequest } from '@/api/leave'

const loading = ref(false)
const list = ref([])

const getStatusType = (status) => {
  const map = {
    'pending': 'warning',
    'approved': 'success',
    'rejected': 'danger'
  }
  return map[status] || ''
}

const getStatusText = (status) => {
  const map = {
    'pending': '待审批',
    'approved': '已批准',
    'rejected': '已拒绝'
  }
  return map[status] || status
}

const getList = async () => {
  try {
    loading.value = true
    list.value = await getPendingLeaveRequests()
  } catch (error) {
    console.error('获取请假列表失败:', error)
  } finally {
    loading.value = false
  }
}

const handleApprove = (row, status) => {
  const action = status === 'approved' ? '批准' : '拒绝'
  ElMessageBox.confirm(`确定要${action}该请假申请吗？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    try {
      await approveLeaveRequest(row.id, { status })
      ElMessage.success(`${action}成功`)
      getList()
    } catch (error) {
      console.error('审批失败:', error)
    }
  }).catch(() => {})
}

onMounted(() => {
  getList()
})
</script>

<style scoped lang="scss">
.leave-list {
  @extend .app-container;
}
</style>
