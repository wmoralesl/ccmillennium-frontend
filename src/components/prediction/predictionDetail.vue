<template>
    <div class="prediction-detail">
      <h2>Detalles de la Predicción</h2>
      <div v-if="prediction">
        <p><strong>ID:</strong> {{ prediction.id }}</p>
        <p><strong>Clase:</strong> {{ prediction.class_name }}</p>
        <p><strong>Valor de Predicción:</strong> {{ prediction.prediction_value }}</p>
        <p><strong>Imagen:</strong></p>
        <img :src="prediction.image" alt="Prediction Image" class="prediction-image" />
        <p><strong>Fecha de Creación:</strong> {{ formattedDate }}</p>
        <p><strong>Aceptada:</strong> {{ prediction.is_acepted ? 'Sí' : 'No' }}</p>
        <p><strong>Revisada:</strong> {{ prediction.is_reviewed ? 'Sí' : 'No' }}</p>
      </div>
      <div v-else>
        <p>Cargando detalles de la predicción...</p>
      </div>
    </div>
  </template>
  
  <script lang="ts">
  import { defineComponent, ref, onMounted } from 'vue';
  import apiClient from '@/api'; // Asegúrate de que la ruta es correcta
  
  // Define una interfaz para el tipo de datos de la predicción
  interface Prediction {
    id: number;
    class_name: string;
    prediction_value: number;
    image: string;
    created_at: string;
    is_acepted: boolean;
  }
  
  export default defineComponent({
    name: 'PredictionDetail',
    props: {
      id: {
        type: String,
        required: true
      }
    },
    setup(props) {
      const prediction = ref<Prediction | null>(null); // Define el tipo de `prediction`
      const formattedDate = ref('');
  
      const fetchPredictionDetails = async () => {
        try {
          const response = await apiClient.get(`/predictions/${props.id}/`);
          prediction.value = response.data;
  
          // Verifica que prediction.value no sea nulo
          if (prediction.value && prediction.value.created_at) {
            formattedDate.value = new Date(prediction.value.created_at).toLocaleString();
          }
        } catch (error) {
          console.error('Error al cargar los detalles de la predicción:', error);
        }
      };
  
      onMounted(() => {
        fetchPredictionDetails();
      });
  
      return {
        prediction,
        formattedDate
      };
    }
  });
  </script>
  
  <style scoped>
  .prediction-detail {
    margin: 20px;
  }
  
  .prediction-image {
    max-width: 100%;
    height: auto;
  }
  </style>
  