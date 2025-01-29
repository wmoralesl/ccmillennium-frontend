<template>
    <h2>Register</h2>
    <form @submit.prevent="mySubmit">
        <input v-model="data.name" type="text" placeholder="Name" />
        <input v-model="data.email"  type="email" placeholder="Email" />
        <input v-model="data.password"  type="password" placeholder="Password" />
        <button type="submit">Register</button>
      </form>
  </template>
  
  <script lang="ts">
  import { reactive } from 'vue';
import { useRouter } from 'vue-router';
  export default {
    name: "myRegister",
    setup(){
      const data = reactive({
        name: '',
        email: '',
        password: ''
      });

      const router = useRouter();

      const mySubmit = async() =>{
        await fetch('http://localhost:8000/api/register/',{
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify(data)
        });

        await router.push('/login');
      }

      return{
        data,
        mySubmit
      }
    }
  }
  </script>
  