<template>
  <div>
    <h3>Estudiantes asignados al Grupo {{ groupId }}</h3>
    <ul v-if="students.length">
      <li v-for="student in students" :key="student.id">
        Estudiante: {{ student.student_full_name }} - Fecha de inscripción: {{ student.enrollment_date }}
      </li>
    </ul>
    <p v-else>No hay estudiantes asignados a este grupo.</p>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import apiClient from '@/api'; // Asegúrate de tener configurado tu cliente API

export default defineComponent({
  name: 'GroupStudents',
  props: {
    groupId: {
      type: Number,
      required: true
    }
  },
  setup(props) {
    const students = ref([]);

    const fetchStudents = async () => {
      try {
        const response = await apiClient.get(`/enrollments?group=${props.groupId}`);
        students.value = response.data;
      } catch (error) {
        console.error('Error al cargar los estudiantes del grupo', error);
      }
    };

    onMounted(() => {
      fetchStudents();
    });

    return {
      students
    };
  }
});
</script>

<style scoped>
/* Agrega estilos si es necesario */
</style>
