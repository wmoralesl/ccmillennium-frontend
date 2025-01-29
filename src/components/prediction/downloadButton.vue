<template>
    <div style="text-align: center;">
      <a-button @click="downloadAcceptedImages">Descargar Imágenes <FileZipOutlined /></a-button>
    </div>
  </template>
  
  <script lang="ts" setup>
  import apiClient from '@/api';  // Usa tu configuración de cliente API
  import { FileZipOutlined } from '@ant-design/icons-vue';
  
  // Función para descargar las imágenes aceptadas y revisadas
  const downloadAcceptedImages = async () => {
    try {
      // Hacer la solicitud para descargar el archivo ZIP
      const response = await apiClient.get('/download-accepted-images/', {
        responseType: 'blob', // Especificar que la respuesta es un blob
      });
  
      // Crear un enlace para la descarga del archivo
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'imagenes_aceptadas.zip'); // Nombre del archivo a descargar
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error al descargar el archivo ZIP:', error);
    }
  };
  </script>
  
  <style scoped>
  </style>
  