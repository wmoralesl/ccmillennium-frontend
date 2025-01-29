<template>
  <div class="container">
    <h1>Crear Nuevo Grupo</h1>
    <form @submit.prevent="createGrupo">
      <div class="form-group">
        <label for="name">Nombre:</label>
        <input type="text" v-model="grupo.name" required />
      </div>

      <div class="form-group">
        <label for="teacher">Profesor:</label>
        <select v-model="grupo.teacher" required>
          <option v-for="profesor in profesores" :key="profesor.id" :value="profesor.id">
            {{ profesor.first_name }} {{ profesor.last_name }} {{ profesor.second_last_name }}
          </option>
        </select>
      </div>

      <div class="form-group">
        <label for="year">Año:</label>
        <input type="number" v-model="grupo.year" required />
      </div>

      <div class="form-group">
        <label for="start_date">Inicio:</label>
        <input type="date" v-model="grupo.start_date" required />
      </div>

      <div class="form-group">
        <label for="end_date">Fin:</label>
        <input type="date" v-model="grupo.end_date" required />
      </div>

      <div class="form-group">
        <label for="schedule">Horario:</label>
        <input type="time" v-model="grupo.schedule" required />
      </div>

      <div class="form-group">
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

      <div class="form-group">
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
      in_person: true,
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
input[type="time"],
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