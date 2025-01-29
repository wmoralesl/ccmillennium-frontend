<template>

  <div v-bind="$attrs">
    <h1>Estado de entregas para la tarea</h1>
    <table>
      <thead>
        <tr>
          <th>Nombre del Estudiante</th>
          <th>Entrega</th>
          <th>Fecha de Entrega</th>
          <th>Calificación</th>
          <th>Comentario</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="student in students" :key="student.id">
          <td>{{ student.student_full_name }}</td>
          <td v-if="student.submission">
            <a :href="student.submission.file" target="_blank" download>Descargar Entrega</a>
          </td>
          <td v-else>No entregado</td>
          <td>{{ student.submission ? student.submission.submitted_at : 'N/A' }}</td>
          <td>
            <input 
              type="text" 
              :value="getGrade(student)" 
              @input="updateStudentGrade(student, $event.target.value)" 
              @keyup.enter="updateGrade(student)" 
              :placeholder="student.submission && student.submission.graded ? '' : 'Sin calificar'" 
            />
          </td>
          <td>
            <input 
              type="text" 
              :value="getFeedback(student)" 
              @input="updateStudentFeedback(student, $event.target.value)" 
              @keyup.enter="updateFeedback(student)" 
              :placeholder="student.submission && student.submission.graded ? '' : 'Sin comentario'" 
            />
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import apiClient from "@/api"; // Asegúrate de tener tu instancia API configurada
import { message } from "ant-design-vue";

export default {
  props: {
    assignmentID: {
      type: String,
      required: true
    },
    groupId: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      students: []
    };
  },
  async created() {
    await this.fetchStudents();
    await this.fetchSubmissions();
  },
  methods: {
    async fetchStudents() {
      // Obtiene los estudiantes del grupo
      try {
        const response = await apiClient.get(`/enrollments?group=${this.groupId}`);
        this.students = response.data.map(student => ({
          ...student,
          submission: null // Inicialmente sin entrega
        }));
      } catch (error) {
        console.error("Error al obtener los estudiantes:", error);
      }
    },
    async fetchSubmissions() {
      // Obtiene las entregas de la tarea específica
      try {
        const response = await apiClient.get(`/submissions?assignment=${this.assignmentID}`);
        const submissions = response.data;

        // Combina entregas con estudiantes
        this.students = this.students.map(student => {
          const submission = submissions.find(sub => sub.student === student.student);
          return {
            ...student,
            submission: submission || null
          };
        });
      } catch (error) {
        console.error("Error al obtener las entregas:", error);
      }
    },
    getGrade(student) {
      return student.submission ? student.submission.grade : ''; // Retorna la calificación o vacío
    },
    getFeedback(student) {
      return student.submission && student.submission.feedback ? student.submission.feedback : ''; // Retorna el feedback o vacío
    },
    updateStudentGrade(student, value) {
      // Actualiza la calificación en el objeto student localmente
      if (student.submission) {
        student.submission.grade = value;
      }
    },
    updateStudentFeedback(student, value) {
      // Actualiza el feedback en el objeto student localmente
      if (student.submission) {
        student.submission.feedback = value;
      }
    },
    async updateGrade(student) {
      if (student.submission && student.submission.id) {
        // Envía la nueva calificación al servidor
        try {
          await apiClient.patch(`/submissions/${student.submission.id}/`, { grade: student.submission.grade });
          message.success('Calificación actualizada correctamente'); // Notificación de éxito
        } catch (error) {
          console.error("Error al actualizar la calificación:", error);
          message.error('Error al actualizar la calificación'); // Notificación de error
        }
      } else {
        message.warning('No se puede actualizar la calificación: entrega no encontrada.'); // Notificación de advertencia
      }
    },
    async updateFeedback(student) {
      if (student.submission && student.submission.id) {
        // Envía el nuevo comentario al servidor
        try {
          await apiClient.patch(`/submissions/${student.submission.id}/`, { feedback: student.submission.feedback });
          message.success('Comentario actualizado correctamente'); // Notificación de éxito
        } catch (error) {
          console.error("Error al actualizar el comentario:", error);
          message.error('Error al actualizar el comentario'); // Notificación de error
        }
      } else {
        message.warning('No se puede actualizar el comentario: entrega no encontrada.'); // Notificación de advertencia
      }
    }
  }
};
</script>

<style scoped>
/* Estilos personalizados para la tabla */
table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  padding: 8px;
  border: 1px solid #ddd;
  text-align: left;
}

th {
  background-color: #f4f4f4;
}
</style>
