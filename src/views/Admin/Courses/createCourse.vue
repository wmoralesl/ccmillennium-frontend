<template>
  <div>
    <h1>Crear Curso</h1>
    <form @submit.prevent="createCourse">
      <div>
        <label for="name">Nombre:</label>
        <input type="text" v-model="course.name" required />
      </div>

      <div>
        <label for="monthly_fee">Tarifa mensual:</label>
        <input type="number" v-model="course.monthly_fee" step="0.01" min="0" />
      </div>

      <div>
        <label for="total_payments">Número de pagos mensuales:</label>
        <input type="number" v-model="course.total_payments" min="0" />
      </div>

      <div>
        <label for="enrollment_fee">Tarifa de inscripción:</label>
        <input type="number" v-model="course.enrollment_fee" step="0.01" min="0" />
      </div>

      <div>
        <label for="is_visible">Visible:</label>
        <input type="checkbox" v-model="course.is_visible" />
      </div>

      <div>
        <label for="is_active">Activo:</label>
        <input type="checkbox" v-model="course.is_active" />
      </div>

      <button type="submit">Crear</button>
    </form>
  </div>
</template>

<script lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import apiClient from '@/api'; // Utiliza tu apiClient configurado con axios

export default {
  name: 'CourseCreate',
  setup() {
    const course = ref({
      name: '',
      monthly_fee: null,
      total_payments: null,
      enrollment_fee: null,
      is_visible: false,
      is_active: false,
    });

    const router = useRouter();

    const createCourse = async () => {
      try {
        await apiClient.post('/courses/', course.value);
        router.push('/courses');
      } catch (error) {
        console.error('Error al crear el curso:', error);
      }
    };

    return {
      course,
      createCourse,
    };
  },
};
</script>
