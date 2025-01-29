<template>
    <div>
      <h2>Calificar Tarea</h2>
      <div v-if="submission">
        <p><strong>Archivo:</strong> <a :href="submission.file" target="_blank">Descargar</a></p>
        <p><strong>Fecha de Entrega:</strong> {{ submission.submitted_at }}</p>
        <p><strong>Estudiante:</strong> {{ submission.student_name }}</p>
        
        <form @submit.prevent="submitGrade">
          <div>
            <label for="grade">Calificación</label>
            <input type="number" id="grade" v-model="grade" min="0" max="100" required />
          </div>
          
          <div>
            <label for="feedback">Retroalimentación</label>
            <textarea id="feedback" v-model="feedback" placeholder="Comentarios..."></textarea>
          </div>
          
          <button type="submit">Guardar Calificación</button>
        </form>
      </div>
      <div v-else>
        <p>Cargando datos de la tarea...</p>
      </div>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    props: {
      assignmentID: {
        type: String,
        required: true,
      },
    },
    data() {
      return {
        submission: null,
        grade: null,
        feedback: "",
      };
    },
    methods: {
      async fetchSubmission() {
        try {
          const response = await axios.get(`http://localhost:8000/api/submissions/${this.assignmentID}/`);
          this.submission = response.data;
        } catch (error) {
          console.error("Error al obtener la tarea:", error);
        }
      },
      async submitGrade() {
        try {
          const response = await axios.put(`http://localhost:8000/api/submissions/${this.assignmentID}/`, {
            graded: true,
            grade: this.grade,
            feedback: this.feedback,
          });
          console.log("Calificación enviada:", response.data);
          alert("Calificación guardada con éxito.");
        } catch (error) {
          console.error("Error al enviar la calificación:", error);
          alert("Hubo un problema al guardar la calificación.");
        }
      },
    },
    mounted() {
      this.fetchSubmission();
    },
  };
  </script>
  