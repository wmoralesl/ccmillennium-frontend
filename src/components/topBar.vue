<template>
  <a-layout-header theme="light" style="padding: 0; display: flex; align-items: center; color: #fff;">
    <!-- Logo de la aplicación -->
    <div style="padding-left: 20px; padding-top: 20px;">
      <img src="@/../public/images/ccmillennium.png" alt="Logo" style="height: 40px;" />
    </div>
    
    <!-- Contenido del Topbar -->
    <div style="flex: 1; text-align: center;">
      <h2 style="color: #001529; margin: 0;">Centro de Computación Millennium</h2>
    </div>

    <!-- Iconos o Menús a la Derecha -->
    <div style="padding-right: 20px; display: flex; align-items: center;">
      <!-- Avatar Redondo -->
      <a-dropdown v-model:open="visible">
        <a class="ant-dropdown-link" @click.prevent>
          <a-avatar
            v-if="userPhoto"
            :src="userPhoto"
            alt="Avatar de usuario"
            style="margin-right: 16px;"
          />
          <a-avatar
          v-else 
            style="color: #f56a00; background-color: #fde3cf; margin-right: 16px;"
          >
            {{ userInitial }} <!-- Muestra la inicial -->
          </a-avatar>
        </a>
        
        <template #overlay>
          <a-menu @click="handleMenuClick">
            <a-menu-item key="1">Mi perfil</a-menu-item>
            <a-menu-item key="2">Salir</a-menu-item>
          </a-menu>
        </template>
      </a-dropdown>
    </div>
  </a-layout-header>
</template>

<script lang="ts" setup>
import { computed, watch, ref } from 'vue';
import { useStore } from 'vuex';
import apiClient from '@/api'; // Usa el apiClient que creaste
import type { MenuProps } from 'ant-design-vue';
import { useRouter } from 'vue-router';

const visible = ref(false);
const store = useStore();
const baseURL = process.env.VUE_APP_BASE_URL;
const router = useRouter();

const userPhoto = computed(() => {
  const user = store.getters.getUser; // Obtener el usuario
  if (user && user.photo) { // Verificar si user no es null y si photo existe
    const photoPath = user.photo || '';
    const fullPhotoPath = photoPath.startsWith('http') ? photoPath : `${baseURL}${photoPath}`;
    const timestamp = new Date().getTime();  // Añade un timestamp para evitar cacheo
    return `${fullPhotoPath}?t=${timestamp}`;
  }
  return null; // Devuelve null si no hay foto
});


// Computed para la inicial del usuario
const userInitial = computed(() => {
  const user = store.getters.getUser;
  return user && user.first_name ? user.first_name.charAt(0).toUpperCase() : '';
});

// Ver si la foto del usuario cambia
watch(
  () => store.getters.getUser?.photo,
  (newPhoto) => {
    console.log('Foto de usuario actualizada:', newPhoto);
  }
);

// Método para cerrar sesión
const logout = async () => {
  try {
    const response = await apiClient.post('/logout/');
    console.log('Respuesta del servidor:', response); // Agrega este log

    if (response.status !== 200) {
      throw new Error('Error al cerrar sesión');
    }

    // Limpia el estado de autenticación en Vuex
    store.dispatch('setAuth', false);
    store.commit('clearUser');
    router.push('/login');
  } catch (error) {
    console.error('Error cerrando sesión:', error);
  }
};

// Manejo de clic en el menú
const handleMenuClick: MenuProps['onClick'] = e => {
  const user = store.getters.getUser; // Obtener el usuario desde el store

  if (e.key === '1') {
    // Redirigir a un enlace basado en el rol del usuario
    if (user && user.role === 'admin') {
      router.push({ name: 'myProfileAdmin' });
    } else {
      router.push({ name: 'myProfile' });
    }
    visible.value = false; 
  } else if (e.key === '2') {
    // Ejecutar un método
    logout();
    visible.value = false; 
  }
};
</script>
