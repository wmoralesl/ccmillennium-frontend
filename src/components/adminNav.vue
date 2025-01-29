<template>
  <a-menu mode="inline" theme="light" v-model:selectedKeys="selectedKeys">
    <a-menu-item key="1">
      <router-link to="/admin">
        <dashboard-outlined />
        <span>AdminHome</span>
      </router-link>
    </a-menu-item>
    <a-menu-item key="2">
      <router-link to="/courses">
        <book-outlined />
        <span>Cursos</span>
      </router-link>
    </a-menu-item>
    <a-menu-item key="3">
      <router-link to="/grupos">
        <team-outlined />
        <span>Grupos</span>
      </router-link>
    </a-menu-item>

    <a-menu-item key="4">
      <router-link to="/pagos">
        <DollarOutlined />
        <span>Pagos</span>
      </router-link>
    </a-menu-item>

    <!-- <a-menu-item key="5">
      <router-link to="/tasks">
        <profile-outlined />
        <span>Tareas</span>
      </router-link>
    </a-menu-item>
    <a-menu-item key="6">
      <router-link to="/task-submissions">
        <upload-outlined />
        <span>Tareas Subidas</span>
      </router-link>
    </a-menu-item> -->
    <a-menu-item key="5">
      <router-link to="/users">
        <user-outlined />
        <span>Usuarios</span>
      </router-link>
    </a-menu-item>
  </a-menu>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import {
  DashboardOutlined,
  BookOutlined,
  TeamOutlined,
  DollarOutlined,
  // ProfileOutlined,
  // UploadOutlined,
  UserOutlined
} from '@ant-design/icons-vue';

const selectedKeys = ref<string[]>([]);
</script>
