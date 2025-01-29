<template>
  <div>
    <h2>Mis Pagos</h2>
    <a-table :columns="columns" :dataSource="payments" rowKey="id">
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'action'">
          <a @click="downloadPDF(record.id)">Descargar Pago</a>
        </template>
      </template>
    </a-table>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, computed } from 'vue';
import apiClient from '@/api';
import { useStore } from 'vuex';
import dayjs from 'dayjs';
import { useRouter } from 'vue-router';

const store = useStore();
const router = useRouter();

const userId = computed(() => store.getters.getUser?.id);
const payments = ref<any[]>([]);

// Definir las columnas de la tabla
const columns = [
  {
    title: 'ID',
    dataIndex: 'id',
    key: 'id',
  },
  {
    title: 'Fecha de Pago',
    dataIndex: 'payment_date',
    key: 'payment_date',
    customRender: ({ text }: { text: string }) => {
      return dayjs(text).format('DD-MM-YYYY HH:mm:ss');
    },
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
    const response = await apiClient.get(`/payments/?enrollment__student=${userId.value}`);

    // Ordenar los pagos por fecha de pago (de más reciente a más antiguo)
    payments.value = response.data.sort((a, b) => new Date(b.payment_date) - new Date(a.payment_date));
  } catch (error) {
    console.error('Error fetching payments:', error);
  }
};

// // Función para ver los detalles de un pago
// const viewDetails = (id: any) => {
//   console.log('ID del pago al ver detalles:', id); // Añade este log
//   router.push({ name: 'viewPayment', params: { id } });
// };

const downloadPDF = async (id) => {
  try {
    const response = await apiClient.get(`/generate-pdf/${id}/`, {
      responseType: 'blob',
    });

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `payment_${id}.pdf`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error al descargar el PDF:', error);
  }
};

// Cargar pagos al montar el componente
onMounted(fetchPayments);
</script>

<style scoped>
/* Añade estilos si es necesario */
</style>
