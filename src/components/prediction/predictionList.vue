<template>
  <div>
    <h1 style="text-align: center;">Predicciones</h1>
    <a-tabs>
      <a-tab-pane key="1" tab="Pendientes">
        <div class="predictions-container">
          <PredictionCard
            v-for="prediction in predictionsPendientes"
            :key="prediction.id"
            :prediction="prediction"
            @update-accepted="handleAcceptedUpdate"
            @update-reviewed="handleReviewedUpdate"
          />
        </div>
      </a-tab-pane>
      <a-tab-pane key="2" tab="Aceptados">
        <DownloadButton/>
        <div class="predictions-container">
          <PredictionCard
            v-for="prediction in predictionsAceptados"
            :key="prediction.id"
            :prediction="prediction"
            @update-accepted="handleAcceptedUpdate"
            @update-reviewed="handleReviewedUpdate"
          />
        </div>
      </a-tab-pane>
      <a-tab-pane key="3" tab="Rechazados">
        <div class="predictions-container">
          <PredictionCard
            v-for="prediction in predictionsRechazados"
            :key="prediction.id"
            :prediction="prediction"
            @update-accepted="handleAcceptedUpdate"
            @update-reviewed="handleReviewedUpdate"
          />
        </div>
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import apiClient from '@/api';
import PredictionCard from '@/components/prediction/predictionCard.vue';
import  DownloadButton from '@/components/prediction/downloadButton.vue'

interface Prediction {
  id: number;
  is_reviewed: boolean;
  is_acepted: boolean;
}

export default defineComponent({
  components: {
    PredictionCard,
    DownloadButton
  },
  setup() {
    const predictionsPendientes = ref<Prediction[]>([]);
    const predictionsAceptados = ref<Prediction[]>([]);
    const predictionsRechazados = ref<Prediction[]>([]);
    const allPredictions = ref<Prediction[]>([]);

    const fetchPredictions = async () => {
      try {
        const response = await apiClient.get('/predictions/');
        allPredictions.value = response.data.map((prediction: any) => ({
          ...prediction,
          is_reviewed: prediction.is_reviewed === 'true' || prediction.is_reviewed === true,
          is_acepted: prediction.is_acepted === 'true' || prediction.is_acepted === true
        }));
        updatePredictionsLists();
      } catch (error) {
        console.error('Error al cargar las predicciones:', error);
      }
    };

    const updatePredictionsLists = () => {
      predictionsPendientes.value = allPredictions.value.filter(p => !p.is_reviewed);
      predictionsAceptados.value = allPredictions.value.filter(p => p.is_reviewed && p.is_acepted);
      predictionsRechazados.value = allPredictions.value.filter(p => p.is_reviewed && !p.is_acepted);
    };

    const handleAcceptedUpdate = ({ id, is_acepted }: { id: number; is_acepted: boolean }) => {
      const prediction = allPredictions.value.find(p => p.id === id);
      if (prediction) {
        prediction.is_acepted = is_acepted;
        updatePredictionsLists();
      }
    };

    const handleReviewedUpdate = ({ id, is_reviewed }: { id: number; is_reviewed: boolean }) => {
      const prediction = allPredictions.value.find(p => p.id === id);
      if (prediction) {
        prediction.is_reviewed = is_reviewed;
        updatePredictionsLists();
      }
    };

    onMounted(() => {
      fetchPredictions();
    });

    return {
      predictionsPendientes,
      predictionsAceptados,
      predictionsRechazados,
      handleAcceptedUpdate,
      handleReviewedUpdate,
      DownloadButton
    };
  }
});
</script>

<style scoped>
.predictions-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}
</style>
