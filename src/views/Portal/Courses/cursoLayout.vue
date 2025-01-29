<template>
  <div>
    <a-breadcrumb style="margin: 10px 0px;">
      <a-breadcrumb-item><a @click="viewCourses">Cursos</a></a-breadcrumb-item>
      <a-breadcrumb-item>Vista del curso</a-breadcrumb-item>
    </a-breadcrumb>

    <a-tabs v-model:activeKey="activeKey" type="card" @change="handleTabChange">
      <a-tab-pane key="1" tab="General">
        <GeneralCourse :id="id" />
      </a-tab-pane>
      <a-tab-pane key="2" tab="Contenido">
        <ContenidoCourse :id="id"/>
      </a-tab-pane>
      <a-tab-pane key="3" tab="Tareas">
        <TareaCourse :id="id" />
      </a-tab-pane>
      <a-tab-pane key="4" tab="Personas">
        <PersonasCourse :id="id" />
      </a-tab-pane>
      <a-tab-pane key="5" tab="Calificaciones" v-if="userRole=='teacher'">
        <Calificiones :id="id" />
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script lang="ts">
import { ref, defineComponent, computed } from 'vue';
import GeneralCourse from '@/views/Portal/Tabs/courseGeneral.vue';
import ContenidoCourse from '@/views/Portal/Tabs/courseContenido.vue';
import TareaCourse from '@/views/Portal/Tabs/courseTareas.vue';
import PersonasCourse from '@/views/Portal/Tabs/coursePersonas.vue';
import Calificiones from '@/views/Portal/Tabs/courseCalificaciones.vue'
import router from '@/router';
import { useStore } from 'vuex';
export default defineComponent({
  components: {
    GeneralCourse,
    ContenidoCourse,
    TareaCourse,
    PersonasCourse,
    Calificiones,
  },
  props: {
    id: {
      type: String,
      required: true,
    },
  },
  setup() {

    const store = useStore();
    const userRole = computed(() => store.getters.getUser?.role);
    const activeKey = ref('1');

    const viewCourses = () => {
      router.push({ name: 'home' });
    };

    const goContent = () => {
      router.push({ name: 'listarcontenido' });
    };
    const goTareas = () => {
      router.push({ name: 'listartareas' });
    };
    const goNormal = () => {
      router.push({ name: 'miCurso' });
    };

    const handleTabChange = (key: string) => {
      goNormal();
      activeKey.value = key;
      if (key === '2') {
        goContent();
      }
      if (key === '3') {
        goTareas();
      }
    };
    

    return {
      activeKey,
      viewCourses,
      goContent,
      goTareas,
      goNormal,
      handleTabChange,
      userRole,
    };
  },
});
</script>
