<template>
  <a-card v-if="user" class="user-card" :title="`${user.first_name || 'No disponible'} ${user.last_name || ''}`" >
    <a-row :gutter="24">
      <a-col span="8" class="user-image">
        <a-image :width="150" :src="user.photo" shape="circle" size="large" alt="profile_photo" />
      </a-col>
      <a-col span="16">
        <p><strong>Usuario:</strong> {{ user.username }}</p>
        <p><strong>Correo:</strong> {{ formatValue(user.email) }}</p>
        <p><strong>Rol:</strong> <a-tag color="blue">{{ user.role || 'No disponible' }}</a-tag></p>
        <p><strong>Género:</strong> {{ formatGender(user.gender) }}</p>
        <p><strong>Teléfono:</strong> {{ formatValue(user.phone) }}</p>
      </a-col>
    </a-row>

    <a-divider />

    <a-row>
      <a-col span="12">
        <p><strong>Registrado:</strong> {{ formatDate(user.date_joined) }}</p>
        <p><strong>Último Acceso:</strong> {{ formatDate(user.last_login) }}</p>
      </a-col>
      <a-col span="12">
        <p><strong>Dirección:</strong> {{ formatValue(user.address) }}</p>
        <p><strong>DPI:</strong> {{ formatValue(user.dpi) }}</p>
      </a-col>
    </a-row>

    <a-divider />

    <div class="actions" v-if="Myuser && Myuser.role === 'admin'">
      <a-button @click="goBack"  type="default">Volver</a-button>
      <a-button @click="editUser(user.id)"  type="primary">Editar</a-button>
      <a-button @click="confirmDeleteUser(user.id)" :loading="loading" type="text" danger>Eliminar</a-button>
    </div>
  </a-card>

  <a-spin v-else />
</template>

<script lang="ts" setup>
/* eslint-disable */
import { ref, onMounted } from 'vue';
import { useStore } from 'vuex';

import { message, Modal } from 'ant-design-vue';
import apiClient from '@/api';
import router from '@/router';
const store = useStore();

// Definir la prop 'userId' usando defineProps
const props = defineProps<{
  id: String;  // Asegúrate que el nombre coincide con el parámetro de la ruta
}>();
const Myuser = store.getters.getUser; 
const user = ref(null);
const loading = ref(false);

// Accede a la prop userId directamente
const fetchUserDetails = async () => {
  try {
    loading.value = true;
    const response = await apiClient.get(`/users/${props.id}/`);
    user.value = response.data;
  } catch (error) {
    message.error('Error al cargar los detalles del usuario');
    console.error(error);
  } finally {
    loading.value = false;
  }
};

const formatValue = (value) => {
  return value ? value : 'No disponible';
};

const confirmDeleteUser = (id) => {
  Modal.confirm({
    title: '¿Estás seguro de eliminar este usuario?',
    content: 'Esta acción no se puede deshacer',
    onOk() {
      deleteUser(id);
    },
    onCancel() {
      message.info('Eliminación cancelada');
    },
  });
};

const deleteUser = async (id) => {
  try {
    loading.value = true;
    const response = await apiClient.delete(`/users/${id}/`);
    if (response.status === 204) {
      message.success('Usuario eliminado correctamente');
      router.push('/users');
    } else {
      throw new Error('Error al eliminar el usuario');
    }
  } catch (error) {
    message.error('Error al eliminar el usuario');
    console.error(error);
  } finally {
    loading.value = false;
  }
};

const editUser = (id) => {
  router.push(`/edit-user/${id}`);
};

const goBack = () => {
  router.push('/users');
};

const formatDate = (dateString) => {
  if (!dateString) return 'No disponible';
  const date = new Date(dateString);
  return date.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

const formatGender = (gender) => {
  const genders = {
    male: 'Masculino',
    female: 'Femenino',
    none: 'No especificado',
  };
  return genders[gender] || 'No especificado';
};

onMounted(fetchUserDetails);
</script>

<style scoped>
.user-card {
  max-width: 600px;
  margin: 20px auto; /* Espaciado alrededor del componente */
  border-radius: 10px;
}

.user-image {
  display: flex;
  justify-content: center;
  align-items: center;
}

.actions {
  display: flex;
  justify-content: space-between;
  margin-top: 16px; /* Espaciado superior para separación */
}

p {
  margin: 8px 0; /* Espaciado vertical entre párrafos */
}

strong {
  color: #555; /* Color para el texto fuerte */
}

/* Estilos para botones */
a-button {
  transition: background-color 0.3s, color 0.3s; /* Transición suave para hover */
}

a-button:hover {
  background-color: #0056b3; /* Cambia el color de fondo al hacer hover */
  color: white; /* Cambia el color del texto al hacer hover */
}
</style>