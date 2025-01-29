<template>
  <div class="container">
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
  <select
    v-model="payment.month_paid"
    required
    class="form-control"
    id="month_paid"
  >
    <option value="" disabled>Selecciona el mes</option>
    <option value="1">Enero</option>
    <option value="2">Febrero</option>
    <option value="3">Marzo</option>
    <option value="4">Abril</option>
    <option value="5">Mayo</option>
    <option value="6">Junio</option>
    <option value="7">Julio</option>
    <option value="8">Agosto</option>
    <option value="9">Septiembre</option>
    <option value="10">Octubre</option>
    <option value="11">Noviembre</option>
    <option value="12">Diciembre</option>
  </select>
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

.container{
  width: 600px;
  margin: 0 auto;
}
h2 {
  font-size: 24px; /* Tamaño del encabezado */
  margin-bottom: 20px; /* Espacio inferior */
  color: #333; /* Color del texto */
}

/* Estilo para los enlaces */
a {
  font-size: 14px; /* Tamaño de fuente */
  color: #007bff; /* Color del enlace */
  text-decoration: none; /* Sin subrayado */
}

a:hover {
  text-decoration: underline; /* Subrayado en hover */
}

/* Estilos para los grupos de formulario */
.form-group {
  margin-bottom: 16px; /* Espacio inferior entre campos */
}

/* Estilos para las etiquetas de los campos */
label {
  display: block; /* Hacer que las etiquetas ocupen todo el ancho */
  margin-bottom: 8px; /* Espacio inferior */
  font-weight: 600; /* Negrita */
  color: #555; /* Color de la etiqueta */
}

/* Estilos para los inputs y textarea */
input[type="text"],
input[type="datetime-local"],
input[type="number"],
input[type="tel"],
input[type="file"],
input[type="date"],
input[type="email"],
textarea,
select {
  width: 100%; /* Ancho completo */
  padding: 10px; /* Espaciado interno */
  border: 1px solid #ccc; /* Borde sutil */
  border-radius: 4px; /* Bordes redondeados */
  font-size: 16px; /* Tamaño de fuente */
  transition: border-color 0.3s; /* Transición suave para el borde */
}

input[type="text"]:focus,
input[type="datetime-local"]:focus,
input[type="number"]:focus,
textarea:focus,
select:focus {
  border-color: #007bff; /* Cambio de color del borde al enfocar */
  outline: none; /* Sin borde de enfoque */
}

/* Estilos para el botón */
button[type="submit"] {
  padding: 10px 15px; /* Espaciado interno */
  background-color: #007bff; /* Color de fondo */
  color: #fff; /* Color del texto */
  border: none; /* Sin borde */
  border-radius: 4px; /* Bordes redondeados */
  cursor: pointer; /* Cursor tipo puntero */
  font-size: 16px; /* Tamaño de fuente */
  transition: background-color 0.3s; /* Transición suave para el fondo */
}

button[type="submit"]:hover {
  background-color: #0056b3; /* Color más oscuro al hacer hover */
}

/* Estilos para el campo de archivo */
input[type="file"] {
  margin-top: 8px; /* Espacio superior */
}
</style>