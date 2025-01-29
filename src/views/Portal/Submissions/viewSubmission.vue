<template>
  <div>
    <h2>Calificar Tarea</h2>
    <div v-if="submission">
      <p><strong>Archivo:</strong> <a :href="submission.file" target="_blank">Descargar</a></p>
      <p><strong>Fecha de Entrega:</strong> {{ submission.submitted_at }}</p>
      <p><strong>Estudiante:</strong> {{ submission.student_name }}</p>
      
      <form @submit.prevent="submitGrade">
        <div>
          <label for="grade">Calificación</label>
          <input type="number" id="grade" v-model="grade" min="0" max="100" required />
        </div>
        
        <div>
          <label for="feedback">Retroalimentación</label>
          <textarea id="feedback" v-model="feedback" placeholder="Comentarios..."></textarea>
        </div>
        
        <button type="submit">Guardar Calificación</button>
      </form>
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
      id: string; // Asegúrate de que la propiedad id esté incluida aquí
      file: string;
      submitted_at: string;
      student_name: string;
    } | null>(null);
    const grade = ref<number | null>(null);
    const feedback = ref<string>("");

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

    const submitGrade = async () => {
      if (!submission.value) return;

      try {
        const response = await apiClient.put(`/submissions/${submission.value.id}/`, {
          graded: true,
          grade: grade.value,
          feedback: feedback.value,
        });
        console.log("Calificación enviada:", response.data);
        message.success("Calificación guardada con éxito.");
      } catch (error) {
        console.error("Error al enviar la calificación:", error);
        message.error("Hubo un problema al guardar la calificación.");
      }
    };

    onMounted(() => {
      fetchSubmission();
    });

    return {
      submission,
      grade,
      feedback,
      submitGrade,
    };
  },
});
</script>

<style scoped>
/* Estilos opcionales */
</style>
