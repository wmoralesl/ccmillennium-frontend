<!-- general course -->
<template>
    <a-page-header
    title="Tareas "
  >
    <template #extra>
        <router-link :to="{ name: 'crearTarea' }">
        <a-button size="large">
          Crear tarea
          <PlusOutlined />
        </a-button>
    </router-link>
    </template>
  </a-page-header>

    <router-view />
  </template>
  
  <script lang="ts">
  import { PlusOutlined } from  '@ant-design/icons-vue';

  export default {
    components:{
        PlusOutlined
    },
    props: {
      id: {
        type: String,
        required: true
      }
    },
    data(){
        return{
            PlusOutlined
        }
    }
  }
  </script>
  