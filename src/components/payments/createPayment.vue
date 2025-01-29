<template>
  <div>
    <h2>Registrar Pago</h2>
    <form @submit.prevent="createPayment">
      <div class="form-group">
        <label for="enrollment">Inscripción:</label>
        <select v-model="payment.enrollment" required class="form-control" id="enrollment">
          <option v-for="enrollment in enrollments" :key="enrollment.id" :value="enrollment.id">
            {{ enrollment.student_full_name }} - {{ enrollment.group_name }}
          </option>
        </select>
      </div>
      
      <div class="form-group">
        <label for="month_paid">Mes Pagado:</label>
        <input
          type="number"
          v-model="payment.month_paid"
          min="1"
          required
          class="form-control"
          id="month_paid"
        />
      </div>

      <div class="form-group">
        <label for="amount">Monto:</label>
        <input
          type="number"
          v-model="payment.amount"
          required
          class="form-control"
          id="amount"
          step="0.01"
        />
      </div>

      <div class="form-group">
        <label for="description">Descripción:</label>
        <textarea
          v-model="payment.description"
          class="form-control"
          id="description"
          rows="3"
        ></textarea>
      </div>

      <button type="submit" class="btn btn-primary">Registrar Pago</button>
    </form>
  </div>
</template>

<script>
import apiClient from '@/api'; // Asegúrate de que la ruta a apiClient es correcta

export default {
  data() {
    return {
      payment: {
        enrollment: null,
        month_paid: null,
        amount: null,
        description: '',
      },
      enrollments: [], // Array para almacenar las inscripciones
    };
  },
  async mounted() {
    // Obtener las inscripciones para llenar el select
    try {
      const response = await apiClient.get('/enrollments/');
      this.enrollments = response.data;
    } catch (error) {
      console.error('Error al cargar las inscripciones:', error);
    }
  },
  methods: {
    async createPayment() {
  try {
    const response = await apiClient.post('/payments/', this.payment); // Realiza la solicitud POST
    const createdPaymentId = response.data.id; // Extrae el ID del pago recién creado desde la respuesta
    this.$router.push({ name: 'viewPayment', params: { id: createdPaymentId } }); // Redirige a la página de detalles del pago
  } catch (error) {
    console.error('Error al crear el pago:', error);
  }
},
  },
};
</script>

<style scoped>
/* Estilos opcionales */
</style>
