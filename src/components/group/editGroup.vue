<template>
  <div>
    <h1>Editar Grupo</h1>
    <form @submit.prevent="updateGrupo">
      <div v-if="grupo">
        <div>
          <label for="name">Nombre:</label>
          <input type="text" v-model="grupo.name" required />
        </div>

        <div>
          <label for="teacher">Profesor:</label>
          <select v-model="grupo.teacher" required>
            <option v-for="profesor in profesores" :key="profesor.id" :value="profesor.id">
              {{ profesor.name }}
            </option>
          </select>
        </div>

        <div>
          <label for="year">Año:</label>
          <input type="number" v-model="grupo.year" required />
        </div>

        <div>
          <label for="in_person">Presencial:</label>
          <input type="checkbox" v-model="grupo.in_person" />
        </div>

        <div>
          <label for="start_date">Inicio:</label>
          <input type="date" v-model="grupo.start_date" required />
        </div>

        <div>
          <label for="end_date">Fin:</label>
          <input type="date" v-model="grupo.end_date" required />
        </div>

        <div>
          <label for="schedule">Horario:</label>
          <input type="time" v-model="grupo.schedule" required />
        </div>

        <div>
          <label for="hours_count">Cantidad de Horas:</label>
          <input type="number" v-model="grupo.hours_count" required />
        </div>

        <div>
          <label for="is_visible">Visible:</label>
          <input type="checkbox" v-model="grupo.is_visible" />
        </div>

        <div>
          <label for="course">Curso:</label>
          <select v-model="grupo.course" required>
            <option v-for="curso in cursos" :key="curso.id" :value="curso.id">
              {{ curso.name }}
            </option>
          </select>
        </div>

        <button type="submit">Actualizar Grupo</button>
      </div>
      <div v-else>
        <p>Cargando...</p>
      </div>
    </form>
  </div>
</template>

<script lang="ts">
/* eslint-disable */
import { defineComponent, ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';

export default defineComponent({
  setup() {
    const route = useRoute();
    const router = useRouter();
    const grupo = ref<any>({
      name: '',
      teacher: null,
      year: null,
      in_person: false,
      start_date: '',
      end_date: '',
      schedule: '',
      hours_count: null,
      is_visible: false,
      course: null
    });
    const profesores = ref<any[]>([]);
    const cursos = ref<any[]>([]);

    onMounted(async () => {
      await fetchGrupo();
      await fetchProfesores();
      await fetchCursos();
    });

    const fetchGrupo = async () => {
      try {
        const response = await fetch(`http://localhost:8000/api/groups/${route.params.id}/`);
        if (!response.ok) throw new Error('Error al cargar grupo');
        grupo.value = await response.json();
      } catch (error) {
        console.error(error);
      }
    };

    const fetchProfesores = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/users/');
        if (!response.ok) throw new Error('Error al cargar profesores');
        profesores.value = (await response.json()).filter((user: any) => user.role === 'teacher');
      } catch (error) {
        console.error(error);
      }
    };

    const fetchCursos = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/courses/');
        if (!response.ok) throw new Error('Error al cargar cursos');
        cursos.value = await response.json();
      } catch (error) {
        console.error(error);
      }
    };

    const updateGrupo = async () => {
      try {
        const response = await fetch(`http://localhost:8000/api/groups/${route.params.id}/`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(grupo.value),
        });
        if (response.ok) {
          await response.json(); // Espera la respuesta para manejar cualquier mensaje del servidor
          router.push('/grupos');
        } else {
          const errorData = await response.json();
          throw new Error(errorData.detail || 'Error al actualizar grupo');
        }
      } catch (error) {
        console.error('Error al actualizar grupo:', error);
      }
    };

    return { grupo, profesores, cursos, updateGrupo };
  },
});
</script>

<style scoped>
/* Añade aquí estilos específicos si es necesario */
</style>
