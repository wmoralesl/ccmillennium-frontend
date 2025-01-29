<template>
  <a-menu mode="inline" theme="light" v-model:selectedKeys="selectedKeys">
    <a-menu-item key="1">
      <router-link to="/home">
        <dashboard-outlined />
        <span>Inicio</span>
      </router-link>
    </a-menu-item>
    <a-menu-item key="2">
      <router-link to="/calendario">
        <CalendarOutlined />
        <span>Calendario</span>
      </router-link>
    </a-menu-item>
    <a-menu-item key="3" v-if="role=='student'">
      <router-link to="/mispagos">
        <DollarOutlined />
        <span>Mis pagos</span>
      </router-link>
    </a-menu-item>

  </a-menu>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import {
  DashboardOutlined,
  CalendarOutlined,
  DollarOutlined 
} from '@ant-design/icons-vue';
import { useStore } from 'vuex';

const store = useStore();
const role = computed(() => store.getters.getUser?.role);

const selectedKeys = ref<string[]>([]);
</script>
