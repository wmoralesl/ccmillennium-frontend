<template>
  <div v-if="grupo">
   <a-tabs v-model:activeKey="activeKey" type="card">
    <a-tab-pane key="1" tab="General">

      <h1>Detalles del Grupo</h1>
    {{ grupo.id }}
    <p><strong>Nombre:</strong> {{ grupo.name }}</p>
    <p><strong>Profesor:</strong> {{ grupo.teacher_name }}</p>
    <p><strong>Año:</strong> {{ grupo.year }}</p>
    <p><strong>Presencial:</strong> {{ grupo.in_person ? 'Sí' : 'No' }}</p>
    <p><strong>Inicio:</strong> {{ grupo.start_date }}</p>
    <p><strong>Fin:</strong> {{ grupo.end_date }}</p>
    <p><strong>Horario:</strong> {{ grupo.schedule }}</p>
    <p><strong>Cantidad de Horas:</strong> {{ grupo.hours_count }}</p>
    <p><strong>Visible:</strong> {{ grupo.is_visible ? 'Sí' : 'No' }}</p>
    <p><strong>Curso:</strong> {{ courseName }}</p>

    <div style="margin-top: 16px;">
      <router-link to="/grupos">
        <a-button style="margin-left: 8px">Volver a la lista</a-button>
      </router-link>
      <router-link :to="'/grupos/' + grupo.id + '/edit'">
        <a-button type="primary">Editar Grupo</a-button>
      </router-link>
      
      <a-button type="danger" style="margin-left: 8px" @click="showDeleteConfirm">Eliminar Grupo</a-button>
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

    </a-tab-pane>
    <a-tab-pane key="2" tab="Estudiantes">
      
      <GroupStudents v-if="grupo.id" :groupId="grupo.id" />
    </a-tab-pane>
   </a-tabs>
  </div>
  <div v-else>
    <p>Cargando...</p>
  </div>
</template>

<script lang="ts">
/* eslint-disable */
import { defineComponent, ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import apiClient from '@/api';
import { message } from 'ant-design-vue'; // Para mostrar mensajes de error
import GroupStudents from '@/components/group/GroupStudents.vue'; // Importa tu componente
const activeKey = ref('1');

export default defineComponent({
  components: {
    GroupStudents,
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

    return {
      grupo,
      teacherName,
      courseName,
      showDeleteConfirm,
      handleCancel,
      isModalVisible,
      deleteGroup,
      activeKey,
    };
  },
});
</script>
