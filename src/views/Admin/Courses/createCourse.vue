<template>
  <div class="container">
    <h1>Crear Curso</h1>
    <form @submit.prevent="createCourse">
      <div class="form-group">
        <label for="name">Nombre:</label>
        <input type="text" v-model="course.name" required />
      </div>

      <div class="form-group">
        <label for="monthly_fee">Tarifa mensual:</label>
        <input type="number" v-model="course.monthly_fee" step="0.01" min="0" />
      </div>

      <div class="form-group">
        <label for="total_payments">Número de pagos mensuales:</label>
        <input type="number" v-model="course.total_payments" min="0" />
      </div>

      <div class="form-group">
        <label for="enrollment_fee">Tarifa de inscripción:</label>
        <input type="number" v-model="course.enrollment_fee" step="0.01" min="0" />
      </div>

      <div class="form-group">
        <label for="photo">Foto del curso:</label>
        <input type="file" @change="onPhotoChange" />
      </div>

      <button type="submit" :disabled="!course.name">Crear</button>
    </form>
  </div>
</template>

<script lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import apiClient from '@/api';

export default {
  name: 'CourseCreate',
  setup() {
    const course = ref({
      name: '',
      monthly_fee: null,
      total_payments: null,
      enrollment_fee: null,
      is_visible: true,
      is_active: true,
      photo: null as File | null,
    });

    const router = useRouter();

    const onPhotoChange = (event: Event) => {
      const target = event.target as HTMLInputElement;
      const files = target.files;
      if (files && files[0]) {
        course.value.photo = files[0];
      }
    };

    const createCourse = async () => {
      try {
        const formData = new FormData();
        for (const key in course.value) {
          const value = course.value[key as keyof typeof course.value];
          if (value !== null) {
            formData.append(key, value as string | Blob);
          }
        }
        await apiClient.post('/courses/', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        router.push('/courses');
      } catch (error) {
        console.error('Error al crear el curso:', error);
      }
    };

    return {
      course,
      createCourse,
      onPhotoChange
    };
  },
};
</script>


<style scoped>
.container {
  width: 600px;
  margin: 0 auto;
}
h1 {
  font-size: 24px;
  margin-bottom: 20px;
  color: #333;
}
.form-group {
  margin-bottom: 16px;
}
label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: #555;
}
input[type="text"],
input[type="number"],
input[type="file"],
textarea,
select {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 16px;
  transition: border-color 0.3s;
}
input:focus {
  border-color: #007bff;
  outline: none;
}
button[type="submit"] {
  padding: 10px 15px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s;
}
button[type="submit"]:hover {
  background-color: #0056b3;
}
</style>
