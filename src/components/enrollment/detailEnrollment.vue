<template>
    <div class="assignment-details">
      <h2>Detalles de la Asignación</h2>
      <div v-if="assignment">
        <p><strong>ID de la Asignación:</strong> {{ assignment.id }}</p>
        <p><strong>Estudiante:</strong> {{ assignment.student_full_name }}</p>
        <p><strong>Fecha de Inscripción:</strong> {{ formattedDate }}</p>
        <p><strong>Descripción:</strong> {{ assignment.description }}</p>
        <p><strong>Monto de Inscripción:</strong> Q {{ assignment.mount }}</p>
        <p><strong>ID del Estudiante:</strong> {{ assignment.student }}</p>
        <p><strong>ID del Grupo:</strong> {{ assignment.group }}</p>
      </div>
      <div v-else>
        <p>Cargando detalles de la asignación...</p>
      </div>
    </div>
  </template>
  
  <script lang="ts">
  /* eslint-disable */
import { defineComponent, ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
  import apiClient from '@/api';
  
  export default defineComponent({
    setup() {
      const route = useRoute();
      const assignment = ref<any>(null);
  
      const fetchAssignmentDetails = async () => {
        const assignmentId = route.params.id;
        try {
          const response = await apiClient.get(`/enrollments/${assignmentId}/`);
          assignment.value = response.data;
        } catch (error) {
          console.error("Error al cargar los detalles de la asignación:", error);
        }
      };
  
      onMounted(() => {
        fetchAssignmentDetails();
      });
  
      const formattedDate = computed(() => {
        if (assignment.value) {
          return new Date(assignment.value.enrollment_date).toLocaleDateString();
        }
        return '';
      });
  
      return {
        assignment,
        formattedDate,
      };
    },
  });
  </script>
  
  <style scoped>
  .assignment-details {
    max-width: 600px;
    margin: 0 auto;
  }
  </style>
  