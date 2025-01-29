<template>
  <div>
    <h1>Crear Nuevo Usuario</h1>
    <form @submit.prevent="submitForm">
      <div>
        <label for="first_name">Nombre:</label>
        <input v-model="user.first_name" id="first_name" required />
      </div>
      <div>
        <label for="last_name">Apellido:</label>
        <input v-model="user.last_name" id="last_name" />
      </div>
      <div>
        <label for="second_last_name">Segundo Apellido:</label>
        <input v-model="user.second_last_name" id="second_last_name" />
      </div>
      <div>
        <label for="birthdate">Fecha de Nacimiento:</label>
        <input v-model="user.birthdate" id="birthdate" type="date" />
      </div>
      <div>
        <label for="dpi">DPI:</label>
        <input v-model="user.dpi" id="dpi" />
      </div>
      <div>
        <label for="email">Correo Electrónico:</label>
        <input v-model="user.email" id="email" type="email" />
      </div>
      <div>
        <label for="photo">Foto:</label>
        <input @change="handleFileUpload" id="photo" type="file" accept="image/*" />
      </div>
      <div>
        <label for="gender">Género:</label>
        <select v-model="user.gender" id="gender">
          <option value="none">No especifica</option>
          <option value="male">Hombre</option>
          <option value="female">Mujer</option>
        </select>
      </div>
      <div>
        <label for="phone">Teléfono:</label>
        <input v-model="user.phone" id="phone" type="tel" />
      </div>
      <div>
        <label for="address">Dirección:</label>
        <input v-model="user.address" id="address" />
      </div>
      <div>
        <label for="role">Rol:</label>
        <select v-model="user.role" id="role" required>
          <option value="student">Estudiante</option>
          <option value="teacher">Maestro</option>
          <option value="admin">Administrador</option>
        </select>
      </div>
      <div>
        <label for="password">Contraseña:</label>
        <input v-model="user.password" id="password" type="password" required />
      </div>
      <button type="submit">Crear Usuario</button>
    </form>
  </div>
</template>

<script>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import apiClient from '@/api'; // Importar apiClient

export default {
  setup() {
    // Inicializamos los campos del usuario, incluyendo todos los campos necesarios
    const user = ref({
      first_name: '',
      last_name: '',
      second_last_name: '',
      birthdate: '',
      dpi: '',
      email: '',
      photo: null, // Campo de la foto como null al inicio
      gender: 'none',
      phone: '',
      address: '',
      role: 'student',
      password: '',
      is_active: true,
    });

    const router = useRouter();

    // Manejar la carga de archivos para la foto
    const handleFileUpload = (event) => {
      const file = event.target.files[0];
      user.value.photo = file;
    };

    const submitForm = async () => {
  try {
    const formData = new FormData();

    // Agregar cada campo del usuario al FormData
    for (const key in user.value) {
      if (user.value[key] !== null && user.value[key] !== undefined) {
        formData.append(key, user.value[key]);
      }
    }

    // Usar apiClient para hacer la solicitud POST
    const response = await apiClient.post('/register/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data', // Cambiar el tipo de contenido a multipart/form-data
      },
    });

    if (response.status === 201) { // Verificar si el usuario fue creado correctamente
      router.push('/users'); // Redireccionar a la lista de usuarios
    } else {
      throw new Error('Error al crear el usuario');
    }
  } catch (error) {
    console.error('Error en la creación de usuario:', error);
  }
};

    return { user, submitForm, handleFileUpload };
  },
};
</script>
