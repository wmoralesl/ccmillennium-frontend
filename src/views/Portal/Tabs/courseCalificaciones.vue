<template>
  <div style="border-radius: 8px; margin: 0 auto;">
    <h2 style="text-align: center; color: #1890ff; margin-bottom: 20px;">Estudiantes y Tareas</h2>

    <!-- Tabla para mostrar los estudiantes y sus tareas -->
    <table style="width: 100%; border-collapse: collapse;">
      <thead>
        <tr style="background-color: #f0f0f0;">
          <th style="padding: 10px; border: 1px solid #ddd;">
            Estudiante
          </th>
          <!-- Iterar sobre los módulos y luego sobre las tareas dentro de cada módulo -->
          <template v-for="(assignments, moduleName) in groupedAssignments" :key="moduleName">
            <th :colspan="assignments.length" style="padding: 10px; border: 1px solid #ddd; text-align: center;">
              {{ moduleName }}
            </th>
          </template>
        </tr>
        <tr style="background-color: #f0f0f0;">
          <th style="padding: 10px; border: 1px solid #ddd;">&nbsp;</th>
          <template v-for="(assignments) in groupedAssignments">
            <th v-for="assignment in assignments" :key="assignment.id" style="padding: 10px; border: 1px solid #ddd; text-align: center;">
              {{ assignment.title }}
            </th>
          </template>
        </tr>
      </thead>
      <tbody>
        <tr v-for="student in students" :key="student.id">
          <td style="padding: 10px; border: 1px solid #ddd;">
            {{ student.first_name }} {{ student.last_name }} {{ student.second_last_name }}
          </td>
          <template v-for="assignments in groupedAssignments">
            <td v-for="assignment in assignments" :key="assignment.id" style="padding: 10px; border: 1px solid #ddd;">
              <template v-if="submissionsMap[student.id] && submissionsMap[student.id][assignment.id]">
                <p v-if="submissionsMap[student.id][assignment.id].grade">
                  <span style="color: green;">
                    {{ submissionsMap[student.id][assignment.id].grade }}
                  </span> 
                </p>
                <p v-else style="color: orange;">
                  No calificado
                </p>
              </template>
              <template v-else>
                <p style="color: gray;">No entregado</p>
              </template>
            </td>
          </template>
        </tr>
      </tbody>
    </table>
    <div style="margin: 12px 0px; text-align: center;">
      <a-button @click="generatePDF">Exportar en PDF<FilePdfOutlined /></a-button>
      <a-button @click="exportToXLSX">Exportar en XLSX<FileExcelOutlined /></a-button>

    </div>

    <!-- Mensaje si no hay estudiantes -->
    <p v-if="students.length === 0" style="text-align: center; color: #888;">No hay estudiantes asignados a este grupo.</p>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import apiClient from '@/api';
import html2pdf from 'html2pdf.js';
import * as XLSX from 'xlsx';
import  { FilePdfOutlined, FileExcelOutlined } from '@ant-design/icons-vue'; // Importa el icono de


interface Student {
  id: number;
  first_name: string;
  last_name: string;
  second_last_name: string;
}

interface Assignment {
  id: number;
  title: string;
  module_name: string;
}

interface Submission {
  file: string;
  grade: number | null;
}

export default defineComponent({
  components: {
    FilePdfOutlined,
    FileExcelOutlined
  },
  props: {
    id: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      students: [] as Student[],
      assignments: [] as Assignment[],
      groupedAssignments: {} as Record<string, Assignment[]>, // Agrupar por módulo
      submissionsMap: {} as Record<number, Record<number, Submission>>, // Mapear por estudiante y asignación
    };
  },
  methods: {
    async fetchGroupSummary() {
      try {
        const response = await apiClient.get(`/group-summary/${this.id}`);
        const { students, assignments, submissions } = response.data;

        this.students = students;

        // Agrupar las tareas por module_name
        this.groupedAssignments = assignments.reduce((acc: Record<string, Assignment[]>, assignment: Assignment) => {
          const moduleName = assignment.module_name;
          if (!acc[moduleName]) {
            acc[moduleName] = [];
          }
          acc[moduleName].push(assignment);
          return acc;
        }, {});

        // Crear un mapa de entregas para facilitar el acceso
        this.submissionsMap = submissions.reduce((map: Record<number, Record<number, Submission>>, submission: any) => {
          if (!map[submission.student]) {
            map[submission.student] = {};
          }
          map[submission.student][submission.assignment] = {
            file: submission.file,
            grade: submission.grade,
          };
          return map;
        }, {});
      } catch (error) {
        console.error('Error fetching group summary:', error);
      }
    },
    generatePDF() {
      const element = document.querySelector("table"); // Selecciona el elemento de la tabla para el PDF
      const options = {
        margin: 0.5,
        filename: 'Calificaciones.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'landscape' }
      };
      html2pdf().set(options).from(element).save();
    },
    exportToXLSX() {
      // Crear la estructura para la hoja de cálculo
      const data = [];
      const headerRow = ['Estudiante'];
      
      // Añadir títulos de las tareas al encabezado
      Object.values(this.groupedAssignments).forEach((assignments) => {
        assignments.forEach((assignment) => {
          headerRow.push(assignment.title);
        });
      });
      data.push(headerRow);
      
      // Añadir filas de estudiantes y calificaciones
      this.students.forEach((student) => {
        const row = [`${student.first_name} ${student.last_name} ${student.second_last_name}`];
        Object.values(this.groupedAssignments).forEach((assignments) => {
          assignments.forEach((assignment) => {
            const submission = this.submissionsMap[student.id]?.[assignment.id];
            row.push(submission?.grade?.toString() ?? 'No entregado');
          });
        });
        data.push(row);
      });

      // Crear hoja de trabajo y libro
      const worksheet = XLSX.utils.aoa_to_sheet(data);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Calificaciones');
      
      // Descargar el archivo
      XLSX.writeFile(workbook, 'Calificaciones.xlsx');
    },
  },
  mounted() {
    this.fetchGroupSummary();
  },
});
</script>


<style scoped>
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
