<template>
  <div class="course-list">
    <div class="page-header">
      <h2 class="page-title">课程管理</h2>
      <el-button type="primary" @click="showAddCourseDialog">
        <el-icon><Plus /></el-icon>
        新增课程
      </el-button>
    </div>

    <el-table :data="courses" border stripe v-loading="loading" style="margin-bottom: 20px">
      <el-table-column prop="id" label="ID" width="80" />
      <el-table-column prop="name" label="课程名称" />
      <el-table-column prop="level" label="级别" width="100">
        <template #default="{ row }">
          <el-tag :type="getLevelType(row.level)">{{ row.level }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="description" label="描述" show-overflow-tooltip />
      <el-table-column label="操作" width="200">
        <template #default="{ row }">
          <el-button type="primary" link size="small" @click="showEditCourseDialog(row)">编辑</el-button>
          <el-button type="danger" link size="small" @click="handleDeleteCourse(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="page-header" style="margin-top: 30px">
      <h2 class="page-title">班级管理</h2>
      <el-button type="primary" @click="showAddClassDialog">
        <el-icon><Plus /></el-icon>
        新增班级
      </el-button>
    </div>

    <el-table :data="classes" border stripe v-loading="classLoading">
      <el-table-column prop="id" label="ID" width="80" />
      <el-table-column prop="name" label="班级名称" />
      <el-table-column prop="course_name" label="所属课程" />
      <el-table-column prop="coach_name" label="教练" />
      <el-table-column prop="capacity" label="人数限制" width="100" />
      <el-table-column label="操作" width="200">
        <template #default="{ row }">
          <el-button type="primary" link size="small" @click="showEditClassDialog(row)">编辑</el-button>
          <el-button type="danger" link size="small" @click="handleDeleteClass(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog
      v-model="courseDialogVisible"
      :title="courseDialogTitle"
      width="500px"
      @close="handleCourseDialogClose"
    >
      <el-form ref="courseFormRef" :model="courseForm" :rules="courseRules" label-width="80px">
        <el-form-item label="课程名称" prop="name">
          <el-input v-model="courseForm.name" placeholder="请输入课程名称" />
        </el-form-item>
        <el-form-item label="级别" prop="level">
          <el-select v-model="courseForm.level" placeholder="请选择级别">
            <el-option label="初级" value="初级" />
            <el-option label="中级" value="中级" />
            <el-option label="高级" value="高级" />
          </el-select>
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="courseForm.description" type="textarea" placeholder="请输入描述" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="courseDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleCourseSubmit">确定</el-button>
      </template>
    </el-dialog>

    <el-dialog
      v-model="classDialogVisible"
      :title="classDialogTitle"
      width="500px"
      @close="handleClassDialogClose"
    >
      <el-form ref="classFormRef" :model="classForm" :rules="classRules" label-width="80px">
        <el-form-item label="课程" prop="course_id">
          <el-select v-model="classForm.course_id" placeholder="请选择课程" style="width: 100%">
            <el-option
              v-for="course in courses"
              :key="course.id"
              :label="course.name"
              :value="course.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="班级名称" prop="name">
          <el-input v-model="classForm.name" placeholder="请输入班级名称" />
        </el-form-item>
        <el-form-item label="教练">
          <el-select v-model="classForm.coach_id" placeholder="请选择教练" style="width: 100%" clearable>
            <el-option
              v-for="coach in coaches"
              :key="coach.id"
              :label="coach.nickname"
              :value="coach.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="人数限制">
          <el-input-number v-model="classForm.capacity" :min="1" :max="30" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="classDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleClassSubmit">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getCourses, createCourse, updateCourse, deleteCourse } from '@/api/course'
import { getClasses, createClass, updateClass, deleteClass } from '@/api/course'
import { getCoaches } from '@/api/coach'

const loading = ref(false)
const classLoading = ref(false)
const courses = ref([])
const classes = ref([])
const coaches = ref([])
const courseDialogVisible = ref(false)
const classDialogVisible = ref(false)
const courseDialogTitle = computed(() => courseForm.id ? '编辑课程' : '新增课程')
const classDialogTitle = computed(() => classForm.id ? '编辑班级' : '新增班级')
const courseFormRef = ref()
const classFormRef = ref()

