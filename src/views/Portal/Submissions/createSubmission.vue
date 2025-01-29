<template>

  <a-form @submit.prevent="submitAssignment" class="assignment-form">
    <a-form-item :label-col="{ span: 6 }" :wrapper-col="{ span: 14 }">
      <a-upload-dragger
        :file-list="fileList"
        :before-upload="beforeUpload"
        :on-change="handleFileChange"
        accept=".pdf, .doc, .docx, .ppt, .pptx"
      >
        <p class="ant-upload-drag-icon"></p>
        <p class="ant-upload-text">Haz clic o arrastra el archivo a esta área para cargarlo</p>
        <p class="ant-upload-hint">Soporta solo archivos .pdf, .doc, .docx, .ppt, .pptx</p>
      </a-upload-dragger>
    </a-form-item>

    <a-form-item>
      <a-button type="primary" html-type="submit">Entregar Tarea</a-button>
    </a-form-item>
  </a-form>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue';
import { useStore } from 'vuex';
import apiClient from '@/api';
import { Upload, message } from 'ant-design-vue';

export default defineComponent({
  emits: ['submissionCompleted'],  // Declara el evento aquí
  components: {
    'a-upload-dragger': Upload.Dragger,
  },
  props: {
    assignmentId: {
      type: String,
      required: true,
    },
  },
  setup(props, { emit }) {  // Añade 'emit' en la función setup
    const store = useStore();
    const studentId = computed(() => store.getters.getUser?.id);
    const fileList = ref([] as any[]);

    const beforeUpload = (file: File) => {
      const isValidFile = 
        file.type === 'application/pdf' || 
        file.type === 'application/msword' || 
        file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
        file.type === 'application/vnd.ms-powerpoint' || 
        file.type === 'application/vnd.openxmlformats-officedocument.presentationml.presentation';

      if (!isValidFile) {
        message.error('Solo se permiten archivos .pdf, .doc, .docx, .ppt, .pptx');
      }
      return isValidFile;
    };

    const handleFileChange = (info: any) => {
      fileList.value = info.fileList.slice(-1);
    };

    const submitAssignment = async () => {
      if (!props.assignmentId || !studentId.value) {
        message.error("Falta información necesaria para la entrega.");
        return;
      }

      if (fileList.value.length === 0) {
        message.error("Por favor, selecciona un archivo.");
        return;
      }

      const formData = new FormData();
      formData.append("file", fileList.value[0].originFileObj);
      formData.append("assignment", props.assignmentId);
      formData.append("student", studentId.value);

      try {
        const response = await apiClient.post("/submissions/", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        message.success("Entrega realizada con éxito.");
        emit('submissionCompleted');  // Emite el evento al completar la entrega
        console.log("Entrega exitosa:", response.data);
      } catch (error) {
        message.error("Error al entregar la tarea. Inténtalo de nuevo.");
        console.error("Error al entregar la tarea:", error);
      }
    };

    return {
      fileList,
      beforeUpload,
      handleFileChange,
      submitAssignment,
      studentId,
    };
  },
});
</script>

<style scoped>
.assignment-form {
  max-width: 600px;
  margin: 20px auto;
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
