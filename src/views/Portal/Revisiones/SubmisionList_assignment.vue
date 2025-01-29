<template>
<a-page-header
    title="Entregas realizadas"
    @back="() => $router.go(-1)"
  ></a-page-header>
    <div>
      <h1>Estado de entregas para la tarea: {{ assignmentID }}</h1>
      <table>
        <thead>
          <tr>
            <th>Nombre del Estudiante</th>
            <th>Entrega</th>
            <th>Fecha de Entrega</th>
            <th>Calificación</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="student in students" :key="student.id">
            <td>{{ student.student_full_name }}</td>
            <td v-if="student.submission">
  <router-link :to="{ name: 'Calificar', params: { assignmentID: assignmentID } }">
    VER
  </router-link>
  <a :href="student.submission.file" target="_blank">Ver Entrega</a>
</td>
            <td v-else>No entregado</td>
            <td>{{ student.submission ? student.submission.submitted_at : 'N/A' }}</td>
            <td>{{ student.submission && student.submission.graded ? student.submission.grade : 'Sin calificar' }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </template>
  
  <script>
  import apiClient from "@/api"; // Asegúrate de tener tu instancia API configurada
  
  export default {
    props: {
      assignmentID: {
        type: Number,
        required: true
      },
      groupId: {
        type: Number,
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
