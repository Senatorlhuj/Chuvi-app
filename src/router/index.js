import { createRouter, createWebHistory } from 'vue-router';

import AdminLogin from '@/views/admin/auth/AdminLogin.vue';
import AdminRegister from '@/views/admin/auth/AdminRegister.vue';
import AdminDashboard from '@/views/admin/AdminDashboard.vue';
import EmployeeCreate from '@/views/admin/EmployeeCreate.vue';
import CouponManager from '@/views/admin/CouponManager.vue';
import ManageOrders from '@/views/admin/ManageOrders.vue';
import AdminReviewsManager from '@/views/admin/AdminReviewsManager.vue';
import AdminIssues from '@/views/admin/AdminIssues.vue';

import EmployeeLogin from "@/views/employee/auth/EmployeeLogin.vue";
import EmployeeDashboard from '@/views/employee/EmployeeDashboard.vue';

import PublicLayout from '@/layouts/PublicLayout.vue';
import UserDashboardLayout from '@/layouts/UserLayout.vue';
import AdminLayout from '@/layouts/AdminLayout.vue';
import EmployeeLayout from '@/layouts/EmployeeLayout.vue';
import StaffLayout from '@/layouts/StaffLayout.vue';

import HomePage from '@/views/publicPages/HomePage.vue';
import ServicesPage from "@/views/publicPages/ServicesPage.vue";
import CareCompensation from "@/views/publicPages/CareCompensation.vue";
import TermsPrivacy from "@/views/publicPages/TermsPrivacy.vue";
import ContactPage from "@/views/publicPages/ContactPage.vue";


import OrderSuccess from '@/views/user/OrderSuccess.vue';
import TrackOrder from '@/views/user/TrackOrder.vue';
import BookPickup from '@/views/user/BookPickup.vue';
import OrderItemSelector from '@/views/user/OrderItemSelector.vue';

import UserLogin from '@/views/user/auth/userLogin.vue';
import UserRegister from '@/views/user/auth/userRegister.vue';
import ResendCode from '@/views/user/auth/resendCode.vue';
import ResetPassword from '@/views/user/auth/resetPassword.vue';
import VerifyPhone from '@/views/user/auth/verifyPhone.vue';

import UserProfile from '@/views/user/sections/UserProfile.vue';
import HelpCenter from '@/views/user/sections/HelpCenter.vue';
import UserReferral from '@/views/user/sections/UserReferral.vue';
import UserSubscription from '@/views/user/sections/UserSubscription.vue';
import MyBookings from '@/views/user/sections/MyBookings.vue';
import UserNotifications from '@/views/user/sections/UserNotifications.vue';

