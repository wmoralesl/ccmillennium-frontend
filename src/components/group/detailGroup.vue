<template>
  <div v-if="grupo" class="group-details">
    <a-tabs v-model:activeKey="activeKey" type="card">
      <a-tab-pane key="1" tab="General">
        <div class="container">
          <a-card class="group-details-card" title="Detalles del Grupo" bordered>
            <template #extra>
              <router-link :to="'/grupos/' + grupo.id + '/edit'">
                <a-button  class="btn-edit">Editar Grupo</a-button>
              </router-link>
              <a-button type="text" danger @click="showDeleteConfirm">Eliminar Grupo</a-button>
            </template>
            <a-row gutter="[16, 16]">
              <a-col span="24">
                <div class="detail-item">
                  <TeamOutlined class="icon" />
                  <span class="label">Nombre del Grupo:</span> 
                  <span class="info">{{ grupo.name }} ({{ grupo.year }})</span>
                </div>
              </a-col>
              <a-col span="24">
                <div class="detail-item">
                  <UserOutlined class="icon" />
                  <span class="label">Profesor:</span> 
                  <span class="info">{{ grupo.teacher_name }}</span>
                </div>
              </a-col>
              <a-col span="24">
                <div class="detail-item">
                  <CalendarOutlined class="icon" />
                  <span class="label">Fecha de Inicio:</span> 
                  <span class="info">{{ grupo.start_date }}</span>
                </div>
              </a-col>
              <a-col span="24">
                <div class="detail-item">
                  <CalendarOutlined class="icon" />
                  <span class="label">Fecha de Fin:</span> 
                  <span class="info">{{ grupo.end_date }}</span>
                </div>
              </a-col>
              <a-col span="24">
                <div class="detail-item">
                  <ClockCircleOutlined class="icon" />
                  <span class="label">Horario:</span> 
                  <span class="info">{{ formatSchedule(grupo.schedule, grupo.hours_count) }}</span>
                </div>
              </a-col>
              <a-col span="24">
                <div class="detail-item">
                  <BookOutlined class="icon" />
                  <span class="label">Curso:</span> 
                  <span class="info">{{ courseName }}</span>
                </div>
              </a-col>
              <a-col span="24">
                <div class="detail-item">
                  <EnvironmentOutlined class="icon" />
                  <span class="label">Modalidad:</span> 
                  <a-badge :status="grupo.in_person ? 'success' : 'default'" :text="grupo.in_person ? 'Presencial' : 'Virtual'" />
                </div>
              </a-col>
              <a-col span="24">
                <div class="detail-item">
                  <EyeOutlined class="icon" />
                  <span class="label">Visible:</span> 
                  <a-badge :status="grupo.is_visible ? 'success' : 'error'" :text="grupo.is_visible ? 'Sí' : 'No'" />
                </div>
              </a-col>
            </a-row>
          </a-card>

          <div class="button-group" style="margin-top: 16px;">
            <router-link to="/grupos">
              <a-button type="primary">Volver a la lista</a-button>
            </router-link>
            
          </div>

          <!-- Modal de Confirmación -->
          <a-modal
            v-model:open="isModalVisible" 
            title="Confirmar Eliminación"
            @ok="deleteGroup"
            @cancel="handleCancel"
          >
            <p>¿Estás seguro de que deseas eliminar este grupo?</p>
          </a-modal>
        </div>
      </a-tab-pane>
      <a-tab-pane key="2" tab="Estudiantes">
        <div class="container">
          <GroupStudents v-if="grupo.id" :groupId="grupo.id" />
        </div>
      </a-tab-pane>
    </a-tabs>
  </div>
  <div v-else>
    <p class="loading">Cargando...</p>
  </div>
</template>

<script lang="ts">
/* eslint-disable */
import { defineComponent, ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import apiClient from '@/api';
import { message } from 'ant-design-vue'; // Para mostrar mensajes de error
import GroupStudents from '@/components/group/GroupStudents.vue'; // Importa tu componente
import { 
  UserOutlined, 
  TeamOutlined, 
  EnvironmentOutlined, 
  CalendarOutlined, 
  ClockCircleOutlined, 
  EyeOutlined, 
  BookOutlined 
} from '@ant-design/icons-vue';

const activeKey = ref('1');

export default defineComponent({
  components: {
    GroupStudents,
    UserOutlined,
    TeamOutlined,
    EnvironmentOutlined,
    CalendarOutlined,
    ClockCircleOutlined,
    EyeOutlined,
    BookOutlined
  },
  setup() {
    const route = useRoute();
    const router = useRouter();
    const grupo = ref<any>(null);
    const teacherName = ref<string>('');
    const courseName = ref<string>('');
    const isModalVisible = ref(false); // Estado para controlar la visibilidad del modal

    onMounted(async () => {
      await fetchGrupo();
    });

    const fetchGrupo = async () => {
      try {
        const response = await apiClient.get(`/groups/${route.params.id}/`);
        grupo.value = response.data;
        await fetchCourse(grupo.value.course);
      } catch (error) {
        console.error('Error al cargar grupo', error);
      }
    };

    const fetchCourse = async (courseId: number) => {
      try {
        const response = await apiClient.get(`/courses/${courseId}/`);
        courseName.value = response.data.name;
      } catch (error) {
        console.error('Error al cargar curso', error);
      }
    };

    const deleteGroup = async () => {
      try {
        await apiClient.delete(`/groups/${grupo.value.id}/`);
        message.success('Grupo eliminado correctamente');
        router.push('/grupos'); // Redirige a la lista de grupos
      } catch (error) {
        message.error('Error al eliminar grupo');
        console.error('Error al eliminar grupo', error);
      } finally {
        isModalVisible.value = false; // Cierra el modal
      }
    };

    const showDeleteConfirm = () => {
      isModalVisible.value = true; // Muestra el modal de confirmación
    };

    const handleCancel = () => {
      isModalVisible.value = false; // Cierra el modal
    };

    // Función para formatear el horario
    const formatSchedule = (start: string, hoursCount: number): string => {
      const startTime = new Date(`1970-01-01T${start}`);
      const endTime = new Date(startTime.getTime() + hoursCount * 60 * 60 * 1000);
      
      const formatTime = (date: Date): string => {
        const options: Intl.DateTimeFormatOptions = { hour: 'numeric', minute: 'numeric', hour12: true };
        return date.toLocaleString('en-US', options).replace(' AM', ' am').replace(' PM', ' pm');
      };

      return `${formatTime(startTime)} - ${formatTime(endTime)}`;
    };

    return {
      grupo,
      teacherName,
      courseName,
      showDeleteConfirm,
      handleCancel,
      isModalVisible,
      deleteGroup,
      activeKey,
      formatSchedule,
    };
  },
});
</script>

<style scoped>
.container {
  max-width: 800px;
  margin: 0px auto;
}

.title {
  text-align: center;
  color: #1890ff;
  margin-bottom: 20px;
  font-size: 28px;
}

.detail-item {
  display: flex;
  align-items: center;
  margin-bottom: 12px; /* Espaciado entre los elementos */
}

.label {
  font-weight: 600;
  margin-left: 8px;
  margin-right: 4px; /* Espacio entre la etiqueta y el valor */
  font-size: 16px; /* Aumentar tamaño de fuente de la etiqueta */
}

.info {
  font-size: 16px; /* Aumentar tamaño de fuente de la información */
  color: #333; /* Color del texto */
}

.icon {
  font-size: 16px; /* Aumentar tamaño de los íconos */
  margin-right: 8px; /* Espaciado entre el ícono y el texto */
}
</style>
