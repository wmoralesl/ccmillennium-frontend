<template>
  <div>
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
    </ul>

    <div v-if="students.length" style="margin: auto; text-align: center;">
      <a-button @click="downloadPDF(groupId)">Exportar en PDF <FilePdfOutlined /></a-button>     
      <a-button @click="downloadXlsx(groupId)">Exportar en XLSX <FileExcelOutlined /></a-button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import apiClient from '@/api'; // Asegúrate de tener configurado tu cliente API
import  { FilePdfOutlined, FileExcelOutlined } from '@ant-design/icons-vue'; // Importa el icono de

export default defineComponent({
  name: 'GroupStudents',
  components: {
    FilePdfOutlined,
    FileExcelOutlined
  },
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

    const downloadPDF = async (groupId: number) => {
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
    };

    const downloadXlsx = async (groupId: number) => {
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
    };

    onMounted(() => {
      fetchStudents();
    });

    return {
      students,
      downloadPDF,
      downloadXlsx
    };
  }
});
</script>

<style scoped>
/* Agrega estilos si es necesario */
</style>
