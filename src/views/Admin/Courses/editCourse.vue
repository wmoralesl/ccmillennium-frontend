<template>
  <div>
    <h1>Editar Curso</h1>
    <a-upload
      :custom-request="handleFileUpload"
      :show-upload-list="false"
      :before-upload="handleBeforeUpload"
    >
      <img v-if="course.photo" :src="course.photo" alt="Foto del curso" class="course-photo" />
      <div v-else class="upload-placeholder">
        <loading-outlined v-if="loading"></loading-outlined>
        <plus-outlined v-else></plus-outlined>
        <div class="ant-upload-text">Subir Imagen</div>
      </div>
    </a-upload>

    <form @submit.prevent="submitForm">
      <div>
        <label for="name">Nombre:</label>
        <input v-model="course.name" id="name" required />
      </div>

      <div>
        <label for="monthly_fee">Tarifa mensual:</label>
        <input v-model="course.monthly_fee" id="monthly_fee" type="number" step="0.01" min="0" />
      </div>

      <div>
        <label for="total_payments">Número de pagos mensuales:</label>
        <input v-model="course.total_payments" id="total_payments" type="number" min="0" />
      </div>

      <div>
        <label for="enrollment_fee">Tarifa de inscripción:</label>
        <input v-model="course.enrollment_fee" id="enrollment_fee" type="number" step="0.01" min="0" />
      </div>

      <div>
        <label for="is_visible">Visible:</label>
        <input v-model="course.is_visible" id="is_visible" type="checkbox" />
      </div>

      <div>
        <label for="is_active">Activo:</label>
        <input v-model="course.is_active" id="is_active" type="checkbox" />
      </div>

      <div class="button-group">
        <a-button @click="goBack" shape="round" style="margin-top: 20px;">Volver</a-button>
        <a-button type="primary" shape="round" html-type="submit" :loading="loading" style="margin-top: 20px;">
          Guardar Cambios
        </a-button>
      </div>
    </form>
  </div>
</template>

<script lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import apiClient from '@/api';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons-vue';

export default {
  components: {
    LoadingOutlined,
    PlusOutlined,
  },
  setup() {
    const course = ref({
      name: '',
      photo: null,
      monthly_fee: null,
      total_payments: null,
      enrollment_fee: null,
      is_visible: false,
      is_active: false,
    });

    const route = useRoute();
    const router = useRouter();
    const courseId = route.params.id;
    const selectedFile = ref<File | null>(null);
    const loading = ref(false);

    const goBack = () => {
      router.push(`/courses/${courseId}/`);
    };

    const handleFileUpload = ({ file }: { file: File }) => {
      selectedFile.value = file;
    };

    const handleBeforeUpload = (file: File) => {
      selectedFile.value = file;
      return false; // Evitar la carga automática
    };

    const fetchCourse = async () => {
      try {
        loading.value = true;
        const response = await apiClient.get(`/courses/${courseId}/`);
        course.value = response.data;
      } catch (error) {
        console.error('Error al cargar los detalles del curso', error);
      } finally {
        loading.value = false;
      }
    };

    const submitForm = async () => {
      try {
        loading.value = true;
        const formData = new FormData();
        formData.append('name', course.value.name);
        formData.append('monthly_fee', course.value.monthly_fee || '0');
        formData.append('total_payments', course.value.total_payments || '0');
        formData.append('enrollment_fee', course.value.enrollment_fee || '0');
        formData.append('is_visible', course.value.is_visible.toString());
        formData.append('is_active', course.value.is_active.toString());

        if (selectedFile.value) {
          formData.append('photo', selectedFile.value);
        }

        const response = await apiClient.patch(`/courses/${courseId}/`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        if (response.status === 200) {
          router.push(`/courses/${courseId}/`);
        } else {
          console.error('Error al actualizar el curso', response);
        }
      } catch (error) {
        console.error('Error al actualizar el curso', error);
      } finally {
        loading.value = false;
      }
    };

    onMounted(fetchCourse);

    return {
      course,
      submitForm,
      handleFileUpload,
      goBack,
      handleBeforeUpload,
      loading,
    };
  },
};
</script>

<style scoped>
.course-photo {
  width: 100%;
  max-height: 200px;
  object-fit: cover;
  margin-bottom: 10px;
}

.upload-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 200px;
  border: 1px dashed #d9d9d9;
  border-radius: 4px;
}

.button-group {
  display: flex;
  gap: 10px;
  margin-top: 20px;
}
</style>
