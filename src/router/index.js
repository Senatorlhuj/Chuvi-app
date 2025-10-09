import { createRouter, createWebHistory } from 'vue-router';


import AdminLogin from '@/views/admin/auth/AdminLogin.vue';
import AdminRegister from '@/views/admin/auth/AdminRegister.vue';
import AdminDashboard from '@/views/admin/AdminDashboard.vue'; 
import EmployeeCreate from '@/views/admin/EmployeeCreate.vue'; 
import CouponManager from '@/views/admin/CouponManager.vue'; 

import OrderUpdateStatus from '@/views/admin/OrderUpdateStatus.vue' 
import AdminReviewsManager from '@/views/admin/AdminReviewsManager.vue' 
import AdminIssues from '@/views/admin/AdminIssues.vue' 




import EmployeeLogin from "@/views/employee/auth/EmployeeLogin.vue"
import EmployeeDashboard from '@/views/employee/EmployeeDashboard.vue'


import PublicLayout from '@/layouts/PublicLayout.vue';
import UserDashboardLayout from '@/layouts/UserLayout.vue';
import AdminLayout from '@/layouts/AdminLayout.vue';
import EmployeeLayout from '@/layouts/EmployeeLayout.vue'; 
import StaffLayout from '@/layouts/StaffLayout.vue'; 


import HomePage from '@/views/publicPages/HomePage.vue';
import ServicesPage from "@/views/publicPages/ServicesPage.vue"

import OrderSuccess from '@/views/user/OrderSuccess.vue';
import OrderStatus from '@/views/user/OrderStatus.vue';
import BookPickup from '@/views/user/BookPickup.vue';


import UserLogin from '@/views/user/auth/userLogin.vue';
import UserRegister from '@/views/user/auth/userRegister.vue';
import ResendCode from '@/views/user/auth/resendCode.vue';
import ResetPassword from '@/views/user/auth/resetPassword.vue';
import VerifyPhone from '@/views/user/auth/verifyPhone.vue';


import UserProfile from '@/views/user/sections/UserProfile.vue';
import UserAddressManager from '@/views/user/sections/UserAddressManager.vue';
import UserPreferences from '@/views/user/sections/UserPreferences.vue';
import UserMembership from '@/views/user/sections/UserMembership.vue';
import UserReferral from '@/views/user/sections/UserReferral.vue';
import UserReviews from '@/views/user/sections/UserReviews.vue';
import UserSubscription from '@/views/user/sections/UserSubscription.vue';
import UserNotifications from '@/views/user/sections/UserNotifications.vue';


