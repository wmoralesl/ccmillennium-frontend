<template>
  <a-page-header title="Listado de usuarios" @back="$router.go(-1)">
    <template #extra>
      <router-link to="/create-user">
        <a-button size="large">Crear Usuario<PlusOutlined /></a-button>
      </router-link>

      <router-link to="/asignar">
        <a-button size="large">Asignar Estudiante <UsergroupAddOutlined /> </a-button>
      </router-link>
    </template>
  </a-page-header>
  
  <!-- Input para búsqueda -->
  <a-input
    placeholder="Buscar por nombre de usuario"
    v-model:value="searchQuery"
    style="margin-bottom: 16px; width: 100%;"
    allow-clear
  />

  <a-table :columns="columns" :data-source="filteredData" rowKey="id" :pagination="paginationConfig">
    <template #bodyCell="{ column, record }">
      <template v-if="column.key === 'action'">
        <span>
          <router-link :to="{ name: 'viewUser', params: { id: record.id } }">
            <a>Ver</a>
          </router-link>
        </span>
      </template>
      <template v-else-if="column.key === 'role'">
        <span v-html="getRoleTag(record.role)"></span>
      </template>
    </template>
  </a-table>
</template>

<script lang="ts" setup>
import { ref, onMounted, computed } from 'vue';
import { message } from 'ant-design-vue';
import { PlusOutlined, UsergroupAddOutlined } from '@ant-design/icons-vue';
import apiClient from '@/api';

const users = ref<any[]>([]);
const searchQuery = ref('');
const paginationConfig = ref({
  pageSize: 10,
});

// Definir traducción de roles y colores de etiquetas
const roleLabels = {
  admin: { label: 'Administrador', color: 'red' },
  teacher: { label: 'Maestro', color: 'blue' },
  student: { label: 'Estudiante', color: 'green' },
};

// Función para obtener el HTML del tag del rol
const getRoleTag = (role: string) => {
  const roleData = roleLabels[role];
  if (roleData) {
    return `<a-tag color="${roleData.color}">${roleData.label}</a-tag>`;
  }
  return `<a-tag color="default">${role}</a-tag>`;
};

// Fetch users using apiClient
const fetchUsers = async () => {
  try {
    const response = await apiClient.get('/users/');
    users.value = response.data;
  } catch (error) {
    message.error('Error al cargar los usuarios');
    console.error(error);
  }
};

// Computed property para filtrar usuarios según la búsqueda
const filteredData = computed(() => {
  if (!searchQuery.value) {
    return users.value;
  }

  const lowerCaseQuery = searchQuery.value.toLowerCase();
  return users.value.filter(user =>
    user.first_name.toLowerCase().includes(lowerCaseQuery) ||
    user.last_name.toLowerCase().includes(lowerCaseQuery) ||
    user.second_last_name.toLowerCase().includes(lowerCaseQuery)
  );
});

// Configuración de columnas
const columns = [
  {
    title: '#',
    dataIndex: 'id',
    key: 'id',
  },
  {
    title: 'Apellidos',
    key: 'full_name',
    customRender: ({ record }) => `${record.last_name} ${record.second_last_name}`,
  },
  {
    title: 'Nombre',
    dataIndex: 'first_name',
    key: 'fname',
  },
  {
    title: 'Username',
    dataIndex: 'username',
    key: 'username',
  },
  {
    title: 'Correo Electrónico',
    dataIndex: 'email',
    key: 'email',
  },
  {
    title: 'Rol',
    dataIndex: 'role',
    key: 'role',
  },
  {
    title: 'Acciones',
    key: 'action',
  },
];

onMounted(fetchUsers);
</script>

<style scoped>
/* Añade estilos si es necesario */
</style>
