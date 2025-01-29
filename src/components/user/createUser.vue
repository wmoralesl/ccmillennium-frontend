<template>
  <div class="container">
    <h1 class="mb-4">Crear Nuevo Usuario</h1>
    <form @submit.prevent="submitForm">
        <!-- Nombre -->
        <div class="form-group">
            <label for="first_name">Nombres:</label>
            <input type="text" v-model="user.first_name" id="first_name" class="form-control" required  />
        </div>
        <div class="form-row">
        <div class="form-group col">
            <label for="last_name">Primer Apellido:</label>
            <input type="text" v-model="user.last_name" id="last_name" class="form-control" required />
        </div>
        <div class="form-group col">
            <label for="second_last_name">Segundo Apellido:</label>
            <input type="text" v-model="user.second_last_name" id="second_last_name" class="form-control" />
        </div>
      </div>
        <!-- Rol y DPI, Teléfono -->
        
            <div class="form-group">
                <label for="role">Rol:</label>
                <select v-model="user.role" id="role" class="form-control" required>
                    <option value="student">Estudiante</option>
                    <option value="teacher">Maestro</option>
                    <option value="admin">Administrador</option>
                </select>
            </div>

            <div class="form-row">
            <div class="form-group col">
                <label for="phone">Teléfono:</label>
                <input v-model="user.phone" id="phone" type="tel" class="form-control" />
            </div>

            <div class="form-group col">
                <label for="email">Correo Electrónico:</label>
                <input v-model="user.email" id="email" type="email" class="form-control" />
            </div>
        </div>

            
        
       

        <!-- Fecha de Nacimiento y Género -->
        <div class="form-row">
            <div class="form-group col">
                <label for="birthdate">Fecha de Nacimiento:</label>
                <input v-model="user.birthdate" id="birthdate" type="date" class="form-control" />
            </div>
            <div class="form-group col">
                <label for="gender">Género:</label>
                <select v-model="user.gender" id="gender" class="form-control">
                    <option value="none">No especifica</option>
                    <option value="male">Hombre</option>
                    <option value="female">Mujer</option>
                </select>
            </div>
        </div>

        <div class="form-group">
                <label for="dpi">DPI:</label>
                <input type="text" v-model="user.dpi" id="dpi" class="form-control" />
            </div>

        <div class="form-group">
            <label for="address">Dirección:</label>
            <input type="text" v-model="user.address" id="address" class="form-control" />
        </div>

            <div class="form-group">
                <label for="photo">Foto:</label>
                <input @change="handleFileUpload" id="photo" type="file" accept="image/*" class="form-control-file" />
            </div>


        <!-- Dirección -->
        

        <button type="submit" class="btn btn-primary">Crear Usuario</button>
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
  flex: 1; /* Ocupa espacio igual */
    min-width: 200px; /* Ancho mínimo para cada columna */
    margin-right: 10px; /* Espaciado entre columnas */

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
input[type="tel"],
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
.form-row {
    display: flex; /* Muestra los elementos en fila */
    flex-wrap: wrap; /* Permite que los elementos se envuelvan si no hay suficiente espacio */
}

   
</style>