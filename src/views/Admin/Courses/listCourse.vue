<template>
  <a-page-header
    title="Listado de Cursos"
    @back="() => $router.go(-1)"
  >
    <template #extra>
      <router-link to="/courses/create">
        <a-button size="large">
          Crear Curso
          <PlusOutlined />
        </a-button>
      </router-link>
    </template>
  </a-page-header>
  
  
  <!-- Input para búsqueda usando Ant Design Vue -->
  <a-input
    placeholder="Buscar por nombre de curso"
    v-model:value="searchQuery"
    style="margin-bottom: 16px;"
    allow-clear
    size='middle'
  />
  
  <a-table
    :columns="columns"
    :data-source="filteredCourses" 
    rowKey="id"
    :pagination="paginationConfig"
  >
    <!-- Plantilla personalizada para las acciones -->
    <template #bodyCell="{ column, record }">
      <template v-if="column.key === 'action'">
        <a @click="viewCourse(record.id)" style="color: #1890ff; cursor: pointer;">Ver</a>
      </template>
    </template>
  </a-table>
</template>

<script lang="ts" setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import apiClient from '@/api'; // Importa apiClient
import { PlusOutlined } from '@ant-design/icons-vue';

const courses = ref([]);
const searchQuery = ref(''); // Variable para la búsqueda
const paginationConfig = ref({
  pageSize: 10,
});
const router = useRouter();

// Fetch courses using apiClient
const fetchCourses = async () => {
  try {
    const response = await apiClient.get('/courses/');
    courses.value = response.data;
  } catch (error) {
    console.error('Error fetching courses:', error);
  }
};

// View course details
const viewCourse = (id: number) => {
  router.push({ name: 'CourseDetail', params: { id } });
};

// Configuración de columnas de la tabla
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
    title: 'Conteo de Grupos',
    dataIndex: 'group_count',
    key: 'group_count',
  },
  {
    title: 'Acciones',
    key: 'action',
  },
];

// Computed property para filtrar los cursos
const filteredCourses = computed(() => {
  if (!searchQuery.value) {
    return courses.value; // Si no hay búsqueda, devolver todos los cursos
  }
  
  const lowerCaseQuery = searchQuery.value.toLowerCase();
  return courses.value.filter(course => 
    course.name.toLowerCase().includes(lowerCaseQuery) // Filtrar por nombre
  );
});

// Cargar los cursos al montar el componente
onMounted(fetchCourses);
</script>
