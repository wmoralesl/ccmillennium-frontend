
<template>

<!-- Mensaje si no hay contenido -->
<div v-if="contents.length === 0">
  <p>No hay contenido para este grupo.</p>
</div>

<!-- Lista de contenidos -->
<div v-else>

    <li v-for="content in contents" :key="content.id">

<a-card style="width: 100%; margin-bottom: 8px;" @click="redirectToContent(content.id)" >
  <!-- <template #actions>
    <setting-outlined key="setting" />
    <edit-outlined key="edit" />
    <ellipsis-outlined key="ellipsis" />
  </template> -->
  <a-card-meta :title="content.title" :description="formatDate(content.created_at)">
    <template #avatar>
      <a-avatar :size="48" style="background-color:coral;" >
        <template #icon><BookOutlined /></template>
      </a-avatar>
    </template>

  </a-card-meta>
</a-card>
  
    
      
    </li>
</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import apiClient from '@/api';
import { useRouter } from 'vue-router';
import {BookOutlined } from '@ant-design/icons-vue';

export default defineComponent({
  components: {
    BookOutlined,
 
  },
  props: {
    id: {
      type: String,
      required: true,
    },
  },
  data() {
    const router = useRouter();
    const redirectToContent = (contentID: number) => {
      router.push({ name: 'vercontenido', params: { contentID } });
    };

    return {
      contents: [] as Array<{ id: number; title: string; description: string; created_at: string }>, // Lista de contenidos
      redirectToContent
    };
  },
  methods: {
    async fetchContents() {
      try {
        const response = await apiClient.get(`/contents/?group=${this.id}`);
        this.contents = response.data;
      } catch (error) {
        console.error('Error fetching contents:', error);
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
    this.fetchContents();
  },
});
</script>

