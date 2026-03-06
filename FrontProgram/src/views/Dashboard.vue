<template>
  <div class="dashboard">
    <div class="stat-grid">
      <div class="stat-card primary">
        <div class="stat-icon">
          <el-icon><User /></el-icon>
        </div>
        <div class="stat-info">
          <div class="stat-label">总学员数</div>
          <div class="stat-value">{{ stats.studentCount }}</div>
        </div>
      </div>

      <div class="stat-card success">
        <div class="stat-icon">
          <el-icon><UserFilled /></el-icon>
        </div>
        <div class="stat-info">
          <div class="stat-label">教练人数</div>
          <div class="stat-value">{{ stats.coachCount }}</div>
        </div>
      </div>

      <div class="stat-card warning">
        <div class="stat-icon">
          <el-icon><Reading /></el-icon>
        </div>
        <div class="stat-info">
          <div class="stat-label">班级数量</div>
          <div class="stat-value">{{ stats.classCount }}</div>
        </div>
      </div>

      <div class="stat-card info">
        <div class="stat-icon">
          <el-icon><Money /></el-icon>
        </div>
        <div class="stat-info">
          <div class="stat-label">本月营收</div>
          <div class="stat-value">¥{{ stats.monthlyRevenue }}</div>
        </div>
      </div>
    </div>

    <el-row :gutter="20" style="margin-top: 20px">
      <el-col :span="12">
        <div class="card">
          <h3 class="card-title">出勤统计</h3>
          <div id="attendanceChart" style="height: 300px"></div>
        </div>
      </el-col>

      <el-col :span="12">
        <div class="card">
          <h3 class="card-title">营收趋势</h3>
          <div id="revenueChart" style="height: 300px"></div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import * as echarts from 'echarts'
import { getAttendanceStats, getStudentGrowth, getRevenueStats } from '@/api/stats'

const stats = ref({
  studentCount: 0,
  coachCount: 0,
  classCount: 0,
  monthlyRevenue: 0
})

const initStats = async () => {
  try {
    const growthData = await getStudentGrowth({ period: 'month' })
    stats.value.studentCount = growthData.totalStudents

    const revenueData = await getRevenueStats({ period: 'month' })
    stats.value.monthlyRevenue = revenueData.income
  } catch (error) {
    console.error('获取统计数据失败:', error)
  }
}

const initCharts = async () => {
  try {
    const attendanceData = await getAttendanceStats({ period: 'month' })
    initAttendanceChart(attendanceData)
    initRevenueChart()
  } catch (error) {
    console.error('获取图表数据失败:', error)
  }
}

const initAttendanceChart = (data) => {
  const chart = echarts.init(document.getElementById('attendanceChart'))
  chart.setOption({
    tooltip: {
      trigger: 'item'
    },
    legend: {
      bottom: 0
    },
    series: [
      {
        name: '出勤情况',
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 2
        },
        label: {
          show: false
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 20,
            fontWeight: 'bold'
          }
        },
        data: [
          { value: data.normal_count || 0, name: '正常' },
          { value: data.late_count || 0, name: '迟到' },
          { value: data.leave_count || 0, name: '请假' },
          { value: data.absent_count || 0, name: '缺席' }
        ]
      }
    ]
  })
}

const initRevenueChart = () => {
  const chart = echarts.init(document.getElementById('revenueChart'))
  chart.setOption({
    tooltip: {
      trigger: 'axis'
    },
    legend: {
      data: ['收入', '支出']
    },
    xAxis: {
      type: 'category',
      data: ['1月', '2月', '3月', '4月', '5月', '6月']
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        name: '收入',
        type: 'bar',
        data: [12000, 15000, 18000, 14000, 20000, 25000],
        itemStyle: {
          color: '#FF6B6B'
        }
      },
      {
        name: '支出',
        type: 'bar',
        data: [8000, 10000, 12000, 9000, 11000, 13000],
        itemStyle: {
          color: '#4ECDC4'
        }
      }
    ]
  })
}

onMounted(() => {
  initStats()
  initCharts()
})
</script>

<style scoped lang="scss">
.dashboard {
  .stat-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 20px;
  }

  .card {
    background: #fff;
    border-radius: 8px;
    padding: 20px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);

    .card-title {
      font-size: 16px;
      font-weight: 600;
      margin-bottom: 16px;
      color: #333;
    }
  }
}
</style>
