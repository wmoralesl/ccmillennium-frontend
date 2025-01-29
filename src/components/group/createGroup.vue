<template>
  <div>
    <h1>Crear Nuevo Grupo</h1>
    <form @submit.prevent="createGrupo">
      <div>
        <label for="name">Nombre:</label>
        <input type="text" v-model="grupo.name" required />
      </div>

      <div>
        <label for="teacher">Profesor:</label>
        <select v-model="grupo.teacher" required>
          <option v-for="profesor in profesores" :key="profesor.id" :value="profesor.id">
            {{ profesor.first_name }}
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

      <!-- <div>
        <label for="is_visible">Visible:</label>
        <input type="checkbox" v-model="grupo.is_visible" />
      </div>

      <div>
        <label for="is_active">Activo:</label>
        <input type="checkbox" v-model="grupo.is_active" />
      </div> -->

      <div>
        <label for="course">Curso:</label>
        <select v-model="grupo.course" required>
          <option v-for="curso in cursos" :key="curso.id" :value="curso.id">
            {{ curso.name }}
          </option>
        </select>
      </div>

      <button type="submit">Crear Grupo</button>
    </form>
  </div>
</template>

<script lang="ts">
/* eslint-disable */
import { defineComponent, ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

export default defineComponent({
  setup() {
    const grupo = ref({
      name: '',
      year: null,
      in_person: false,
      start_date: null,
      end_date: null,
      schedule: null,
      hours_count: null,
      is_visible: true,
      is_active: true,
      teacher: null,
      course: null,
    });
    const profesores = ref<any[]>([]);
    const cursos = ref<any[]>([]);
    const router = useRouter();

    onMounted(async () => {
      await fetchProfesores();
      await fetchCursos();
    });

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

    const createGrupo = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/groups/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(grupo.value),
        });
        if (response.ok) {
          router.push('/grupos');
        } else {
          throw new Error('Error al crear grupo');
        }
      } catch (error) {
        console.error(error);
      }
    };

    return { grupo, profesores, cursos, createGrupo };
  },
});
</script>
