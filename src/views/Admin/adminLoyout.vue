<template>
  <a-layout style="min-height: 100vh">
    <!-- Navbar (Sidebar) -->
    <a-layout-sider collapsible v-model:collapsed="collapsed" theme="light">
      <adminNav />
    </a-layout-sider>

    <!-- Main Layout -->
    <a-layout>
      <!-- Topbar (Componente Importado) -->
      <Topbars :collapsed="collapsed" :toggleCollapse="toggleCollapse" :style="{background: '#fff'}" />

      <!-- Contenido Principal -->
      <a-layout-content 
        :style="{ margin: '12px 12px', padding: '0px 24px', background: '#fff', }"
      >
        <router-view/>
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import Topbars from '@/components/topBar.vue';
import adminNav from '@/components/adminNav.vue';

const collapsed = ref<boolean>(false);

const toggleCollapse = () => {
  collapsed.value = !collapsed.value;
};
</script>
