<template>
  <div>
    <a-page-header
    title="Contenido "
  >
    <template #extra>
        <router-link :to="{ name: 'crearContenido' }">
        <a-button size="large">
          Crear contenido 
          <PlusOutlined />
        </a-button>

    </router-link>

    </template>
  </a-page-header>
  <router-view />

  </div>
</template>

<script lang="ts">
import { PlusOutlined } from  '@ant-design/icons-vue';

export default {
  components: {
    PlusOutlined,
  },
  props: {
    id: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      PlusOutlined
    };
  },
};
</script>
