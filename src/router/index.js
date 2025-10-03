import { createRouter, createWebHistory } from 'vue-router';


import AdminLogin from '@/views/admin/auth/AdminLogin.vue';
import AdminRegister from '@/views/admin/auth/AdminRegister.vue';
import AdminDashboard from '@/views/admin/AdminDashboard.vue'; // Already exists
import EmployeeCreate from '@/views/admin/EmployeeCreate.vue'; // Component created earlier
import CouponManager from '@/views/admin/CouponManager.vue'; // Component created earlier
import OrderUpdateStatus from '@/views/admin/OrderUpdateStatus.vue'

// Import Layout Components
import PublicLayout from '@/layouts/PublicLayout.vue';
import UserDashboardLayout from '@/layouts/UserLayout.vue';
import AdminLayout from '@/layouts/AdminLayout.vue';

// Import public pages
import HomePage from '@/views/publicPages/HomePage.vue';
import ServicesPage from "@/views/publicPages/ServicesPage.vue"

import OrderSuccess from '@/views/user/OrderSuccess.vue';
import OrderStatus from '@/views/user/OrderStatus.vue';
import BookPickup from '@/views/user/BookPickup.vue';

// User Auth Components (Imported directly)
import UserLogin from '@/views/user/auth/userLogin.vue';
import UserRegister from '@/views/user/auth/userRegister.vue';
import ResendCode from '@/views/user/auth/resendCode.vue';
import ResetPassword from '@/views/user/auth/resetPassword.vue';
import VerifyPhone from '@/views/user/auth/verifyPhone.vue';

// User Dashboard Section Components (Imported directly)
import UserProfile from '@/views/user/sections/UserProfile.vue';
import UserAddressManager from '@/views/user/sections/UserAddressManager.vue';
import UserPreferences from '@/views/user/sections/UserPreferences.vue';
import UserMembership from '@/views/user/sections/UserMembership.vue';
import UserReferral from '@/views/user/sections/UserReferral.vue';


const routes = [
  // Public Routes with PublicLayout
  {
    path: '/',
    component: PublicLayout,
    children: [
      { path: '', name: 'Home', component: HomePage },
      { path: '/services', name: 'Our-services', component: ServicesPage },

    ]
  },
  // User Dashboard Routes using the new UserDashboardLayout
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
        path: '',                    // ✅ default child route
        name: 'BookPickup',            // ✅ first page after login
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
        path: 'referral',
        name: 'UserReferral',
        component: UserReferral
      }
    ]
  },
  // Redirect /dashboard to the new default
  { path: '/', redirect: '/user' },



  // Admin Routes with AdminLayout (Guard configuration remains in meta)
  {
    path: '/admin',
    component: AdminLayout,
    children: [
      { path: 'dashboard', name: 'AdminDashboard', component: AdminDashboard, meta: { requiresAuth: true, requiresAdmin: true } },
      // Mapped Functionalities:
      { path: 'employees/create', name: 'AdminEmployeeCreate', component: EmployeeCreate, meta: { requiresAuth: true, requiresAdmin: true } },
      { path: 'coupons', name: 'AdminCouponManager', component: CouponManager, meta: { requiresAuth: true, requiresAdmin: true } },
      { path: 'orders/status-update', name: 'AdminOrderStatusUpdate', component: OrderUpdateStatus, meta: { requiresAuth: true, requiresAdmin: true } },

      // Placeholder for future config
      { path: 'services/config', name: 'AdminServiceConfig', component: () => import('@/views/admin/ServiceConfig.vue'), meta: { requiresAuth: true, requiresAdmin: true } },
    ]
  },

  // --- AUTHENTICATION ROUTES (User and Admin) ---
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
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

// --- GLOBAL NAVIGATION GUARD ---
router.beforeEach((to, from, next) => {
  // 1. Placeholder for your actual authentication check
  // Reads from 'userToken' for regular users and 'adminToken' for admins (we'll assume adminToken implies admin login)
  const isUserLoggedIn = !!localStorage.getItem('userToken');
  const isAdminLoggedIn = !!localStorage.getItem('adminToken');

  // Determine which token to prioritize based on the route being accessed
  const isAuthenticated = to.matched.some(record => record.meta.requiresAdmin) ? isAdminLoggedIn : isUserLoggedIn;


  // 2. Placeholder for checking if the user is an Admin
  // In a real app, this function would read the user's role from the stored user object (not just the adminToken)
  const isCurrentUserAdmin = () => {
    // Since we don't have a centralized store, we'll simplify: 
    // If an admin token exists, assume the user is an admin for route guarding purposes.
    return isAdminLoggedIn;
  };

  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  const requiresAdmin = to.matched.some(record => record.meta.requiresAdmin);

  // --- 1. Authentication Check (requiresAuth) ---
  if (requiresAuth && !isAuthenticated) {
    // User needs to be logged in but isn't. Redirect to the appropriate login page.
    if (requiresAdmin) {
      // Admin routes requiring auth
      next({ name: 'AdminLogin' });
    } else {
      // User routes requiring auth
      next({ name: 'Login' });
    }
  }

  // --- 2. Authorization Check (requiresAdmin) ---
  else if (requiresAdmin && isAuthenticated) {
    // User is logged in (via adminToken), but we must verify the role
    if (isCurrentUserAdmin()) {
      // User is authenticated and is an admin
      next();
    } else {
      // User is logged in (via userToken) but is NOT an admin
      console.warn(`User tried to access admin route ${to.path} without admin privileges.`);
      // Redirect non-admin users to the user dashboard
      next({ name: 'UserProfile' });
    }
  }

  // --- 3. Handle Logged-in users accessing auth pages ---
  else if ((isUserLoggedIn || isAdminLoggedIn) && (to.name === 'Login' || to.name === 'Register' || to.name === 'AdminLogin' || to.name === 'AdminRegister')) {
    // Prevent logged-in users from seeing login/register pages
    if (to.name.startsWith('Admin') && isAdminLoggedIn) {
      next({ name: 'AdminDashboard' });
    } else if (!to.name.startsWith('Admin') && isUserLoggedIn) {
      next({ name: 'UserProfile' });
    } else {
      // Allow regular users to view AdminLogin/Register if they aren't logged in as Admin,
      // or vice versa (unlikely, but safe default)
      next();
    }
  }

  // 4. Continue navigation
  else {
    next();
  }
});


export default router;
