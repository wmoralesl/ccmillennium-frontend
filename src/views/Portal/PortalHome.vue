<template>
  <a-row justify="center" style="margin: 24px 0px;">
      <a-col :span="24" class="welcome-message">
        <a-card  class="welcome-card">
          <h1>
            👋 ¡Bienvenido de nuevo, <span class="highlight">{{ user.first_name }} {{ user.last_name }}</span>!
          </h1>
          <p>Nos alegra verte otra vez</p>
        </a-card>
      </a-col>
    </a-row>
  <listCardCourses />
</template>

<script lang="ts" setup>
import listCardCourses from '@/views/Portal/Courses/listCardCourses.vue';
import { useStore } from 'vuex';

const store = useStore();
const user = store.getters.getUser;
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