const courseForm = reactive({
  id: null,
  name: '',
  level: '',
  description: ''
})

const classForm = reactive({
  id: null,
  course_id: null,
  coach_id: null,
  name: '',
  capacity: 10
})

const courseRules = {
  name: [{ required: true, message: '请输入课程名称', trigger: 'blur' }],
  level: [{ required: true, message: '请选择级别', trigger: 'change' }]
}

const classRules = {
  course_id: [{ required: true, message: '请选择课程', trigger: 'change' }],
  name: [{ required: true, message: '请输入班级名称', trigger: 'blur' }]
}

const getLevelType = (level) => {
  const map = {
    '初级': 'success',
    '中级': 'warning',
    '高级': 'danger'
  }
  return map[level] || ''
}

const getCoursesList = async () => {
  try {
    loading.value = true
    courses.value = await getCourses()
  } catch (error) {
    console.error('获取课程列表失败:', error)
  } finally {
    loading.value = false
  }
}

const getClassesList = async () => {
  try {
    classLoading.value = true
    classes.value = await getClasses()
  } catch (error) {
    console.error('获取班级列表失败:', error)
  } finally {
    classLoading.value = false
  }
}

const getCoachesList = async () => {
  try {
    const data = await getCoaches({ page: 1, pageSize: 100 })
    coaches.value = data.list
  } catch (error) {
    console.error('获取教练列表失败:', error)
  }
}

const showAddCourseDialog = () => {
  Object.assign(courseForm, {
    id: null,
    name: '',
    level: '',
    description: ''
  })
  courseDialogVisible.value = true
}

const showEditCourseDialog = (row) => {
  Object.assign(courseForm, {
    id: row.id,
    name: row.name,
    level: row.level,
    description: row.description
  })
  courseDialogVisible.value = true
}

const handleCourseDialogClose = () => {
  courseFormRef.value?.resetFields()
}

const handleCourseSubmit = async () => {
  try {
    await courseFormRef.value.validate()
    if (courseForm.id) {
      await updateCourse(courseForm.id, courseForm)
      ElMessage.success('更新成功')
    } else {
      await createCourse(courseForm)
      ElMessage.success('创建成功')
    }
    courseDialogVisible.value = false
    getCoursesList()
  } catch (error) {
    console.error('提交失败:', error)
  }
}

const handleDeleteCourse = (row) => {
  ElMessageBox.confirm('确定要删除该课程吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    try {
      await deleteCourse(row.id)
      ElMessage.success('删除成功')
      getCoursesList()
    } catch (error) {
      console.error('删除失败:', error)
    }
  }).catch(() => {})
}

const showAddClassDialog = () => {
  Object.assign(classForm, {
    id: null,
    course_id: null,
    coach_id: null,
    name: '',
    capacity: 10
  })
  classDialogVisible.value = true
}

const showEditClassDialog = (row) => {
  Object.assign(classForm, {
    id: row.id,
    course_id: row.course_id,
    coach_id: row.coach_id,
    name: row.name,
    capacity: row.capacity
  })
  classDialogVisible.value = true
}

const handleClassDialogClose = () => {
  classFormRef.value?.resetFields()
}

const handleClassSubmit = async () => {
  try {
    await classFormRef.value.validate()
    if (classForm.id) {
      await updateClass(classForm.id, classForm)
      ElMessage.success('更新成功')
    } else {
      await createClass(classForm)
      ElMessage.success('创建成功')
    }
    classDialogVisible.value = false
    getClassesList()
  } catch (error) {
    console.error('提交失败:', error)
  }
}

const handleDeleteClass = (row) => {
  ElMessageBox.confirm('确定要删除该班级吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    try {
      await deleteClass(row.id)
      ElMessage.success('删除成功')
      getClassesList()
    } catch (error) {
      console.error('删除失败:', error)
    }
  }).catch(() => {})
}

onMounted(() => {
  getCoursesList()
  getClassesList()
  getCoachesList()
})
</script>

<style scoped lang="scss">
.course-list {
  padding: 20px;
  background: #fff;
  border-radius: 4px;
}
</style>
