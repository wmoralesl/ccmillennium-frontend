import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import { User } from '@/types';

import myLogin from "@/views/Auth/Login.vue"
import portalHome from "@/views/Portal/PortalHome.vue"
import adminHome from "@/views/Admin/AdminHome.vue"
import myRegister from "@/views/Auth/Register.vue"
import myProfile from "@/views/myProfile.vue"

import store from '@/store';
import AdminLoyout from '@/views/Admin/adminLoyout.vue';
import portalLayout from '@/views/Portal/portalLayout.vue';
import courseLayout from '@/views/Portal/Courses/cursoLayout.vue'

// Componentes de cursos
import CourseList from '@/views/Admin/Courses/listCourse.vue';
import CourseDetail from '@/views/Admin/Courses/detailCourse.vue';
import CourseCreate from '@/views/Admin/Courses/createCourse.vue';
import CourseEdit from '@/views/Admin/Courses/editCourse.vue';

// Componentes de grupos
import GrupoList from '@/components/group/listGroup.vue';
import GrupoCreate from '@/components/group/createGroup.vue';
import GrupoEdit from '@/components/group/editGroup.vue';
import GrupoDetail from '@/components/group/detailGroup.vue';

//Componentes para tareas
import AssignmentList from '@/views/Portal/Assignments/listAssignments.vue'
import AssignmentCreate from '@/views/Portal/Assignments/createAssignment.vue'
import AssignmentDetail from '@/views/Portal/Assignments/viewAssignment.vue'

//COmponentes para subidas
import AssignmentSubmissions from '@/views/Portal/Revisiones/SubmisionList_assignment.vue'
import GradeSubmission from '@/views/Portal/Submissions/viewSubmission.vue'
//Componentes para contenido
import ContentList from '@/views/Portal/Content/listContents.vue'
import ContentCreate from '@/views/Portal/Content/createContent.vue'
import ContentDetail from '@/views/Portal/Content/viewContent.vue'

//Componentes para usuarios
import UserList from '@/components/user/listUser.vue';
import UserCreate from '@/components/user/createUser.vue';
import UserEdit from '@/components/user/editUser.vue';
import UserDetail from '@/components/user/detailUser.vue'

//Componente para asignaciones
import enrollmentForm from '@/components/enrollment/enrollmentForm.vue';
import EnrollmentView from '@/components/enrollment/detailEnrollment.vue';

//Componente para pagos
import PaymentList from '@/components/payments/listPayment.vue';
import PaymentCreate from '@/components/payments/createPayment.vue';
import PaymentDetail from '@/components/payments/detailPayment.vue';

//Para predicciones
import Predictions from  '@/components/prediction/predictionList.vue';
import  PredictionDetail from  '@/components/prediction/predictionDetail.vue';

//Publico
// import Identificador from '@/views/identificadorPublic.vue'


//Para portal
import mycalendar from '@/views/Portal/Untils/myCalendar.vue';
import myPayments from '@/views/Portal/Payments/myPayments.vue';
const routes: Array<RouteRecordRaw> = [
  { 
    path: '/', 
    redirect: '/login' // Redirige la raíz al login 
  },
  
  { path: '/login', name:'Login' ,component: myLogin },
  { path: '/register', component: myRegister },
  { 
    path: '/home',
    component: portalLayout,
    meta: { requiresAuth: true, role: ['student', 'teacher'] },
    children:[
      {path: '', name: 'home', component: portalHome},
      { path: '/miperfil', name:'myProfile', component: myProfile},
      {path: '/calendario/', name: 'calendar', component: mycalendar},
      {path: '/mispagos/', name: 'myPayments', component: myPayments},
      {
        path: '/micurso/:id/',
        name: 'miCurso',
        component: courseLayout,
        props: true,
        children: [
          { path: 'contenido', name: 'listarcontenido', component: ContentList, props: true },
          { path: 'crearcontenido', name: 'crearContenido', component: ContentCreate, props: true },
          { path: 'vercontenido/:contentID', name: 'vercontenido', component: ContentDetail, props: true },
          { path: 'tareas', name: 'listartareas', component: AssignmentList, props: true },
          { path: 'creartarea', name: 'crearTarea', component: AssignmentCreate, props: true },
          { path: 'vertarea/:assignmentID', name: 'vertarea', component: AssignmentDetail, props: true },
          
          // Cambiamos AssignmentSubmissions a subruta relativa
          {
            path: 'assignment/:assignmentID/group/:groupId',
            name: 'AssignmentSubmissions',
            component: AssignmentSubmissions,
            props: true
          },
          {
            path: 'assignment/:assignmentId/:studentId/calificar',
            name: 'Calificar',
            component: GradeSubmission,
            props: true
          }
        ]
      },
    ] 
  },

  { 
    path: '/admin', 
    component: AdminLoyout, 
    meta: { requiresAuth: true, role: ['admin'] }, 
    children:[

  { path: '', name: 'homeAdmin', component: adminHome },
  { path: '/miperfil', name:'myProfileAdmin', component: myProfile},
        // Rutas para el manejo de cursos
  { path: '/courses', name: 'CourseList', component: CourseList },
  { path: '/courses/:id', name: 'CourseDetail', component: CourseDetail, props: true },
  { path: '/courses/create', name: 'CourseCreate', component: CourseCreate },
  { path: '/courses/:id/edit', name: 'CourseEdit', component: CourseEdit, props: true },

  // Rutas para el manejo de grupos
  { path: '/grupos', name: 'GrupoList', component: GrupoList },
  { path: '/grupos/create', name: 'GrupoCreate', component: GrupoCreate },
  { path: '/grupos/:id', name: 'GrupoDetail', component: GrupoDetail },
  { path: '/grupos/:id/edit', name: 'GrupoEdit', component: GrupoEdit },

  //Predicciones
  { path: '/predictions', name:'PredictionsList',component: Predictions },
  { path: '/predictions/:id', name: 'PredictionDetails', component: PredictionDetail, props: true },
    //Componentes para user
    { path: '/users', component: UserList },
    { path: '/create-user', component: UserCreate },
    { path: '/edit-user/:id', component: UserEdit, props: true },
    { path: '/view-user/:id', name:"viewUser" ,component: UserDetail, props: true },

    //Asignaciones
    {path: "/asignar", name: "Asignacion", component: enrollmentForm },
    {path: "/asignacion/:id", name: "DetallesAsignacion", component: EnrollmentView },

    //pagos
    {path: "/pagos", name: "Payments", component: PaymentList },
    {path: "/pagos/create", name: "createPayment", component: PaymentCreate },
    {path: "/pagos/:id", name: "viewPayment", component: PaymentDetail, props:true },
    ]
  },
  // { path: '/clasificador', name:'identificator' ,component: Identificador },

]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

router.beforeEach(async (to, from, next) => {
  const isLoggedIn = store.getters.isAuthenticated;
  let user = store.getters.getUser as User | null;

  if (to.meta.requiresAuth) {
    // Si no está autenticado, intenta obtener los datos del usuario
    if (!isLoggedIn) {
      await store.dispatch('fetchUser');
      user = store.getters.getUser;
    }

    // Si después de intentar obtener los datos del usuario no está autenticado, redirige al login
    if (!store.getters.isAuthenticated) {
      return next('/login');
    }

    // Verifica los roles si la ruta lo requiere
    if (to.meta.role) {
      const roles = to.meta.role as string[];
      if (!user || !roles.includes(user.role)) {
        return next('/'); // Redirige a la página de inicio si el rol no coincide
      }
    }
  }

  // Si no se requiere autenticación o el usuario está autenticado, permite el acceso
  next();
});
export default router
