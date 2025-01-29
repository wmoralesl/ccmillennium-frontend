<template>
  <a @click="returnList()">← Regresar al listado</a>
  <div class="container">
    <h2>Crear tarea</h2>
    <form @submit.prevent="submitForm" enctype="multipart/form-data">
      <div class="form-group">
        <label for="title">Título</label>
        <input type="text" v-model="form.title" required />
      </div>
      <div class="form-group">
        <label for="description">Descripción</label>
        <textarea v-model="form.description" required></textarea>
      </div>
      <div class="form-group">
        <label for="due_date">Fecha de entrega</label>
        <input type="datetime-local" v-model="form.due_date" required />
      </div>
      <div class="form-group">
        <label for="module">Módulo</label>
        <select v-model="form.module" required>
          <option disabled value="">Selecciona un módulo</option>
          <option v-for="module in modules" :key="module.id" :value="module.id">
            {{ module.name }}
          </option>
        </select>
      </div>
      <div class="form-group">
        <label for="file">Archivo</label>
        <input type="file" @change="handleFileUpload" />
      </div>

      <div class="form-group">
        <label for="grade">Calificación</label>
        <input type="number" v-model="form.grade" />
      </div>

      <button type="submit">Guardar</button>
    </form>
  </div>
</template>

<script>
import apiClient from '@/api';
import router from '@/router';
export default {
  props: {
    assignment: Object,
    id: {
      type: String,
      required: true
    }
  },
  data() {
    const returnList = () => {
        router.push({ name: 'listartareas'});
        };
    
    return {
      form: {
        title: '',
        description: '',
        due_date: '',
        grade: null,
        module: null,
        file: null // Para almacenar el archivo
      },
      modules: [], // Para almacenar los módulos del grupo
      returnList
    };
  },
  watch: {
    id: {
      immediate: true,
      handler(newGroupId) {
        if (newGroupId) {
          this.fetchModules(newGroupId);
        }
      }
    },
  },
  methods: {
    resetForm() {
      this.form = {
        title: '',
        description: '',
        due_date: '',
        grade: null,
        module: null,
        file: null // Resetea el archivo
      };
    },
    async fetchModules(id) {
      try {
        const response = await apiClient.get(`/groups/${id}/modules/`);
        this.modules = response.data;
      } catch (error) {
        console.error('Error fetching modules:', error);
      }
    },
    handleFileUpload(event) {
      const file = event.target.files[0];
      this.form.file = file; // Almacena el archivo seleccionado en el formulario
    },
    async submitForm() {
      const formData = new FormData();
      formData.append('title', this.form.title);
      formData.append('description', this.form.description);
      formData.append('due_date', this.form.due_date);
      formData.append('module', this.form.module);
      formData.append('group', this.id);

      if (this.form.grade !== null) {
        formData.append('grade', this.form.grade);
      }

      if (this.form.file) {
        formData.append('file', this.form.file); // Agrega el archivo al FormData
      }

      try {
          // Crear nueva asignación
          await apiClient.post('/assignments/', formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          });
        
        this.$emit('submit', formData);
        this.resetForm();
        this.returnList();
      } catch (error) {
        console.error('Error saving assignment:', error);
      }
    }
  }
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