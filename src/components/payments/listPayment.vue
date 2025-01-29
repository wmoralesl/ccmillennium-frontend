<template>
  <a-page-header
    title="Listado de Pagos"
    @back="() => $router.go(-1)"
  >
    <template #extra>
      <router-link to="/pagos/create">
        <a-button size="large">
          Crear Pago
          <PlusOutlined />
        </a-button>
      </router-link>
    </template>
  </a-page-header>

  <!-- Input para filtrar por nombre de curso -->
  <a-input
    placeholder="Buscar por estudiante"
    v-model:value="searchQuery"
    style="margin-bottom: 16px; width: 100%;"
    allow-clear
  />

  <a-table :columns="columns" :dataSource="filteredPagos" rowKey="id" :pagination="paginationConfig">
    <template #bodyCell="{ column, record }">
      <template v-if="column.key === 'action'">
        <a @click="viewDetails(record.id)">Ver Detalles</a>
      </template>
    </template>
  </a-table>
</template>

<script lang="ts" setup>
import dayjs from 'dayjs';
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import apiClient from '@/api';
import { PlusOutlined } from '@ant-design/icons-vue';

const pagos = ref<any[]>([]);
const searchQuery = ref('');
const router = useRouter();
const paginationConfig = ref({
  pageSize: 10,
});

// Lista de meses en español
const mesesEspanol = [
  '', 'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

// Definir las columnas de la tabla
const columns = [
  {
    title: 'Fecha de Pago',
    dataIndex: 'payment_date',
    key: 'payment_date',
    customRender: ({ text }: { text: string }) => {
      return dayjs(text).format('DD-MM-YYYY HH:mm:ss');
    },
  },
  {
    title: 'Estudiante',
    dataIndex: 'student_name',
    key: 'student_name',
  },
  {
    title: 'Curso',
    dataIndex: 'course_name',
    key: 'course_name',
  },
  {
    title: 'Mes Pagado',
    dataIndex: 'month_paid',
    key: 'month_paid',
    customRender: ({ text }: { text: number }) => {
      // Usar la lista de meses en español para convertir el número al nombre
      return mesesEspanol[text];
    },
  },
  {
    title: 'Monto',
    dataIndex: 'amount',
    key: 'amount',
  },
  {
    title: 'Descripción',
    dataIndex: 'description',
    key: 'description',
  },
  {
    title: 'Acciones',
    key: 'action',
  },
];

// Función para obtener la lista de pagos
const fetchPayments = async () => {
  try {
    const response = await apiClient.get('/payments/');

    pagos.value = response.data.sort((a: any, b: any) => {
      const dateA = new Date(a.payment_date).getTime();
      const dateB = new Date(b.payment_date).getTime();
      return dateB - dateA;
    });
  } catch (error) {
    console.error('Error al cargar pagos', error);
  }
};

// Computed property para filtrar los pagos por nombre de curso
const filteredPagos = computed(() => {
  if (!searchQuery.value) {
    return pagos.value;
  }

  const lowerCaseQuery = searchQuery.value.toLowerCase();
  return pagos.value.filter(pago =>
    pago.student_name.toLowerCase().includes(lowerCaseQuery)
  );
});

// Función para ver los detalles de un pago
const viewDetails = (id: any) => {
  console.log('ID del pago al ver detalles:', id);
  router.push({ name: 'viewPayment', params: { id } });
};

onMounted(fetchPayments);
</script>

<style scoped>
/* Añade estilos si es necesario */
</style>
