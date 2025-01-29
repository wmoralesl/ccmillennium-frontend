<template>
    <div style="border-radius: 8px; margin: 0 auto;">
      <h2 style="text-align: center; color: #1890ff; margin-bottom: 20px;">Estudiantes y Tareas</h2>
      
      <!-- Tabla para mostrar los estudiantes y sus tareas -->
      <table style="width: 100%; border-collapse: collapse;">
        <thead>
          <tr style="background-color: #f0f0f0;">
            <th style="padding: 10px; border: 1px solid #ddd;">Estudiante</th>
            <th v-for="assignment in assignments" :key="assignment.id" style="padding: 10px; border: 1px solid #ddd;">{{ assignment.title }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="student in students" :key="student.id">
            <td style="padding: 10px; border: 1px solid #ddd;">
              <a-avatar :src="student.student_photo" size="large" style="margin-right: 15px;" />
              {{ student.student_full_name }}
            </td>
            <td v-for="assignment in assignments" :key="assignment.id" style="padding: 10px; border: 1px solid #ddd;">
              <div v-if="submissionExists(student.id, assignment.id)">
                <a href="submission.file" target="_blank">Ver Entrega</a>
              </div>
              <div v-else>
                No entregado
              </div>
            </td>
          </tr>
        </tbody>
      </table>
  
      <!-- Mensaje si no hay estudiantes -->
      <p v-if="students.length === 0" style="text-align: center; color: #888;">No hay estudiantes asignados a este grupo.</p>
    </div>
  </template>
  
  <script lang="ts">
  import { defineComponent } from 'vue';
  import apiClient from '@/api';
  
  export default defineComponent({
    props: {
      id: { // ID del grupo
        type: String,
        required: true
      }
    },
    data() {
      return {
        students: [] as Array<{ id: number; student_full_name: string; student_photo: string }>, // Lista de estudiantes
        assignments: [] as Array<{ id: number; title: string }>, // Lista de tareas
        submissions: [] as Array<{ id: number; assignment: number; student: number; file: string }> // Entregas
      };
    },
    methods: {
      // Función para obtener los estudiantes del grupo
      async fetchEnrollments() {
        try {
          const response = await apiClient.get(`/enrollments?group=${this.id}`);
          this.students = response.data;
        } catch (error) {
          console.error('Error fetching students:', error);
        }
      },
      // Función para obtener las tareas del grupo
      async fetchAssignments() {
        try {
          const response = await apiClient.get(`/assignments/?group=${this.id}`);
          this.assignments = response.data;
        } catch (error) {
          console.error('Error fetching assignments:', error);
        }
      },
      // Función para obtener las entregas de los estudiantes
      async fetchSubmissions() {
        try {
          const response = await apiClient.get(`/submissions/?group=${this.id}`);
          this.submissions = response.data;
        } catch (error) {
          console.error('Error fetching submissions:', error);
        }
      },
      // Verifica si un estudiante tiene una entrega para una tarea específica
      submissionExists(studentId: number, assignmentId: number) {
        return this.submissions.some(submission => submission.student === studentId && submission.assignment === assignmentId);
      }
    },
    mounted() {
      this.fetchEnrollments();
      this.fetchAssignments();
      this.fetchSubmissions();
    }
  });
  </script>
  
  <style scoped>
  /* Estilos adicionales para mejorar la tabla */
  table {
    margin-top: 20px;
    border-radius: 8px;
    overflow: hidden;
  }
  th, td {
    text-align: left;
  }
  th {
    background-color: #f0f0f0;
  }
  </style>
  