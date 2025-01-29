<template>
  <div class="assignment-form">
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
          alert("Estudiante asignado al grupo exitosamente.");
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
