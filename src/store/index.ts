import { createStore } from 'vuex';
import apiClient from '@/api'; // Importa tu apiClient configurado con axios

interface User {
  role: string;
  photo?: { url: string };
}

const store = createStore({
  state: {
    authenticated: false,
    user: null as User | null,
  },
  mutations: {
    setAuth(state, status: boolean) {
      state.authenticated = status;
    },
    setUser(state, userData: User) {
      state.user = userData;
      state.authenticated = true;
    },
    clearUser(state) {
      state.user = null;
      state.authenticated = false;
    },
    updateUserPhoto(state, newPhotoUrl) {
      if (state.user) {
        state.user.photo = { url: newPhotoUrl };
      }
    },
  },
  actions: {
    setAuth({ commit }, status: boolean) {
      commit('setAuth', status);
    },

    async fetchUser({ state, commit }) {
      if (state.user) {
        return state.user;
      }

      try {
        const response = await apiClient.get('/user');
        if (response.status !== 200) {
          throw new Error('Error al obtener datos del usuario');
        }
        const userData: User = response.data;
        commit('setUser', userData);
        return userData;
      } catch (error) {
        console.error('Error fetching user data:', error);
        commit('clearUser');
      }
    },

    async updateUserPhoto({ commit }, newPhotoUrl) {
      try {
        const response = await apiClient.post('/update-photo', { photo: newPhotoUrl });
        if (response.status === 200) {
          const updatedUser = response.data;
          commit('setUser', updatedUser);
        }
      } catch (error) {
        console.error('Error al actualizar la foto:', error);
      }
    },

    // Nueva acción para restaurar el token desde localStorage o cookie
    restoreAuth({ commit, dispatch }) {
      const token = localStorage.getItem('token');  // O usa cookie
      if (token) {
        commit('setAuth', true);
        // Podrías también restaurar el usuario
        dispatch('fetchUser');
      } else {
        commit('clearUser');
      }
    },
  },
  getters: {
    isAuthenticated: (state) => state.authenticated,
    getUser: (state) => state.user,
  },
});

export default store;
