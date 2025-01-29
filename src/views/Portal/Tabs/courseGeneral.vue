<template>
    <div>
      <h2>Anuncios</h2>
  
      <!-- Componente del formulario de anuncios -->
      <div class="container" v-if="userRole ==  'teacher'">

        <announcements
        :teacherId="teacherId"
        :groupId="groupId"
        @announcement-created="fetchAdvertisements" 
      />
      </div>
  
      <!-- Mostrar mensaje si no hay contenido -->
      <div v-if="advertisements.length === 0">
        <p>No hay contenido para este grupo.</p>
      </div>
  
      <!-- Renderizar anuncios si están disponibles -->
      <div v-else>

    <li v-for="advertisement in advertisements" :key="advertisement.id" class="advertisement-card">
      <div class="advertisement-header">
        <img :src="advertisement.teacher_photo" alt="Teacher photo" class="teacher-photo">
        <div class="teacher-info">
          <p class="teacher-name">{{ advertisement.teacher_name }}</p>
          <p class="created-at">{{ formatDate(advertisement.created_at) }}</p>
        </div>
        <button class="more-options">⋮</button>
      </div>
      <div class="advertisement-body">
        <p class="description">{{ advertisement.description }}</p>
      </div>
    </li>

</div>
    </div>
  </template>
  
  <script lang="ts">
  import { defineComponent, computed, ref, onMounted } from 'vue';
  import { useStore } from 'vuex';
  import apiClient from '@/api';
  import Announcements from '@/components/advertisements/advertForm.vue';
  
  export default defineComponent({
    components: {
      Announcements,
    },
    props: {
      id: {
        type: String,
        required: true,
      },
    },
    setup(props) {
      const store = useStore();
  
      const advertisements = ref<Array<{ id: number; description: string; created_at: string }>>([]);
  
      const teacherId = computed(() => {
        const user = store.getters.getUser;
        return user?.id;
      });
  
      const groupId = computed(() => props.id);
  
      const userRole = computed(() => store.getters.getUser?.role);
  
      const fetchAdvertisements = async () => {
        try {
          const response = await apiClient.get(`/advertisements/?group=${groupId.value}`);
          advertisements.value = response.data;
        } catch (error) {
          console.error('Error al obtener los anuncios:', error);
        }
      };
  
      const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("es-ES", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        });
      };
  
      onMounted(fetchAdvertisements);
  
      return {
        teacherId,
        groupId,
        advertisements,
        fetchAdvertisements,
        userRole,
        formatDate, // Retornamos `formatDate` para utilizarla en el template
      };
    },
  });
  </script>
  
  
  
  <style scoped>
  .advertisement-card {
  background-color: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 8px;
  display: flex;
  flex-direction: column;
}

.advertisement-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.teacher-photo {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
}

.teacher-info {
  margin-left: 10px;
  flex-grow: 1;
}

.teacher-name {
  font-weight: bold;
  margin: 0;
}

.created-at {
  color: #888;
  font-size: 12px;
}

.advertisement-body {
  margin-top: 10px;
}

.description {
  font-size: 14px;
  color: #333;
}

.more-options {
  background: none;
  border: none;
  color: #888;
  font-size: 24px;
  cursor: pointer;
}
  </style>
  