const routes = [
  {
    path: '/',
    component: PublicLayout,
    children: [
      { path: '', name: 'Home', component: HomePage },
      { path: '/services', name: 'Our-services', component: ServicesPage },

    ]
  },
  {
    path: '/user',
    component: UserDashboardLayout,
    meta: { requiresAuth: true },
    children: [
      {
        path: 'order-success',
        component: OrderSuccess,
        name: 'OrderSuccess',
        meta: { requiresAuth: true }
      },
      {
        path: 'order-status',
        component: OrderStatus,
        name: 'OrderStatus',
        meta: { requiresAuth: true }
      },
      {
        path: 'book-pick-up',
        name: 'BookPickup',
        component: BookPickup
      },
      {
        path: 'profile',
        name: 'UserProfile',
        component: UserProfile
      },
      {
        path: 'address',
        name: 'UserAddressManager',
        component: UserAddressManager
      },
      {
        path: 'preferences',
        name: 'UserPreferences',
        component: UserPreferences
      },
      {
        path: 'membership',
        name: 'UserMembership',
        component: UserMembership
      },
      {
        path: 'reviews',
        name: 'UserReviews',
        component: UserReviews
      },
      {
        path: 'subscriptions',
        name: 'UserSubscription',
        component: UserSubscription
      },
      {
        path: 'referral',
        name: 'UserReferral',
        component: UserReferral
      },
      {
        path: 'notification',
        name: 'UserNotifications',
        component: UserNotifications
      }
    ]
  },


  {
    path: '/admin',
    component: AdminLayout,
    meta: { requiresAuth: true, requiresAdmin: true },
    children: [
      { path: 'dashboard', name: 'AdminDashboard', component: AdminDashboard },
      { path: 'employees/create', name: 'AdminEmployeeCreate', component: EmployeeCreate },
      { path: 'coupons', name: 'AdminCouponManager', component: CouponManager },
      { path: 'services/config', name: 'AdminServiceConfig', component: () => import('@/views/admin/ServiceConfig.vue') },
      { path: 'orders/status-update', redirect: { name: 'StaffOrderStatusUpdate' } },
      { path: 'reviews/all-reviews', redirect: { name: 'StaffReviewsManager' } },
      { path: 'issues/all-issues', redirect: { name: 'StaffIssues' } },
    ]
  },
  

  {
    path: '/staff', 
    component: StaffLayout, 
    meta: { requiresAuth: true, requiresStaff: true }, 
    children: [
      { path: 'orders/status-update', name: 'StaffOrderStatusUpdate', component: OrderUpdateStatus },
      { path: 'reviews/manager', name: 'StaffReviewsManager', component: AdminReviewsManager },
      { path: 'issues/manager', name: 'StaffIssues', component: AdminIssues },
    ]
  },


 
  {
    path: '/employee',
    component: EmployeeLayout,
    meta: { requiresAuth: true, requiresEmployee: true }, 
    children: [
      { path: 'dashboard', name: 'EmployeeDashboard', component: EmployeeDashboard },
    ]
  },


  {
    path: '/admin/login',
    name: 'AdminLogin',
    component: AdminLogin,
  },
  {
    path: '/admin/register',
    name: 'AdminRegister',
    component: AdminRegister,
  },
  {
    path: '/login',
    name: 'Login',
    component: UserLogin,
  },
  {
    path: '/register',
    name: 'Register',
    component: UserRegister,
  },

  {
    path: '/verify-phone',
    name: 'VerifyPhone',
    component: VerifyPhone,
  },

  {
    path: '/resend-verification-code',
    name: 'ResendVerificationCode',
    component: ResendCode,
  },
  {
    path: '/reset-password',
    name: 'ResetPassword',
    component: ResetPassword,
  },

  {
    path: '/employee/login',
    name: 'EmployeeLogin',
    component: EmployeeLogin,
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/NotFound.vue'),
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});



router.beforeEach((to, from, next) => {
  const userLoggedIn = !!localStorage.getItem('userToken')
  const adminLoggedIn = !!localStorage.getItem('adminToken')
  const employeeLoggedIn = !!localStorage.getItem('employeeToken')

  const requiresAuth = to.matched.some(r => r.meta.requiresAuth)
  const requiresAdmin = to.matched.some(r => r.meta.requiresAdmin)
  const requiresStaff = to.matched.some(r => r.meta.requiresStaff)
  if (requiresAuth && !userLoggedIn && !adminLoggedIn && !employeeLoggedIn) {
    if (requiresAdmin) return next({ name: 'AdminLogin' })
    if (requiresStaff) return next({ name: 'EmployeeLogin' }) 
    return next({ name: 'Home' }) 
  }
  if (requiresAdmin && !adminLoggedIn) {
    console.warn(`Unauthorized admin access attempt: ${to.path}`)
    return next({ name: employeeLoggedIn ? 'EmployeeDashboard' : 'Login' })
  }
  if (requiresStaff && !adminLoggedIn && !employeeLoggedIn) {
    console.warn(`Unauthorized staff access attempt: ${to.path}`)
    return next({ name: 'EmployeeLogin' })
  }
  if ((userLoggedIn || adminLoggedIn || employeeLoggedIn) && ['Login', 'Register', 'AdminLogin', 'AdminRegister', 'EmployeeLogin'].includes(to.name)) {
    if (adminLoggedIn) return next({ name: 'AdminDashboard' })
    if (employeeLoggedIn) return next({ name: 'EmployeeDashboard' })
    return next({ name: 'UserProfile' }) 
  }

  next()
});

export default router;