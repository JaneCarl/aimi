<template>
  <div class="content-list">
    <div class="page-header">
      <h2 class="page-title">内容管理</h2>
      <div>
        <el-button type="primary" @click="showAddBannerDialog">
          <el-icon><Plus /></el-icon>
          新增轮播图
        </el-button>
        <el-button type="success" @click="showAddPromoDialog">
          <el-icon><Plus /></el-icon>
          新增优惠课程
        </el-button>
      </div>
    </div>

    <el-tabs v-model="activeTab">
      <el-tab-pane label="轮播图管理" name="banner">
        <el-table :data="banners" border stripe v-loading="bannerLoading">
          <el-table-column prop="id" label="ID" width="80" />
          <el-table-column label="图片" width="120">
            <template #default="{ row }">
              <el-image
                :src="row.image"
                fit="cover"
                style="width: 100px; height: 50px"
              />
            </template>
          </el-table-column>
          <el-table-column prop="title" label="标题" />
          <el-table-column prop="order_num" label="排序" width="80" />
          <el-table-column label="状态" width="100">
            <template #default="{ row }">
              <el-tag :type="row.status === 'active' ? 'success' : 'info'">
                {{ row.status === 'active' ? '启用' : '禁用' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="200">
            <template #default="{ row }">
              <el-button type="primary" link size="small" @click="showEditBannerDialog(row)">编辑</el-button>
              <el-button type="danger" link size="small" @click="handleDeleteBanner(row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>

      <el-tab-pane label="优惠课程管理" name="promo">
        <el-table :data="promos" border stripe v-loading="promoLoading">
          <el-table-column prop="id" label="ID" width="80" />
          <el-table-column prop="title" label="标题" />
          <el-table-column prop="course_name" label="课程" />
          <el-table-column prop="original_price" label="原价" width="100" />
          <el-table-column prop="promotional_price" label="优惠价" width="100" />
          <el-table-column prop="start_date" label="开始日期" width="120" />
          <el-table-column prop="end_date" label="结束日期" width="120" />
          <el-table-column label="状态" width="100">
            <template #default="{ row }">
              <el-tag :type="row.status === 'active' ? 'success' : 'info'">
                {{ row.status === 'active' ? '启用' : '禁用' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="200">
            <template #default="{ row }">
              <el-button type="primary" link size="small" @click="showEditPromoDialog(row)">编辑</el-button>
              <el-button type="danger" link size="small" @click="handleDeletePromo(row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>

    <el-dialog
      v-model="bannerDialogVisible"
      :title="bannerDialogTitle"
      width="500px"
      @close="handleBannerDialogClose"
    >
      <el-form ref="bannerFormRef" :model="bannerForm" :rules="bannerRules" label-width="80px">
        <el-form-item label="标题">
          <el-input v-model="bannerForm.title" placeholder="请输入标题" />
        </el-form-item>
        <el-form-item label="图片URL" prop="image">
          <el-input v-model="bannerForm.image" placeholder="请输入图片URL" />
        </el-form-item>
        <el-form-item label="链接">
          <el-input v-model="bannerForm.link" placeholder="请输入链接" />
        </el-form-item>
        <el-form-item label="排序">
          <el-input-number v-model="bannerForm.order_num" :min="0" />
        </el-form-item>
        <el-form-item label="状态">
          <el-switch v-model="bannerForm.status" active-value="active" inactive-value="inactive" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="bannerDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleBannerSubmit">确定</el-button>
      </template>
    </el-dialog>

    <el-dialog
      v-model="promoDialogVisible"
      :title="promoDialogTitle"
      width="500px"
      @close="handlePromoDialogClose"
    >
      <el-form ref="promoFormRef" :model="promoForm" :rules="promoRules" label-width="80px">
        <el-form-item label="课程" prop="course_id">
          <el-select v-model="promoForm.course_id" placeholder="请选择课程" style="width: 100%">
            <el-option
              v-for="course in courses"
              :key="course.id"
              :label="course.name"
              :value="course.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="标题" prop="title">
          <el-input v-model="promoForm.title" placeholder="请输入标题" />
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="promoForm.description" type="textarea" placeholder="请输入描述" />
        </el-form-item>
        <el-form-item label="原价">
          <el-input-number v-model="promoForm.original_price" :min="0" :precision="2" />
        </el-form-item>
        <el-form-item label="优惠价">
          <el-input-number v-model="promoForm.promotional_price" :min="0" :precision="2" />
        </el-form-item>
        <el-form-item label="开始日期">
          <el-date-picker
            v-model="promoForm.start_date"
            type="date"
            placeholder="选择开始日期"
            value-format="YYYY-MM-DD"
          />
        </el-form-item>
        <el-form-item label="结束日期">
          <el-date-picker
            v-model="promoForm.end_date"
            type="date"
            placeholder="选择结束日期"
            value-format="YYYY-MM-DD"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="promoDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handlePromoSubmit">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getBanners, createBanner, updateBanner, deleteBanner } from '@/api/content'
import { getPromotionalCourses, createPromotionalCourse, updatePromotionalCourse, deletePromotionalCourse } from '@/api/content'
import { getCourses } from '@/api/course'

const activeTab = ref('banner')
const bannerLoading = ref(false)
const promoLoading = ref(false)
const banners = ref([])
const promos = ref([])
const courses = ref([])
const bannerDialogVisible = ref(false)
const promoDialogVisible = ref(false)
const bannerDialogTitle = computed(() => bannerForm.id ? '编辑轮播图' : '新增轮播图')
const promoDialogTitle = computed(() => promoForm.id ? '编辑优惠课程' : '新增优惠课程')
const bannerFormRef = ref()
const promoFormRef = ref()

const bannerForm = reactive({
  id: null,
  image: '',
  title: '',
  link: '',
  order_num: 0,
  status: 'active'
})

const promoForm = reactive({
  id: null,
  course_id: null,
  title: '',
  description: '',
  original_price: 0,
  promotional_price: 0,
  start_date: '',
  end_date: '',
  status: 'active'
})

const bannerRules = {
  image: [{ required: true, message: '请输入图片URL', trigger: 'blur' }]
}

const promoRules = {
  course_id: [{ required: true, message: '请选择课程', trigger: 'change' }],
  title: [{ required: true, message: '请输入标题', trigger: 'blur' }]
}

const getBannersList = async () => {
  try {
    bannerLoading.value = true
    banners.value = await getBanners()
  } catch (error) {
    console.error('获取轮播图列表失败:', error)
  } finally {
    bannerLoading.value = false
  }
}

const getPromosList = async () => {
  try {
    promoLoading.value = true
    promos.value = await getPromotionalCourses()
  } catch (error) {
    console.error('获取优惠课程列表失败:', error)
  } finally {
    promoLoading.value = false
  }
}

const getCoursesList = async () => {
  try {
    courses.value = await getCourses()
  } catch (error) {
    console.error('获取课程列表失败:', error)
  }
}

const showAddBannerDialog = () => {
  Object.assign(bannerForm, {
    id: null,
    image: '',
    title: '',
    link: '',
    order_num: 0,
    status: 'active'
  })
  bannerDialogVisible.value = true
}

const showEditBannerDialog = (row) => {
  Object.assign(bannerForm, {
    id: row.id,
    image: row.image,
    title: row.title,
    link: row.link,
    order_num: row.order_num,
    status: row.status
  })
  bannerDialogVisible.value = true
}

const handleBannerDialogClose = () => {
  bannerFormRef.value?.resetFields()
}

const handleBannerSubmit = async () => {
  try {
    await bannerFormRef.value.validate()
    if (bannerForm.id) {
      await updateBanner(bannerForm.id, bannerForm)
      ElMessage.success('更新成功')
    } else {
      await createBanner(bannerForm)
      ElMessage.success('创建成功')
    }
    bannerDialogVisible.value = false
    getBannersList()
  } catch (error) {
    console.error('提交失败:', error)
  }
}

const handleDeleteBanner = (row) => {
  ElMessageBox.confirm('确定要删除该轮播图吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    try {
      await deleteBanner(row.id)
      ElMessage.success('删除成功')
      getBannersList()
    } catch (error) {
      console.error('删除失败:', error)
    }
  }).catch(() => {})
}

const showAddPromoDialog = () => {
  Object.assign(promoForm, {
    id: null,
    course_id: null,
    title: '',
    description: '',
    original_price: 0,
    promotional_price: 0,
    start_date: '',
    end_date: '',
    status: 'active'
  })
  promoDialogVisible.value = true
}

const showEditPromoDialog = (row) => {
  Object.assign(promoForm, {
    id: row.id,
    course_id: row.course_id,
    title: row.title,
    description: row.description,
    original_price: row.original_price,
    promotional_price: row.promotional_price,
    start_date: row.start_date,
    end_date: row.end_date,
    status: row.status
  })
  promoDialogVisible.value = true
}

const handlePromoDialogClose = () => {
  promoFormRef.value?.resetFields()
}

const handlePromoSubmit = async () => {
  try {
    await promoFormRef.value.validate()
    if (promoForm.id) {
      await updatePromotionalCourse(promoForm.id, promoForm)
      ElMessage.success('更新成功')
    } else {
      await createPromotionalCourse(promoForm)
      ElMessage.success('创建成功')
    }
    promoDialogVisible.value = false
    getPromosList()
  } catch (error) {
    console.error('提交失败:', error)
  }
}

const handleDeletePromo = (row) => {
  ElMessageBox.confirm('确定要删除该优惠课程吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    try {
      await deletePromotionalCourse(row.id)
      ElMessage.success('删除成功')
      getPromosList()
    } catch (error) {
      console.error('删除失败:', error)
    }
  }).catch(() => {})
}

onMounted(() => {
  getBannersList()
  getPromosList()
  getCoursesList()
})
</script>

<style scoped lang="scss">
.content-list {
  @extend .app-container;
}
</style>
