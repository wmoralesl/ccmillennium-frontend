<template>
  <div v-if="content">
    
    <a @click="returnList" class="back-link">← Regresar al listado</a>

    <div  class="content-card">
      <header class="content-header">
        <h2 class="content-title">{{ content.title }}</h2>
        <span class="due-date">{{ formatDate(content.created_at) }}</span>
      </header>

      <p class="content-description">{{ content.description }}</p>

      <div class="content-details">
        <div class="content-item">
          <strong>Módulo:</strong> <span>{{ content.module_name }}</span>
        </div>

      
      </div>

      <a :href="content.file" target="_blank" class="download-link" v-if="content.file">
        Descargar archivo
      </a>

      <!-- Componente de formulario para la entrega -->

    </div>
     
    </div>
    
    <div v-else class="loading">
      <p>Cargando contenido...</p>
    </div>

</template>


<script lang="ts">
import { defineComponent } from 'vue';
import apiClient from '@/api';
import router from '@/router';

export default defineComponent({
  components: {

  },
  props: {
    contentID: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      content: null as { 
        id: number; 
        title: string; 
        description: string; 
        created_at: string; 
        file?: string; 
        module_name: string;
        group: number;
      } | null,
    };
  },
  methods: {
    // Redirige al listado
    returnList() {
      router.push({ name: 'listarcontenido' });
    },

    // Obtiene los detalles del contenido por ID
    async fetchContent() {
      try {
        const response = await apiClient.get(`/contents/${this.contentID}/`);
        this.content = response.data;
      } catch (error) {
        console.error('Error al obtener el contenido:', error);
      }
    },

    // Formatea la fecha para mostrarla en formato legible
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
    this.fetchContent();
  },
});
</script>

<style scoped>
/* Contenedor principal */


/* Enlace de regreso */
.back-link {
  color: #007bff; /* Azul del enlace */
  text-decoration: none;
  font-size: 14px;
  margin-bottom: 20px;
  display: inline-block;
  transition: color 0.3s ease; /* Transición suave */
}

.back-link:hover {
  color: #0056b3; /* Color más oscuro en hover */
}

/* Tarjeta de contenido */
.content-card {
  background-color: #ffffff; /* Fondo blanco */
  padding: 20px;
  border-radius: 8px; /* Esquinas redondeadas */
  box-shadow: 0 1px 5px rgba(0, 0, 0, 0.1); /* Sombra */
}

/* Encabezado de contenido */
.content-header {
  display: flex;
  justify-content: space-between; /* Espaciado entre título y fecha */
  align-items: center; /* Alinear verticalmente */
  margin-bottom: 15px;
}

.content-title {
  font-size: 24px; /* Tamaño del título */
  color: #333; /* Color oscuro */
  margin: 0; /* Sin margen */
}

/* Fecha de entrega */
.due-date {
  font-size: 14px;
  color: #666; /* Color gris */
}

/* Descripción */
.content-description {
  font-size: 16px; /* Tamaño de la descripción */
  color: #444; /* Color más suave */
  margin-bottom: 20px;
}

/* Detalles del contenido */
.content-details {
  margin-top: 20px;
  border-top: 1px solid #eaeaea; /* Línea de separación */
  padding-top: 15px; /* Padding superior */
}

.content-item {
  font-size: 14px; /* Tamaño del texto */
  color: #333; /* Color oscuro */
  margin-bottom: 8px; /* Espaciado inferior */
}

/* Enlace de descarga */
.download-link {
  display: inline-block; /* Mostrar como bloque */
  margin-top: 20px; /* Espaciado superior */
  color: #28a745; /* Color verde */
  text-decoration: none;
  font-weight: bold; /* Negrita */
  padding: 8px 15px; /* Padding */
  border: 1px solid #28a745; /* Borde */
  border-radius: 5px; /* Esquinas redondeadas */
  transition: background-color 0.3s ease, color 0.3s ease; /* Transiciones suaves */
}

.download-link:hover {
  background-color: #28a745; /* Fondo verde en hover */
  color: white; /* Texto blanco */
}

/* Mensaje de carga */
.loading {
  text-align: center;
  font-size: 16px;
  color: #666; /* Color gris */
  margin-top: 20px; /* Espaciado superior */
}
</style>
