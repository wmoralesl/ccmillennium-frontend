<!-- Listar tareas -->
<template>
    <!-- Condición para mostrar un mensaje si no hay tareas -->
    <div v-if="assignments.length === 0">
        <p>No hay tareas disponibles para este grupo.</p>
    </div>

  <!-- Renderizar tareas si están disponibles -->
  <div v-else>
    <li v-for="assignment in assignments" :key="assignment.id">
    <a-card style="width: 100%; margin-bottom: 8px;" >
      <template #extra>
        <a-button v-if="userRole=='teacher'"> 
          <router-link :to="{ name: 'AssignmentSubmissions', params: { assignmentID: assignment.id, groupId: id } }" >
          Ver Entregas
        </router-link>
        </a-button>

        <a-button>
        <router-link :to="{ name: 'vertarea', params: { assignmentID: assignment.id} }" >
          Ver Tarea
        </router-link>
        </a-button>
        
      </template>
        <a-card-meta :title="assignment.title" :description="formatDate(assignment.due_date)">
          <template #avatar>
            <a-avatar :size="48" style="background-color:darkcyan;" >
              <template #icon><BookOutlined /></template>
            </a-avatar>
          </template>
          
        </a-card-meta>
      </a-card> 
    </li>

</div>


</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import apiClient from '@/api';
import {BookOutlined } from '@ant-design/icons-vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';

export default defineComponent({
  components: {
    BookOutlined,

  },
  props: {
    id: {
      type: String,
      required: true
    }
  },
  data() {
    const store = useStore();
    const userRole = computed(() => store.getters.getUser?.role);
    const router = useRouter();
    const redirectToContent = (assignmentID: number) => {
      router.push({ name: 'vertarea', params: { assignmentID} });
    };

    return {
      assignments: [] as Array<{ id: number; title: string; description: string }>,
      redirectToContent,
      userRole,
    };
  },
  methods: {
    async fetchAssignments() {
      try {
        const response = await apiClient.get(`/assignments/?group=${this.id}`);
        this.assignments = response.data;
      } catch (error) {
        console.error('Error fetching assignments:', error);
      }
    },
    formatDate(dateString: string) {
      const date = new Date(dateString);
      return date.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    },
  },
  mounted() {
    this.fetchAssignments();
  }
});
</script>

<style scoped>
.content-card {
  background-color: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 16px;
  display: flex;
  flex-direction: column;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: background-color 0.2s;
}

.content-card:hover {
  background-color: #f9f9f9;
}

.assignment-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.assignment-info {
  flex-grow: 1;
}

.title-with-icon {
  display: flex;
  align-items: center;
}


.icon {
  color: #1e88e5;
  font-size: 24px;
  margin-right: 8px;
}



.assignment-title {
  font-size: 18px;
  font-weight: bold;
  margin: 0;
}

.assignment-description {
  font-size: 14px;
  color: #666;
  margin: 5px 0;
}

.assignment-details {
  text-align: right;
}

.due-date, .grade {
  color: #888;
  font-size: 12px;
  margin: 0;
}

.assignment-footer {
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
  align-items: center;
}

.submissions-link {
  text-decoration: none;
  color: #1e88e5;
  font-weight: bold;
}

.action-button {
  background-color: #1e88e5;
  border: none;
  color: white;
  padding: 8px 12px;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.action-button:hover {
  background-color: #1565c0;
}

</style>