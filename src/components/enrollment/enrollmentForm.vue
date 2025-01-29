<template>
  <div class="container">
    <h2>Asignar Estudiante a Grupo</h2>
    <form @submit.prevent="submitAssignment">
      <div class="form-group">
        <label for="student">Selecciona Estudiante:</label>
        <select v-model="selectedStudent" required>
          <option value="" disabled>Seleccione un estudiante</option>
          <option v-for="student in students" :key="student.id" :value="student.id">
            {{ student.first_name }} {{ student.last_name }} {{ student.second_last_name }} 
          </option>
        </select>
      </div>
      <div class="form-group">
        <label for="group">Selecciona Grupo:</label>
        <select v-model="selectedGroup" @change="updatePrice" required>
          <option value="" disabled>Seleccione un grupo</option>
          <option v-for="group in groups" :key="group.id" :value="group.id">
            {{ group.name }}
          </option>
        </select>
      </div>
      <div class="form-group">
      <label for="price">Monto de Inscripción:</label>
      <p v-if="price">Q {{ price }} - {{ course }}</p>
      <p v-else>No disponible</p>
    </div>
      <button type="submit">Asignar</button>
    </form>
  </div>
</template>

<script lang="ts">
/* eslint-disable */
import { defineComponent, ref, onMounted } from 'vue';
import { useRouter } from 'vue-router'; // Importa el router
import apiClient from '@/api';
import { message } from 'ant-design-vue';

export default defineComponent({
  setup() {
    const selectedStudent = ref<string>("");
    const selectedGroup = ref<string>("");
    const students = ref<any[]>([]);
    const groups = ref<any[]>([]);
    const price = ref<string | null>(null);
    const course = ref<string | null>(null);
    const router = useRouter(); // Instancia el router

    const fetchStudents = async () => {
      try {
        const response = await apiClient.get("/users/");
        students.value = response.data.filter((user: any) => user.role === 'student');
      } catch (error) {
        console.error("Error al cargar estudiantes:", error);
      }
    };

    const fetchGroups = async () => {
      try {
        const response = await apiClient.get("/groups/");
        groups.value = response.data;
      } catch (error) {
        console.error("Error al cargar grupos:", error);
      }
    };

    const updatePrice = async () => {
      if (!selectedGroup.value) return;

      try {
        const response = await apiClient.get(`/groups/${selectedGroup.value}/`);
        const group = response.data;

        if (group.course) {
          const courseResponse = await apiClient.get(`/courses/${group.course}/`);
          const courseData = courseResponse.data;
          price.value = courseData.enrollment_fee; // Asigna la tarifa de inscripción
          course.value = courseData.name; // Asigna el nombre del curso
        } else {
          price.value = null;
          course.value = null;
        }
      } catch (error) {
        console.error("Error al cargar el curso:", error);
        price.value = null;
        course.value = null;
      }
    };

    const submitAssignment = async () => {
      try {
        const payload = {
          student: selectedStudent.value,
          group: selectedGroup.value,
          mount: price.value ? parseFloat(price.value) : 0.0,
        };
        const response = await apiClient.post("/enrollments/", payload);
        
        if (response.status === 201) {
          const newEnrollmentId = response.data.id;
          message.success("Estudiante asignado al grupo exitosamente.");
          selectedStudent.value = "";
          selectedGroup.value = "";
          price.value = null;
          // Redirige a la vista de detalles de la asignación
          router.push({ name: 'DetallesAsignacion', params: { id: newEnrollmentId } });
        } else {
          throw new Error("Error al asignar estudiante al grupo.");
        }
      } catch (error: any) {
        if (error.response && error.response.data && error.response.data.detail) {
          alert(error.response.data.detail);
        } else {
          alert("Ocurrió un error al asignar el estudiante al grupo.");
        }
      }
    };

    onMounted(() => {
      fetchStudents();
      fetchGroups();
    });

    return {
      selectedStudent,
      selectedGroup,
      students,
      groups,
      price,
      course,
      submitAssignment,
      updatePrice,
    };
  },
});
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