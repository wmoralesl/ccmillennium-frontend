<template>

    <div>
      <h2>Visualizando Entrega</h2>
      <div v-if="submission">
        <p><strong>Archivo:</strong> <a :href="submission.file" target="_blank">Descargar</a></p>
        <p><strong>Fecha de Entrega:</strong> {{ formatDate(submission.submitted_at) }}</p>
        
        <div v-if="submission.grade">
          <p><strong>Calificación:</strong> {{ submission.grade }}</p>
          <p><strong>Retroalimentación:</strong> {{ submission.feedback || 'No hay retroalimentación.' }}</p>
        </div>
        <div v-else>
          <p><strong>Calificación:</strong> No calificada aún.</p>
        </div>
      </div>
      <div v-else>
        <p>Cargando datos de la tarea...</p>
      </div>
    </div>
  </template>
  
  <script lang="ts">
  import { defineComponent, ref, onMounted } from 'vue';
  import apiClient from '@/api';
  import { message } from 'ant-design-vue';
  
  export default defineComponent({
    props: {
      assignmentId: {
        type: String,
        required: true,
      },
      studentId: {
        type: Number,
        required: true,
      },
    },
    setup(props) {
      const submission = ref<{
        id: string;
        file: string;
        submitted_at: string;
        graded: boolean;
        grade: number | null;
        feedback: string | null;
        student_name: string; // Asegúrate de incluir el nombre del estudiante
      } | null>(null);
  
      const fetchSubmission = async () => {
        try {
          const response = await apiClient.get(`/submissions/`, {
            params: {
              assignment: props.assignmentId,
              student: props.studentId,
            },
          });
          submission.value = response.data[0]; // Asumiendo que solo hay un submission para esta combinación
        } catch (error) {
          console.error("Error al obtener la tarea:", error);
          message.error("No se pudo cargar la tarea. Inténtalo de nuevo.");
        }
      };
  
      // Función para formatear la fecha
      const formatDate = (dateString: string) => {
        const options: Intl.DateTimeFormatOptions = {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false,
        };
        return new Date(dateString).toLocaleDateString(undefined, options);
      };
  
      onMounted(() => {
        fetchSubmission();
      });
  
      return {
        submission,
        formatDate,
      };
    },
  });
  </script>
  
  <style scoped>
  /* Estilos opcionales */
  </style>
  