const routes = [
  {
    path: '/',
    component: PublicLayout,
    children: [
      { path: '', name: 'Home', component: HomePage },
      { path: '/contact', name: 'Contact', component: ContactPage },
      { path: '/services', name: 'Our-services', component: ServicesPage },
      { path: '/care-compensation', name: 'CareCompensation', component: CareCompensation },
      { path: '/terms-privacy', name: 'TermsPrivacy', component: TermsPrivacy },
    ],
  },
  {
    path: '/user',
    component: UserDashboardLayout,
    meta: { requiresAuth: true },
    children: [
      {
        path: '/order-success/:orderId',
        name: 'OrderSuccess',
        component: OrderSuccess,
        props: true,
      },
      { path: 'orders/:id/track', name: 'TrackOrder', component: TrackOrder, props: true },

      { path: 'book-pick-up', name: 'BookPickup', component: BookPickup },
      { path: '/order/select-items', name: 'ItemSelection', component: OrderItemSelector },
      { path: '/order/pickup-delivery', name: 'PickupDelivery', component: () => import('@/views/user/PickupDeliveryView.vue') },
      { path: '/summary', name: 'OrderSummary', component: () => import('@/views/user/OrderSummary.vue') },
      { path: 'profile', name: 'UserProfile', component: UserProfile },
      { path: 'help-center', name: 'HelpCenter', component: HelpCenter },
      { path: 'subscriptions', name: 'UserSubscription', component: UserSubscription },
      { path: 'order-history', name: 'orderHistory', component: MyBookings },
      { path: 'my-referrals', name: 'UserReferral', component: UserReferral },
      { path: 'notification', name: 'UserNotifications', component: UserNotifications },
    ],
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
      { path: 'orders/manage-orders', redirect: { name: 'ManageOrders' } },
      { path: 'reviews/all-reviews', redirect: { name: 'StaffReviewsManager' } },
      { path: 'issues/all-issues', redirect: { name: 'StaffIssues' } },
    ],
  },
  {
    path: '/staff',
    component: StaffLayout,
    meta: { requiresAuth: true, requiresStaff: true },
    children: [
      { path: 'orders/manage-orders', name: 'ManageOrders', component: ManageOrders },
      { path: 'reviews/manager', name: 'StaffReviewsManager', component: AdminReviewsManager },
      { path: 'issues/manager', name: 'StaffIssues', component: AdminIssues },
    ],
  },
  {
    path: '/employee',
    component: EmployeeLayout,
    meta: { requiresAuth: true, requiresEmployee: true },
    children: [
      { path: 'dashboard', name: 'EmployeeDashboard', component: EmployeeDashboard },
    ],
  },
  { path: '/admin/login', name: 'AdminLogin', component: AdminLogin },
  { path: '/admin/register', name: 'AdminRegister', component: AdminRegister },
  { path: '/login', name: 'Login', component: UserLogin },
  { path: '/register', name: 'Register', component: UserRegister },
  { path: '/verify-phone', name: 'VerifyPhone', component: VerifyPhone },
  { path: '/resend-verification-code', name: 'ResendVerificationCode', component: ResendCode },
  { path: '/reset-password', name: 'ResetPassword', component: ResetPassword },
  { path: '/employee/login', name: 'EmployeeLogin', component: EmployeeLogin },
  { path: '/:pathMatch(.*)*', name: 'NotFound', component: () => import('@/views/NotFound.vue') },
];

const router = createRouter({
  history: createWebHistory(),
  routes,

  // ✅ Add this for smooth anchor scrolling (for homepage sections)
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else if (to.hash) {
      const el = document.querySelector(to.hash);
      if (el) {
        // smooth scroll to the section
        setTimeout(() => {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 200);
        return { el: to.hash };
      }
    }
    // Default scroll to top for route changes
    return { top: 0 };
  },
});

router.beforeEach((to, from, next) => {
  const userLoggedIn = !!localStorage.getItem('userToken');
  const adminLoggedIn = !!localStorage.getItem('adminToken');
  const employeeLoggedIn = !!localStorage.getItem('employeeToken');

  const requiresAuth = to.matched.some(r => r.meta.requiresAuth);
  const requiresAdmin = to.matched.some(r => r.meta.requiresAdmin);
  const requiresStaff = to.matched.some(r => r.meta.requiresStaff);

  if (requiresAuth && !userLoggedIn && !adminLoggedIn && !employeeLoggedIn) {
    if (requiresAdmin) return next({ name: 'AdminLogin' });
    if (requiresStaff) return next({ name: 'EmployeeLogin' });
    return next({ name: 'Home' });
  }

  if (requiresAdmin && !adminLoggedIn) {
    console.warn(`Unauthorized admin access attempt: ${to.path}`);
    return next({ name: employeeLoggedIn ? 'EmployeeDashboard' : 'Login' });
  }

  if (requiresStaff && !adminLoggedIn && !employeeLoggedIn) {
    console.warn(`Unauthorized staff access attempt: ${to.path}`);
    return next({ name: 'EmployeeLogin' });
  }

  if (
    (userLoggedIn || adminLoggedIn || employeeLoggedIn) &&
    ['Login', 'Register', 'AdminLogin', 'AdminRegister', 'EmployeeLogin'].includes(to.name)
  ) {
    if (adminLoggedIn) return next({ name: 'AdminDashboard' });
    if (employeeLoggedIn) return next({ name: 'EmployeeDashboard' });
    return next({ name: 'UserProfile' });
  }

  next();
});

export default router;
