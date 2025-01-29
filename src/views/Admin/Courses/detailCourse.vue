<template>
  <div v-if="course">
    <!-- Contenedor con estilo aplicado a la imagen de portada -->
    <div class="custom-cover">
      <img :src="course.photo" alt="example" />
    </div>

    <!-- Información del curso -->
    <div class="course-details">
      <h2>{{ course.name }}

        <router-link :to="{ name: 'CourseEdit', params: { id: course.id } }">
          <span>
            <EditOutlined />
          </span>
        </router-link>
      </h2> 
    </div>

    <!-- Módulos del curso -->
    
    
    
    <a-tabs v-model:activeKey="activeKey" type="card">
      <a-tab-pane key="1" tab="General">
        <!-- Mostrar tarifas y pagos -->
      <div class="payment-info">
        <p>Tarifa de inscripción: {{ course.enrollment_fee || 'N/A' }}</p>
        <p>Tarifa mensual: {{ course.monthly_fee || 'N/A' }}</p>
        <p>Número de pagos mensuales: {{ course.total_payments || 'N/A' }}</p>
      </div>
      </a-tab-pane>
      <a-tab-pane key="2" tab="Modulos">
        <CourseModules :courseId="course.id" />
        
      </a-tab-pane>
    <a-tab-pane key="3" tab="Tab 3">Content of Tab Pane 3</a-tab-pane>
  </a-tabs>
  
</div>



</template>

<script lang="ts">
/* eslint-disable */
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import CourseModules from '@/components/module/listModule.vue';
import apiClient from '@/api';
const activeKey = ref('1');
import { EditOutlined } from '@ant-design/icons-vue'

export default {
  name: 'CourseDetail',
  components: {
    CourseModules,
    EditOutlined
  },
  setup() {
    const course = ref<any>(null);
    const route = useRoute();

    onMounted(async () => {
      try {
        const response = await apiClient.get(`/courses/${route.params.id}/`);
        course.value = response.data;
      } catch (error) {
        console.error('Error fetching course details:', error);
      }
    });

    return {
      course,
      activeKey,
      EditOutlined,
    };
  },
};
</script>

<style scoped>
.custom-cover {
  width: 100%;
  height: 150px;
  overflow: hidden;
}

.custom-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.course-details {
  margin-top: 20px;
}

.course-details h1 {
  font-size: 24px;
  margin-bottom: 10px;
}

.course-details p {
  margin: 5px 0;
}

.payment-info p {
  font-size: 16px;
  margin: 10px 0;
}

</style>
