<template>
  <div>
    <!-- Mensaje de bienvenida mejorado -->
    <a-row justify="center" style="margin: 24px 0px;">
      <a-col :span="24" class="welcome-message">
        <a-card  class="welcome-card">
          <h1>
            👋 ¡Bienvenido de nuevo, <span class="highlight">{{ user.first_name }} {{ user.last_name }}</span>!
          </h1>
          <p>Nos alegra verte otra vez. Aquí está un resumen de tu plataforma.</p>
        </a-card>
      </a-col>
    </a-row>

    <!-- Tarjetas de estadísticas -->
    <a-row :gutter="16">
      <a-col :span="6">
        <a-card>
          <a-statistic title="Usuarios Registrados" :value="totalUsers" prefix="👤" />
        </a-card>
      </a-col>

      <a-col :span="6">
        <a-card>
          <a-statistic title="Cursos Totales" :value="totalCourses" prefix="📚" />
        </a-card>
      </a-col>

      <a-col :span="6">
        <a-card>
          <a-statistic title="Grupos Totales" :value="totalGroups" prefix="🏫" />
        </a-card>
      </a-col>

      <a-col :span="6">
        <a-card>
          <a-statistic title="Pagos este Mes" :value="totalPayments" prefix="💳" />
        </a-card>
      </a-col>
    </a-row>

    <!-- Sección de gráficos -->
    <a-row :gutter="16" style="margin-top: 24px;">
      <a-col :span="12">
        <a-card title="Usuarios Registrados por Mes">
          <canvas id="usersChart"></canvas>
        </a-card>
      </a-col>

      <a-col :span="12">
        <a-card title="Estudiantes por Curso">
          <canvas id="coursesChart"></canvas>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import Chart from 'chart.js/auto';
import { useStore } from 'vuex';
import apiClient from '@/api'; // Ajusta la ruta según la ubicación de tu apiClient

// Variables reactivas para almacenar los datos del dashboard
const totalUsers = ref(0);
const totalCourses = ref(0);
const totalGroups = ref(0);
const totalPayments = ref(0);
const usersPerMonth = ref([]);
const monthsLabels = ref([]);
const courseLabels = ref([]);
const courseData = ref([]);

// Obtener el usuario desde Vuex
const store = useStore();
const user = store.getters.getUser;

// Función para obtener datos del dashboard desde la API
const fetchDashboardData = async () => {
  try {
    const response = await apiClient.get('/dashboard/');
    const data = response.data;

    // Actualizar las variables
    totalUsers.value = data.total_users;
    totalCourses.value = data.total_courses;
    totalGroups.value = data.total_groups;
    totalPayments.value = data.total_payments;
    usersPerMonth.value = data.users_per_month;
    monthsLabels.value = data.months_labels;
    courseLabels.value = data.course_labels;
    courseData.value = data.course_data;

    // Llamar a createCharts después de que los datos han sido cargados
    createCharts(); 
  } catch (error) {
    console.error(error);
  }
};
let usersChart = null;
let coursesChart = null;
// Función para crear los gráficos usando Chart.js
const createCharts = () => {
  // Si ya existen gráficos, destruirlos antes de crear nuevos
  if (usersChart) {
    usersChart.destroy();
  }

  const ctxUsers = document.getElementById('usersChart')?.getContext('2d');
  if (ctxUsers) {
  usersChart = new Chart(ctxUsers, {
    type: 'line',
    data: {
      labels: monthsLabels.value,
      datasets: [
        {
          label: 'Usuarios Registrados',
          data: usersPerMonth.value,
          borderColor: 'rgba(75, 192, 192, 1)',
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
    },
  });
  console.log("usersChart initialized:", usersChart);
}

  // Repetir para el gráfico de cursos
  if (coursesChart) {
    coursesChart.destroy();
  }

  const ctxCourses = document.getElementById('coursesChart')?.getContext('2d');
  if (ctxCourses) {
    coursesChart = new Chart(ctxCourses, {
      type: 'pie',
      data: {
        labels: courseLabels.value,
        datasets: [
          {
            label: 'Distribución de Cursos',
            data: courseData.value,
            backgroundColor: [
              'rgba(255, 99, 132, 0.2)',
              'rgba(54, 162, 235, 0.2)',
              'rgba(255, 206, 86, 0.2)',
              'rgba(75, 192, 192, 0.2)',
              'rgba(153, 102, 255, 0.2)',
            ],
            borderColor: [
              'rgba(255, 99, 132, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 206, 86, 1)',
              'rgba(75, 192, 192, 1)',
              'rgba(153, 102, 255, 1)',
            ],
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
      },
    });
  }
};

// Llamar a las funciones al montar el componente
onMounted(() => {
  fetchDashboardData();
  createCharts();
});
</script>

<style scoped>
/* Estilo para el mensaje de bienvenida */
.welcome-message {
  text-align: center;
}

.welcome-card {
  padding: 4px;
}

h1 {
  font-size: 28px;
  color: #333;
  font-weight: bold;
}

.highlight {
  color: #1890ff;
}

p {
  font-size: 16px;
  color: #666;
}


/* Espaciado para los gráficos */
canvas {
  width: 100% !important;
  height: 300px !important;
}
</style>
