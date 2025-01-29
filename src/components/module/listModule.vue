<template>
  <div>
    <h3>Lista de Módulos</h3>
    <a-list
      :loading="initLoading"
      :data-source="filteredModules"
      size="small"
      class="container"
    >
      <template #renderItem="{ item: module }">
        <a-list-item :key="module.id">
          {{ module.name }}
          <template #actions>
            <a-space>
              <a-button @click="editModule(module)" type="primary">
                Editar
              </a-button>
              <a-button @click="showDeleteConfirm(module.id)" type="danger">
                Eliminar
              </a-button>
            </a-space>
          </template>
        </a-list-item>
      </template>
    </a-list>

    <a-button type="primary" @click="showModal" style="margin-top: 16px;">
      Crear Nuevo Módulo
    </a-button>

    <a-modal
  v-model:open="isModalVisible"
  :title="isEditMode ? 'Editar Módulo' : 'Crear Nuevo Módulo'"
  @ok="isEditMode ? updateModule() : createModule()"
  @cancel="handleCancel"
>
  <form>
    <div>
      <label for="name">Nombre:</label>
      <input type="text" v-model="module.name" required />
    </div>

    <div hidden>
      <label for="course">ID del Curso:</label>
      <input
        type="number"
        v-model="module.course"
        required
        :readonly="isEditMode"
        :value="courseId"
      />
    </div>
  </form>
</a-modal>

    <a-modal
      v-model:open="isDeleteModalVisible"
      title="Confirmación de Eliminación"
      ok-text="Sí"
      cancel-text="No"
      @ok="confirmDelete"
      @cancel="handleDeleteCancel"
    >
      <p>¿Estás seguro de que deseas eliminar este módulo?</p>
    </a-modal>
  </div>
</template>

<script lang="ts">
/* eslint-disable */
import { defineComponent, ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import apiClient from '@/api';
import { message } from 'ant-design-vue';

export default defineComponent({
  props: {
    courseId: {
      type: Number,
      required: true,
    },
  },
  setup(props) {
    const modules = ref<any[]>([]);
    const router = useRouter();
    const isModalVisible = ref(false);
    const isEditMode = ref(false);
    const isDeleteModalVisible = ref(false);
    const selectedModuleId = ref<number | null>(null);
    const initLoading = ref(true);
    const module = ref<{ name: string; course: number | null }>({ name: '', course: null });

    const fetchModules = async () => {
      try {
        const response = await apiClient.get('/modules/');
        modules.value = response.data;
        initLoading.value = false;
      } catch (error) {
        console.error('Error fetching modules:', error);
        initLoading.value = false;
      }
    };

    const deleteModule = async (id: number) => {
      try {
        await apiClient.delete(`/modules/${id}/`);
        modules.value = modules.value.filter(module => module.id !== id);
        message.success('Módulo eliminado correctamente.');
      } catch (error) {
        console.error('Error deleting module:', error);
      }
    };

    const createModule = async () => {
      try {
        // Accede a props correctamente
        if (!module.value.course) {
          module.value.course = props.courseId; // Asigna el ID del curso desde props
        }

        const response = await apiClient.post('/modules/', module.value);
        if (response.status === 201) {
          modules.value.push(response.data);
          message.success(`El módulo "${module.value.name}" se ha creado correctamente.`);
        } else {
          message.error(`Hubo un problema al crear el módulo "${module.value.name}".`);
        }
      } catch (error) {
        console.error('Error al crear el módulo:', error);
        message.error('Hubo un problema al conectar con el servidor. Por favor, inténtelo más tarde.');
      } finally {
        isModalVisible.value = false; // Cierra el modal después de la creación
        resetForm(); // Resetea el formulario
      }
    };

    const resetForm = () => {
      module.value = { name: '', course: null }; // Limpia los valores del formulario
      isEditMode.value = false; // Restablece el modo de creación
    };

    const editModule = (moduleToEdit: any) => {
      module.value = { name: moduleToEdit.name, course: moduleToEdit.course };
      selectedModuleId.value = moduleToEdit.id;
      isEditMode.value = true;
      isModalVisible.value = true;
    };

    const updateModule = async () => {
      try {
        const response = await apiClient.put(`/modules/${selectedModuleId.value}/`, module.value);
        if (response.status === 200) {
          const index = modules.value.findIndex(m => m.id === selectedModuleId.value);
          modules.value[index] = response.data;
          message.success(`El módulo "${module.value.name}" se ha actualizado correctamente.`);
        } else {
          throw new Error('Error al actualizar el módulo');
        }
      } catch (error) {
        console.error(error);
        message.error('Error al actualizar el módulo.');
      } finally {
        isModalVisible.value = false; // Cierra el modal después de la actualización
        isEditMode.value = false; // Resetea el modo de edición
        module.value = { name: '', course: null }; // Resetea los datos del módulo
      }
    };

    const showModal = () => {
      isEditMode.value = false; // Modo de creación
      module.value = { name: '', course: null }; // Resetea los datos del módulo
      isModalVisible.value = true;
    };

    const showDeleteConfirm = (id: number) => {
      selectedModuleId.value = id;
      isDeleteModalVisible.value = true;
    };

    const confirmDelete = () => {
      if (selectedModuleId.value !== null) {
        deleteModule(selectedModuleId.value);
      }
      isDeleteModalVisible.value = false;
    };

    const handleCancel = () => {
      isModalVisible.value = false;
      isEditMode.value = false; // Resetea el modo de edición
      module.value = { name: '', course: null }; // Resetea los datos del módulo
    };

    const handleDeleteCancel = () => {
      isDeleteModalVisible.value = false;
    };

    const filteredModules = computed(() => {
      return modules.value.filter(module => module.course === props.courseId);
    });

    onMounted(fetchModules);

    return {
      filteredModules,
      isModalVisible,
      isEditMode,
      showModal,
      editModule,
      updateModule,
      createModule,
      deleteModule,
      isDeleteModalVisible,
      showDeleteConfirm,
      confirmDelete,
      handleCancel,
      handleDeleteCancel,
      initLoading,
      module,
    };
  },
});
</script>

<style scoped>

</style>
