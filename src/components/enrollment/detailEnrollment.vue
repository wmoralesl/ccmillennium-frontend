<template>
  <div class="assignment-details">

    <div v-if="assignment">
      <a-card title="Detalles del Pago" bordered>

      <a-row :gutter="[16, 16]">
        <a-col :span="12">
          <a-statistic title="Asignacion No." :value="assignment.id" />
        </a-col>
        <a-col :span="12">
    <a-statistic title="Usuario" :value="userprint ? userprint.username  : 'Cargando...'" />
    </a-col>
        <a-col :span="12">
          <a-statistic title="Curso" :value="assignment.course_name" />
        </a-col>
        <a-col :span="12">
          <a-statistic title="Grupo" :value="assignment.group_name" />
        </a-col>
        <a-col :span="12">
          <a-statistic title="Nombre del estudiante" :value="assignment.student_full_name" />
        </a-col>
        <a-col :span="12">
          <a-statistic title="Fecha de asignacion" :value="formattedPaymentDate" />
        </a-col>
        <a-col :span="12">
          <a-statistic title="Monto" :value="assignment.amount" />
        </a-col>
        
        
        <a-col :span="24">
          <p><strong>Descripción:</strong> {{ assignment.description }}</p>
        </a-col>
      </a-row>
      <div style="margin-top: 24px; text-align: center;">
        <router-link to="/users">
          <a-button type="default">← Regresar al listado</a-button>
        </router-link>
        <a-button @click="downloadPDF(payment.id)" type="primary" style="margin-left: 8px;">
          Descargar Comprobante
          <DownloadOutlined />
        </a-button>
      </div>
    </a-card>
    </div>
    <div v-else>
      <p>Cargando detalles de la asignación...</p>
    </div>
  </div>
</template>
    
    <script lang="ts" setup>
    import { ref, computed, onMounted } from 'vue';
    import { useRoute } from 'vue-router';
    import apiClient from '@/api';
    import { DownloadOutlined } from '@ant-design/icons-vue';
    
    const route = useRoute();
    const assignment = ref<any>(null);
    const userprint = ref<any>(null);
    
    // Función para obtener los detalles de la asignación
    const fetchAssignmentDetails = async () => {
      const assignmentId = route.params.id;
      try {
        const response = await apiClient.get(`/enrollments/${assignmentId}/`);
        assignment.value = response.data;
    
        // Llamada para obtener los detalles del usuario usando el ID del estudiante
        getUser(assignment.value.student);
      } catch (error) {
        console.error("Error al cargar los detalles de la asignación:", error);
      }
    };
    
    // Función para obtener los datos del usuario según su ID
    const getUser = async (userId: string) => {
      try {
        const response = await apiClient.get(`/users/${userId}/`);
        userprint.value = response.data;
      } catch (error) {
        console.error("Error al obtener el usuario:", error);
      }
    };

    const formattedPaymentDate = computed(() => {
  if (assignment.value) {
    const date = new Date(assignment.value.enrollment_date);
    return date.toLocaleDateString();
  }
  return '';
});
    
    // Ejecutar la función para cargar detalles de la asignación cuando el componente se monta
    onMounted(() => {
      fetchAssignmentDetails();
    });
    
    // Computed para formatear la fecha de inscripción
    const formattedDate = computed(() => {
      if (assignment.value) {
        return new Date(assignment.value.enrollment_date).toLocaleDateString();
      }
      return '';
    });
    </script>
    
    <style scoped>
    .assignment-details {
      max-width: 600px;
      margin: 20px auto;
      padding: 20px;
      background-color: #ffffff;
      border-radius: 10px;
    }
    
    .title {
      text-align: center;
      color: #1890ff;
      margin-bottom: 20px;
      font-size: 24px;
    }
    
    p {
      font-size: 16px;
      color: #333;
      margin: 8px 0;
    }
    
    .loading {
      text-align: center;
      font-style: italic;
      color: #888;
    }
    </style>  