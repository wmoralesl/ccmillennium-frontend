<template>
  <div v-if="course">
    <!-- Contenedor con estilo aplicado a la imagen de portada -->
    <div class="custom-cover">
      <img :src="course.photo" alt="example" />
    </div>

    <!-- Información del curso -->
    <div class="course-details">
      <h1>{{ course.name }}

        <router-link :to="{ name: 'CourseEdit', params: { id: course.id } }">
          <span>
            <EditOutlined />
          </span>
        </router-link>
      </h1> 
    </div>

    <!-- Módulos del curso -->
    
    
    
    <a-tabs v-model:activeKey="activeKey" type="card">
      <a-tab-pane key="1" tab="General">
        <h3>Informacion General del Curso</h3>

        <!-- Mostrar tarifas y pagos -->
        <div class="payment-info">
    <div class="payment-item">
      <span class="label">Tarifa de inscripción:</span>
      <span class="value">{{ course.enrollment_fee ? `Q${course.enrollment_fee}` : 'N/A' }}</span>
    </div>
    <div class="payment-item">
      <span class="label">Tarifa mensual:</span>
      <span class="value">{{ course.monthly_fee ? `Q${course.monthly_fee}` : 'N/A' }}</span>
    </div>
    <div class="payment-item">
      <span class="label">Número de pagos mensuales:</span>
      <span class="value">{{ course.total_payments || 'N/A' }}</span>
    </div>
    <div class="payment-item">
      <span class="label">Grupos:</span>
      <span class="value">{{ course.group_count || 'N/A' }}</span>
    </div>
  </div>
      </a-tab-pane>


      <a-tab-pane key="2" tab="Modulos">
        <CourseModules :courseId="course.id" />
        
      </a-tab-pane>
  
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


/* Payment Styles */
.payment-info {
  display: grid;
  gap: 12px;
  padding: 16px;
  border-radius: 8px;
  max-width: 800px;
  margin: auto;
}

.payment-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid #e0e0e0;
}

.payment-item:last-child {
  border-bottom: none;
}

.label {
  font-size: 16px;
  color: #888;
  font-weight: 500;
}

.value {
  font-size: 20px;
  font-weight: 600;
  color: #333;
}

.highlight {
  font-size: 20px;       /* Tamaño más grande para resaltar */
  color: #007acc;        /* Color diferenciado */
  font-weight: 700;      /* Peso de fuente extra para destacar */
}

</style>
