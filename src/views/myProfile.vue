<template>
    <div>
      <h1>Mi perfil</h1>
      <perfil :id="id" />
    </div>
  </template>
  
  <script lang="ts" setup>
  import perfil from '@/components/user/detailUser.vue'
  import { computed } from 'vue';
  import { useStore } from 'vuex';
  
  const store = useStore()
  const id = computed(() => store.getters.getUser?.id); // Asegúrate de que esto devuelva el id
  </script>
  