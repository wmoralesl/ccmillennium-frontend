<template>
  <a-card v-if="user" class="user-card" :title="`Usuario: ${user.first_name} ${user.last_name}`" bordered hoverable>
    <a-row :gutter="16">
      <a-col span="8">
        <a-image :width="150" :src="user.photo" shape="circle" size="large" alt="profile_photo"/>
        <!-- <a-avatar
            :size="100 "
            style="color: #f56a00; background-color: #fde3cf; margin-right: 16px;"
          >
            U
          </a-avatar> -->
      </a-col>
      <a-col span="16">
        <p><strong>ID:</strong> {{ user.id }}</p>
        <p><strong>Nombre:</strong> {{ user.first_name }} {{ user.last_name }} {{ user.second_last_name }}</p>
        <p><strong>Correo:</strong> {{ user.email }}</p>
        <p><strong>Rol:</strong> <a-tag color="blue">{{ user.role }}</a-tag></p>
        <p><strong>Género:</strong> {{ formatGender(user.gender) }}</p>
        <p><strong>Teléfono:</strong> {{ user.phone || 'No disponible' }}</p>
      </a-col>
    </a-row>

    <a-divider />

    <a-row>
      <a-col span="12">
        <p><strong>Registrado:</strong> {{ formatDate(user.date_joined) }}</p>
        <p><strong>Último Acceso:</strong> {{ formatDate(user.last_login) }}</p>
      </a-col>
      <a-col span="12">
        <p><strong>Dirección:</strong> {{ user.address || 'No disponible' }}</p>
        <p><strong>DPI:</strong> {{ user.dpi || 'No disponible' }}</p>
      </a-col>
    </a-row>

    <a-divider />

    <div class="actions" v-if="Myuser && Myuser.role === 'admin'">
  <a-button @click="goBack" shape="round" type="default">Volver</a-button>
  <a-button @click="editUser(user.id)" shape="round" type="primary">Editar</a-button>
  <a-button @click="confirmDeleteUser(user.id)" :loading="loading" shape="round" type="danger">Eliminar</a-button>
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
  margin: auto;
  border-radius: 10px;
}

.actions {
  display: flex;
  justify-content: space-between;
}

a-avatar {
  display: block;
  margin: 0 auto;
}
</style>
