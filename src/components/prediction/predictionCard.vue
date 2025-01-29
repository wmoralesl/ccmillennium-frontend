<template>
  <div class="card">
    <img @click="goToDetails" style="cursor: pointer;" :src="localPrediction.image" alt="Prediction Image" class="card-image" />
    <div class="card-content">
      <div class="header">
        <h3 class="card-title">{{ localPrediction.class_name }}</h3>
        <div class="status">
          <a-tooltip>
            <template #title>Aceptado</template>
            <a-switch
              :checked="localPrediction.is_acepted"
              :disabled="localPrediction.is_reviewed" 
              @change="toggleAccepted"
              checked-children="Si"
              un-checked-children="No"
            />
          </a-tooltip>
        </div>
      </div>

      <p class="description">Predicción: {{ localPrediction.prediction_value.toFixed(2) }}</p>
      
      <div class="review-status">
        <a-button
          :type="localPrediction.is_reviewed ? 'primary' : 'default'"
          @click="toggleReviewed"
        >
          {{ localPrediction.is_reviewed ? 'Revisado ✓✓' : 'No Revisado' }}
        </a-button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useRouter } from 'vue-router';
import apiClient from '@/api';

export default defineComponent({
  name: 'PredictionCard',
  props: {
    prediction: {
      type: Object,
      required: true
    }
  },
  emits: ['update-accepted', 'update-reviewed'],
  setup(props, { emit }) {
    const router = useRouter();
    const localPrediction = ref({ ...props.prediction });

    const goToDetails = () => {
      router.push({ name: 'PredictionDetails', params: { id: props.prediction.id } });
    };

    const toggleAccepted = async (checked: boolean) => {
      try {
        localPrediction.value.is_acepted = checked;
        await apiClient.patch(`/predictions/${props.prediction.id}/`, { is_acepted: checked });
        emit('update-accepted', { id: props.prediction.id, is_acepted: checked });
      } catch (error) {
        console.error('Error al actualizar el estado de aceptación:', error);
      }
    };

    const toggleReviewed = async () => {
      try {
        localPrediction.value.is_reviewed = !localPrediction.value.is_reviewed;
        await apiClient.patch(`/predictions/${props.prediction.id}/`, { is_reviewed: localPrediction.value.is_reviewed });
        emit('update-reviewed', { id: props.prediction.id, is_reviewed: localPrediction.value.is_reviewed });
      } catch (error) {
        console.error('Error al actualizar el estado de revisión:', error);
      }
    };

    return {
      goToDetails,
      localPrediction,
      toggleAccepted,
      toggleReviewed
    };
  }
});
</script>

<style scoped>
.card {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  overflow: hidden;
  margin: 16px;
  transition: box-shadow 0.3s;
  width: 240px;
  background-color: #ffffff;
}

.card:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}

.card-image {
  width: 100%;
  height: auto;
  border-bottom: 1px solid #e0e0e0;
}

.card-content {
  padding: 16px;
  font-family: Arial, sans-serif;
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.card-title {
  margin: 0;
  font-size: 18px;
  font-weight: bold;
  color: #333;
}

.status a-switch {
  background-color: #52c41a;
  border-color: #f5222d;
}

.description {
  margin-top: 8px;
  color: #666;
  font-size: 14px;
}

.review-status {
  margin-top: 8px;
}

.prediction-value {
  margin-top: 8px;
  font-size: 16px;
  font-weight: bold;
}
</style>
