<template>
  <div>
    <h1>Editar Usuario</h1>
    <a-upload
    
      :custom-request="handleFileUpload"
      :show-upload-list="false"
      :before-upload="handleBeforeUpload"
    >
      <!-- <img :src="user.photo" alt="user photo" style="width: 100px; height: 100px; object-fit: cover;"/> -->
      <img v-if="user.photo" :src="user.photo" alt="avatar" />
      <div v-else>
      <loading-outlined v-if="loading"></loading-outlined>
      <plus-outlined v-else></plus-outlined>
      <div class="ant-upload-text">Upload</div>
    </div>
      <!-- <a-button>Seleccionar Foto</a-button> -->
    </a-upload>

    <a-form @submit.prevent="submitForm" layout="vertical">
      <div>
        <label for="first_name">Nombre:</label>
        <input v-model="user.first_name" id="first_name" required />
      </div>
      <div>
        <label for="last_name">Primer Apellido:</label>
        <input v-model="user.last_name" id="last_name" required />
      </div>
      <div>
        <label for="second_last_name">Segundo Apellido:</label>
        <input v-model="user.second_last_name" id="second_last_name" required />
      </div>
      <div>
        <label for="email">Correo Electrónico:</label>
        <input v-model="user.email" id="email" type="email" required />
      </div>
      <div>
        <label for="username">Nombre de Usuario:</label>
        <input v-model="user.username" id="username" required />
      </div>
      <div>
        <label for="birthdate">Fecha de Nacimiento:</label>
        <input v-model="user.birthdate" id="birthdate" type="date" required />
      </div>
      <div>
        <label for="dpi">DPI:</label>
        <input v-model="user.dpi" id="dpi" />
      </div>
      <div>
        <label for="phone">Teléfono:</label>
        <input v-model="user.phone" id="phone" />
      </div>
      <div>
        <label for="address">Dirección:</label>
        <input v-model="user.address" id="address" />
      </div>

      <div>
        <label for="role">Rol:</label>
        <select v-model="user.role" id="role" required>
          <option value="student">Estudiante</option>
          <option value="teacher">Maestro</option>
          <option value="admin">Administrador</option>
        </select>
      </div>
      <div>
        <label for="is_active">Activo:</label>
        <input v-model="user.is_active" id="is_active" type="checkbox" />
      </div>
      <a-form-item>
        <a-button @click="goBack" shape="round" style="margin-top: 20px;">Volver</a-button>
        <a-button type="primary" shape="round" html-type="submit">Guardar Cambios</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import apiClient from '@/api';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons-vue'; // Asegúrate de importar los íconos

export default {
  components: {
    LoadingOutlined,
    PlusOutlined,
  },
  setup() {
    const user = ref({
      first_name: '',
      last_name: '',
      second_last_name: '',
      email: '',
      username: '',
      birthdate: '',
      dpi: '',
      phone: '',
      address: '',
      photo: '',
      role: '',
      is_active: false
    });

    const router = useRouter();
    const route = useRoute();
    const userId = route.params.id;
    const selectedFile = ref<File | null>(null);
    const loading = ref(false); // Definir el estado loading

    const goBack = () => {
      router.push(`/view-user/${userId}/`);
    };

    const handleFileUpload = ({ file }: { file: File }) => {
      selectedFile.value = file;
      loading.value = true; // Activar el estado loading mientras se carga el archivo

      // Simulación de carga (puedes reemplazar esto con tu lógica de subida real)
      setTimeout(() => {
        loading.value = false; // Desactivar el estado loading cuando la carga termine
      }, 2000);
    };

    const handleBeforeUpload = (file: File) => {
      selectedFile.value = file;
      return false; // Prevent automatic upload
    };

    const fetchUser = async () => {
      try {
        const response = await apiClient.get(`/users/${userId}/`);
        user.value = response.data;
      } catch (error) {
        console.error('Error al cargar el usuario', error);
      }
    };

    const submitForm = async () => {
      try {
        const formData = new FormData();
        formData.append('first_name', user.value.first_name);
        formData.append('last_name', user.value.last_name);
        formData.append('second_last_name', user.value.second_last_name);
        formData.append('email', user.value.email);
        formData.append('username', user.value.username);
        formData.append('birthdate', user.value.birthdate);
        formData.append('dpi', user.value.dpi);
        formData.append('phone', user.value.phone);
        formData.append('address', user.value.address);
        formData.append('role', user.value.role);
        formData.append('is_active', user.value.is_active.toString());

        if (selectedFile.value) {
          formData.append('photo', selectedFile.value);
        }

        const response = await apiClient.patch(`/users/${userId}/`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });

        if (response.status === 200) {
          router.push(`/view-user/${userId}/`);
        } else {
          console.error('Error al actualizar el usuario', response);
        }
      } catch (error) {
        console.error('Error al actualizar el usuario', error);
      }
    };

    onMounted(fetchUser);

    return { user, submitForm, handleFileUpload, goBack, handleBeforeUpload, loading };
  },
};

</script>
