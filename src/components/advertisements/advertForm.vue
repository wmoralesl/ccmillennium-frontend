<template>
  <div class="announcement-form">
    
    <a-form :model="form" @submit.prevent="handleSubmit">
      <a-form-item
      >
      <a-textarea
          v-model:value="form.description"
          placeholder="Ingrese la descripción del anuncio"
          :auto-size="{ minRows: 5, maxRows: 5 }"
          :rules="[{ required: true, message: 'Por favor ingrese una descripción' }]"
        />
      </a-form-item>
      
      <a-form-item>
        <a-button type="primary" html-type="submit">Crear Anuncio</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import apiClient from '@/api';

export default defineComponent({
  props: {
    teacherId: {
      type: Number,
      required: true,
    },
    groupId: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      form: {
        description: '',
      },
    };
  },
  methods: {
    async handleSubmit() {
      if (!this.form.description.trim()) {
        console.error('La descripción no puede estar vacía');
        return; // Evitar envío si la descripción está vacía
      }

      try {
        await apiClient.post('/advertisements/', {
          description: this.form.description,
          teacher: this.teacherId,
          group: this.groupId,
        });
        this.$emit('announcement-created'); // Emitir evento para que el padre sepa que se creó el anuncio
        this.form.description = ''; // Reiniciar el campo después de enviar
      } catch (error) {
        console.error('Error al crear el anuncio:', error);
        // Aquí puedes manejar el error, como mostrar un mensaje al usuario
      }
    },
  },
});
</script>

