<template>
  <div v-if="payment">
    <a-card title="Detalles del Pago" bordered>
      <a-row :gutter="[16, 16]">
        <a-col :span="12">
          <a-statistic title="Boleta de pago No." :value="payment.id" />
        </a-col>
        <a-col :span="12">
          <a-statistic title="Curso" :value="payment.course_name" />
        </a-col>
        <a-col :span="12">
          <a-statistic title="Nombre del Estudiante" :value="payment.student_name" />
        </a-col>
        <a-col :span="12">
          <a-statistic title="Fecha de Pago" :value="formattedPaymentDate" />
        </a-col>
        <a-col :span="12">
          <a-statistic title="Mes Pagado" :value="monthPaidName" />
        </a-col>
        <a-col :span="12">
          <a-statistic title="Monto" :value="formattedAmount" />
        </a-col>
        <a-col :span="24">
          <p><strong>Descripción:</strong> {{ payment.description }}</p>
        </a-col>
      </a-row>

      <div style="margin-top: 24px; text-align: center;">
        <router-link to="/pagos">
          <a-button type="default">← Regresar al listado</a-button>
        </router-link>
        <a-button @click="downloadPDF(payment.id)" type="primary" style="margin-left: 8px;">
          Descargar Comprobante
          <DownloadOutlined />
        </a-button>
      </div>
    </a-card>
  </div>

  <div v-else-if="isLoading">
    <a-spin>
      <p>Cargando detalles del pago...</p>
    </a-spin>
  </div>

  <div v-else>
    <a-alert message="No se encontraron detalles para el pago con ID {{ paymentId }}" type="error" show-icon />
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import apiClient from '@/api';
import { DownloadOutlined } from '@ant-design/icons-vue';

const payment = ref<any>(null);
const isLoading = ref(true);

const route = useRoute();
const id = Number(route.params.id);

const monthNames = [
  '', 'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

const monthPaidName = computed(() => {
  if (payment.value && payment.value.month_paid) {
    return monthNames[payment.value.month_paid] || 'Mes desconocido';
  }
  return '';
});

const formattedPaymentDate = computed(() => {
  if (payment.value) {
    const date = new Date(payment.value.payment_date);
    return date.toLocaleDateString();
  }
  return '';
});

const formattedAmount = computed(() => {
  if (payment.value) {
    return new Intl.NumberFormat('es-GT', { style: 'currency', currency: 'GTQ' }).format(payment.value.amount);
  }
  return '';
});

const fetchPaymentDetails = async (id: number) => {
  try {
    const response = await apiClient.get(`/payments/${id}`);
    payment.value = response.data;
    isLoading.value = false;
  } catch (error) {
    console.error('Error al cargar los detalles del pago:', error);
    isLoading.value = false;
  }
};

const downloadPDF = async (id: number) => {
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

onMounted(() => {
  if (!isNaN(id)) {
    fetchPaymentDetails(id);
  } else {
    console.error('ID de pago no válido:', route.params.id);
    isLoading.value = false;
  }
});
</script>
