<template>
  <div style="border-radius: 8px;  margin: 0 auto;">
    <!-- Información del profesor -->
    <h2 style="text-align: center; color: #1890ff; margin-bottom: 20px;">Profesor</h2>
    <div
      style="display: flex; align-items: center; margin-bottom: 10px; border-radius: 8px;"
    >
      <a-avatar
        :src="group.teacher_photo"
        size="large"
        style="margin-right: 15px;"
      />
      <span style="font-size: 16px; color: #333;">{{ group.teacher_name }}</span>
    </div>
 
    <!-- Título de la sección de estudiantes -->
    <h2 style="text-align: center; color: #1890ff; margin-bottom: 20px;">Estudiantes</h2>

    <!-- Lista de estudiantes si hay estudiantes -->
    <ul v-if="students.length" style="list-style: none; padding: 0;">
      <li
        v-for="student in students"
        :key="student.id"
        style="display: flex; align-items: center; margin-bottom: 10px; border-radius: 8px;"
      >
        <a-avatar
          :src="student.student_photo"
          size="large"
          style="margin-right: 15px;"
        />
        <span style="font-size: 16px; color: #555;">{{ student.student_full_name }}</span>
      </li>
      <br>
      <div style="margin: auto;">
        <a-button @click="downloadPDF(id)">Descargar PDF</a-button>     
        <a-button @click="downloadXlsx(id)">Descargar XLSX</a-button>
      </div>
    </ul>

    <!-- Mensaje si no hay estudiantes -->
    <p v-else style="text-align: center; color: #888;">No hay estudiantes asignados a este grupo.</p>
  </div>
</template>


    
<script lang="ts">
import { defineComponent } from 'vue';
import apiClient from '@/api';

export default defineComponent({
  props: {
    id: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      students: [] as Array<{ id: number; student_full_name: string }>, // Lista de estudiantes con tipado
      group: [] as Array<{ id: number; teacher: string }>,
    };
  },
  methods: {
    
    // Función para obtener los estudiantes del grupo
    async fetchEnrollments() {
      try {
        // Petición a la API usando el id del grupo
        const response = await apiClient.get(`/enrollments?group=${this.id}`);
        this.students = response.data; // Guardar los datos de la API
      } catch (error) {
        console.error('Error fetching students:', error);
      }
    },
    async fetchTeacherName() {
      try {
        // Petición a la API usando el id del grupo
        const response = await apiClient.get(`/groups/${this.id}`);
        this.group = response.data; // Guardar los datos de la API
      } catch (error) {
        console.error('Error fetching groups:', error);
      }
    },
    async downloadPDF(groupId: any) {
    try {
      const response = await apiClient.get(`/group-pdf/${groupId}/`, {
        responseType: 'blob', // Importante para manejar la descarga de archivos
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `informe_grupo_${groupId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Error al descargar el PDF:", error);
    }
  },
  async downloadXlsx(groupId: any) {
  try {
    const response = await apiClient.get(`/group-xlsx/${groupId}/`, {
      responseType: 'blob', // Importante para manejar la descarga de archivos
    });
    
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `grupo_${groupId}.xlsx`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  } catch (error) {
    console.error("Error al descargar el archivo XLSX:", error);
  }
}
  },
  mounted() {
    // Ejecutar la función cuando el componente se monta
    this.fetchEnrollments();
    this.fetchTeacherName();
  }
});
</script>
