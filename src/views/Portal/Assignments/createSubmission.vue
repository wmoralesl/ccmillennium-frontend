<template>
  <a-form @submit.prevent="submitAssignment" class="assignment-form">
    <a-form-item :label-col="{ span: 6 }" :wrapper-col="{ span: 14 }">
      <a-upload-dragger
        :file-list="fileList"
        :before-upload="beforeUpload"
        :on-change="handleFileChange"
        accept=".pdf, .doc, .docx, .ppt, .pptx" 
      >
        <p class="ant-upload-drag-icon">
          <a-icon type="inbox" />
        </p>
        <p class="ant-upload-text">Haz clic o arrastra el archivo a esta área para cargarlo</p>
        <p class="ant-upload-hint">Soporta solo archivos .pdf, .doc, .docx, .ppt, .pptx</p>
      </a-upload-dragger>
    </a-form-item>

    <a-form-item >
      <a-button type="primary" html-type="submit">Entregar Tarea</a-button>
    </a-form-item>
  </a-form>
</template>

<script>
import axios from 'axios';
import { ref, computed } from 'vue';
import { useStore } from 'vuex';
import { Upload, Icon } from 'ant-design-vue'; // Importar componentes de antd

export default {
  components: {
    'a-upload-dragger': Upload.Dragger,
    'a-icon': Icon,
  },
  props: {
    assignmentID: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const store = useStore();
    const studentId = computed(() => store.getters.getUser?.id); // Obtener el ID del estudiante desde el store
    const fileList = ref([]); // Lista de archivos

    // Validar el archivo antes de cargarlo
    const beforeUpload = (file) => {
      const isValidFile = file.type === 'application/pdf' || 
                          file.type === 'application/msword' || 
                          file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
                          file.type === 'application/vnd.ms-powerpoint' || 
                          file.type === 'application/vnd.openxmlformats-officedocument.presentationml.presentation';
      if (!isValidFile) {
        alert('Solo se permiten archivos .pdf, .doc, .docx, .ppt, .pptx');
      }
      return isValidFile; // Retornar false para bloquear la carga
    };

    // Manejar el cambio de archivos
    const handleFileChange = (info) => {
      fileList.value = info.fileList.slice(-1); // Mantener solo el último archivo cargado
    };

    // Enviar la entrega al backend
    const submitAssignment = async () => {
      if (fileList.value.length === 0) {
        alert("Por favor, selecciona un archivo.");
        return;
      }

      const formData = new FormData();
      formData.append("file", fileList.value[0].originFileObj); // Obtener el archivo desde la lista
      formData.append("assignment", props.assignmentID); // ID de la tarea
      formData.append("student", studentId.value);       // ID del estudiante

      try {
        const response = await axios.post("http://localhost:8000/api/submissions/", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        console.log("Entrega exitosa:", response.data);
      } catch (error) {
        console.error("Error al entregar la tarea:", error);
      }
    };

    return {
      fileList,
      beforeUpload,
      handleFileChange,
      submitAssignment,
    };
  },
};
</script>

<style scoped>
.assignment-form {
  max-width: 600px; /* Ancho máximo del formulario */
  margin: 20px auto; /* Centrar el formulario */
}

.ant-upload-drag-icon {
  font-size: 24px;
}

.ant-upload-dragger {
  border: 1px dashed #d9d9d9;
  background: #fafafa;
  padding: 20px;
  text-align: center;
}
</style>
