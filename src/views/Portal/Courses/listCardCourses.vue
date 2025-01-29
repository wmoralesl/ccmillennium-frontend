<template>
  <div v-if="userRole === 'student'">
    <h2>Cursos Inscritos</h2>
    <div class="courses-list">
      <!-- Mensaje si no hay cursos inscritos -->
      <div v-if="enrollments.length === 0">
        <p>No tienes cursos inscritos.</p>
      </div>

      <!-- Cards minimalistas para los cursos -->
      <div v-for="enrollment in enrollments" :key="enrollment.id" class="course-card">
        <img :src="enrollment.course_photo" alt="Course Image" class="course-image" />
        <div class="course-info">
          <h3 class="course-title">{{ enrollment.course_name }}</h3>
          <p class="group-description">Grupo: {{ enrollment.group_name }}</p>
          <button @click="viewGroup(enrollment.group)" class="view-group-btn">Ver Grupo</button>
        </div>
      </div>
    </div>
  </div>
  <div v-else > 
    <h2>Cursos Impartidos</h2>
    <div class="courses-list">

      <div v-for="group in groups" :key="group.id" class="course-card">
         <img :src="group.course_photo" alt="Course Image" class="course-image" />
       <div class="course-info">
          <h3 class="course-title">{{ group.course_name }}</h3>
        <p class="group-description">Grupo: {{ group.name }}</p>
       <button @click="viewGroup(group.id)" class="view-group-btn">Ver Grupo</button>
        </div> 
      </div>

    </div>
  </div>
</template>


<script lang="ts" setup>
import apiClient from '@/api';
import router from '@/router';
import { ref, onMounted, computed } from 'vue';
import { useStore } from 'vuex';

const store = useStore();
const enrollments = ref([]);
const groups = ref([]);
const userId = computed(() => store.getters.getUser?.id);
const userRole = computed(() => store.getters.getUser?.role);

// Función para obtener las inscripciones
const fetchEnrollment = async () => {
  try {
    // console.log(userId.value);
    // Asegúrate de que el userId se obtenga correctamente
    const response = await apiClient.get(`/enrollments/?student=${userId.value}`);
    enrollments.value = response.data;
  } catch (error) {
    console.error('Error fetching enrollments:', error);
  }
};
// Función para obtener Grupos
const fetchGroup = async () => {
  try {
    // console.log(userId.value);
    // Asegúrate de que el userId se obtenga correctamente
    const response = await apiClient.get(`/groups/?teacher=${userId.value}`);
    groups.value = response.data;
  } catch (error) {
    console.error('Error fetching groups:', error);
  }
};

const initApp = async () =>{
  if(userRole.value === 'student'){
    await fetchEnrollment();
    }
    else if(userRole.value === 'teacher'){
      await fetchGroup();
      }
}


const viewGroup = (id) => {
  router.push({ name: 'listartareas', params: { id } });
};

// Montar la función cuando el componente se cargue
onMounted(initApp);
</script>

<style scoped>
.courses-list {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}

.course-card {
  margin: 10px 10px;
  width: 400px;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  overflow: hidden;
  background-color: #ffffff;
  transition: box-shadow 0.3s;
}

.course-card:hover {
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.15);
}

.course-image {
  width: 100%;
  height: 150px;
  object-fit: cover;
}

.course-info {
  padding: 15px;
}

.course-title {
  font-size: 1.1rem;
  margin: 0 0 5px;
}

.group-description {
  font-size: 0.9rem;
  color: #757575;
  margin: 0 0 10px;
}

.view-group-btn {
  width: 100%;
  padding: 10px;
  border: none;
  background-color: #007bff;
  color: white;
  font-size: 0.9rem;
  cursor: pointer;
  border-radius: 4px;
  transition: background-color 0.3s;
}

.view-group-btn:hover {
  background-color: #0056b3;
}
</style>