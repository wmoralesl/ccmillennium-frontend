<template>
  <div class="login-container">
    <a-form
      :model="formState"
      name="loginForm"
      :label-col="{ span: 8 }"
      :wrapper-col="{ span: 16 }"
      autocomplete="off"
      @finish="onFinish"
      @finishFailed="onFinishFailed"
      class="login-form"
    >
      <h2 style="text-align: center;">Iniciar Sesión</h2>

      <!-- Mostrar mensaje de error general -->
      <a-alert
        v-if="generalError"
        type="error"
        :message="generalError"
        show-icon
        class="mb-3"
      />
    
      <!-- Campo de username con ícono -->
      <a-form-item
        label="Nombre de Usuario"
        name="username"
        :validate-status="errors.username ? 'error' : ''"
        :help="errors.username"
        :rules="[{ required: true, message: 'El nombre de usuario es obligatorio.' }]"
      >
        <a-input v-model:value="formState.username" autocomplete="username">
          <template #prefix>
            <UserOutlined />
          </template>
        </a-input>
      </a-form-item>

      <!-- Campo de password con ícono -->
      <a-form-item
        label="Contraseña"
        name="password"
        :validate-status="errors.password ? 'error' : ''"
        :help="errors.password"
        :rules="[{ required: true, message: 'La contraseña es obligatoria.' }]"
      >
        <a-input-password v-model:value="formState.password" autocomplete="password">
          <template #prefix>
            <LockOutlined />
          </template>
        </a-input-password>
      </a-form-item>

      <!-- Botón de Enviar -->
      <a-form-item :wrapper-col="{ offset: 8, span: 16 }">
        <a-button type="primary" html-type="submit">Ingresar</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script lang="ts">
import { onMounted, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import apiClient from '@/api';
import { AxiosError } from 'axios';

// Importar iconos
import { UserOutlined, LockOutlined } from '@ant-design/icons-vue';

export default {
  name: 'MyLogin',
  components: {
    UserOutlined,
    LockOutlined,
  },
  setup() {
    document.title = "Millennium";
    const generalError = ref<string>('');
    const router = useRouter();
    const store = useStore(); 
    const formState = reactive({
      username: '',
      password: '',
    });
    const errors = reactive({
      username: '',
      password: ''
    });

    const clearCookies = async () => {
      const response = await apiClient.post('/logout/');
      store.dispatch('setAuth', false);
      store.commit('clearUser');
    }

    const onFinish = async () => {
      errors.username = '';
      errors.password = '';
      generalError.value = '';

      try {
        const response = await apiClient.post('/login/', formState, {
          withCredentials: true,
        });
        const userResponse = await apiClient.get('/user/', {
          withCredentials: true,
        });

        if (userResponse.data) {
          const user = userResponse.data;
          const role = user.role;

          store.commit('setUser', user);
          if (role === 'admin') {
            await router.push('/admin');
          } else {
            await router.push('/home');
          }
        } else {
          throw new Error('No user data received');
        }
      } catch (error) {
        const axiosError = error as AxiosError;

        if (axiosError.response) {
          const data = axiosError.response.data as { detail?: string };

          if (data.detail) {
            if (data.detail.includes('password')) {
              errors.password = 'Contraseña incorrecta.';
            } else if (data.detail.includes('User not found')) {
              errors.username = 'Usuario no encontrado.';
            } else {
              generalError.value = 'Error en el inicio de sesión. Inténtelo de nuevo.';
            }
          } else {
            generalError.value = 'Error en el inicio de sesión. Inténtelo de nuevo.';
          }
        } else {
          generalError.value = 'Error en el inicio de sesión.';
        }
        console.error('Login failed:', axiosError);
      }
    };

    const onFinishFailed = (errorInfo: any) => {
      console.log('Failed:', errorInfo);
      generalError.value = 'Por favor llenar los campos';
    };

    onMounted(clearCookies);
    return {
      formState,
      errors,
      generalError,
      onFinish,
      onFinishFailed,
    };
  },
};
</script>

<style scoped>
.login-container {
  background-image: url('../../../public/images/loginBanner.jpg');
  background-size: cover;
  background-position: center;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

.login-form {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  max-width: 600px;
  width: 100%;
}

.mb-3 {
  margin-bottom: 16px;
}
</style>
