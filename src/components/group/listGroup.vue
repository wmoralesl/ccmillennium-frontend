<template>
  <a-page-header
    title="Listado de Grupos"
    @back="() => $router.go(-1)"
  >
    <template #extra>
      <router-link to="/grupos/create">
        <a-button size="large">
          Crear Grupo
          <PlusOutlined />
        </a-button>
      </router-link>
    </template>
  </a-page-header>

  <!-- Input para búsqueda -->
  <a-input
    placeholder="Buscar por nombre de grupo"
    v-model:value="searchQuery"
    style="margin-bottom: 16px; width: 100%;"
    allow-clear
  />

  <a-table 
    :columns="columns" 
    :dataSource="filteredGrupos" 
    rowKey="id" 
    :pagination="paginationConfig"
  >
    <!-- Plantilla personalizada para las acciones -->
    <template #bodyCell="{ column, record }">
      <template v-if="column.key === 'action'">
        <a @click="viewDetails(record.id)" style="margin-right: 8px;">Ver Detalles</a>
      </template>
    </template>
  </a-table>
</template>

<script lang="ts" setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import apiClient from '@/api';  // Importa el cliente Axios
import { PlusOutlined } from '@ant-design/icons-vue';

const grupos = ref<any[]>([]);
const searchQuery = ref(''); // Variable para la búsqueda
const router = useRouter();
const paginationConfig = ref({
  pageSize: 10,
});

// Definir las columnas de la tabla
const columns = [
  {
    title: '#',
    dataIndex: 'id',
    key: 'id',
  },
  {
    title: 'Nombre',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: 'Año',
    dataIndex: 'year',
    key: 'year',
  },
  {
    title: 'Horario',
    dataIndex: 'schedule',
    key: 'schedule',
  },
  {
    title: 'Horas',
    dataIndex: 'hours_count',
    key: 'hours_count',
  },
  {
    title: 'Curso',
    dataIndex: 'course_name',
    key: 'course',
  },
  {
    title: 'Acciones',
    key: 'action',
  },
];

// Función para obtener los grupos
const fetchGrupos = async () => {
  try {
    const response = await apiClient.get('/groups/');
    grupos.value = response.data;
  } catch (error) {
    console.error('Error al cargar grupos', error);
  }
};

// Función para ver detalles de un grupo
const viewDetails = (id: number) => {
  router.push(`/grupos/${id}`);
};

// Computed property para filtrar los grupos
const filteredGrupos = computed(() => {
  if (!searchQuery.value) {
    return grupos.value; // Si no hay búsqueda, devolver todos los grupos
  }
  
  const lowerCaseQuery = searchQuery.value.toLowerCase();
  return grupos.value.filter(grupo => 
    grupo.name.toLowerCase().includes(lowerCaseQuery) // Filtrar por nombre
  );
});

// Cargar los grupos al montar el componente
onMounted(fetchGrupos);
</script>
