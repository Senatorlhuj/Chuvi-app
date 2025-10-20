import { createRouter, createWebHistory } from "vue-router";

// Layouts (keep these since they're likely small and used everywhere)
import PublicLayout from "@/layouts/PublicLayout.vue";
import UserDashboardLayout from "@/layouts/UserLayout.vue";
import AdminLayout from "@/layouts/AdminLayout.vue";
import EmployeeLayout from "@/layouts/EmployeeLayout.vue";
import StaffLayout from "@/layouts/StaffLayout.vue";

const routes = [
  {
    path: "/",
    component: PublicLayout,
    children: [
      {
        path: "",
        name: "Home",
        component: () =>
          import(
            /* webpackChunkName: "public" */ "@/views/publicPages/HomePage.vue"
          ),
      },
      {
        path: "/contact",
        name: "Contact",
        component: () =>
          import(
            /* webpackChunkName: "public" */ "@/views/publicPages/ContactPage.vue"
          ),
      },
      {
        path: "/services",
        name: "Our-services",
        component: () =>
          import(
            /* webpackChunkName: "public" */ "@/views/publicPages/ServicesPage.vue"
          ),
      },
      {
        path: "/care-compensation",
        name: "CareCompensation",
        component: () =>
          import(
            /* webpackChunkName: "public" */ "@/views/publicPages/CareCompensation.vue"
          ),
      },
      {
        path: "/terms-privacy",
        name: "TermsPrivacy",
        component: () =>
          import(
            /* webpackChunkName: "public" */ "@/views/publicPages/TermsPrivacy.vue"
          ),
      },
    ],
  },
  {
    path: "/user",
    component: UserDashboardLayout,
    meta: { requiresAuth: true },
    children: [
      {
        path: "/order-success/:orderId",
        name: "OrderSuccess",
        component: () =>
          import(
            /* webpackChunkName: "user-orders" */ "@/views/user/OrderSuccess.vue"
          ),
        props: true,
      },
      {
        path: "orders/:id/track",
        name: "TrackOrder",
        component: () =>
          import(
            /* webpackChunkName: "user-orders" */ "@/views/user/TrackOrder.vue"
          ),
        props: true,
      },
      {
        path: "book-pick-up",
        name: "BookPickup",
        component: () =>
          import(
            /* webpackChunkName: "user-booking" */ "@/views/user/BookPickup.vue"
          ),
      },
      {
        path: "/order/select-items",
        name: "ItemSelection",
        component: () =>
          import(
            /* webpackChunkName: "user-booking" */ "@/views/user/OrderItemSelector.vue"
          ),
      },
      {
        path: "/order/pickup-delivery",
        name: "PickupDelivery",
        component: () =>
          import(
            /* webpackChunkName: "user-booking" */ "@/views/user/PickupDeliveryView.vue"
          ),
      },
      {
        path: "/summary",
        name: "OrderSummary",
        component: () =>
          import(
            /* webpackChunkName: "user-booking" */ "@/views/user/OrderSummary.vue"
          ),
      },
      {
        path: "profile",
        name: "UserProfile",
        component: () =>
          import(
            /* webpackChunkName: "user-profile" */ "@/views/user/sections/UserProfile.vue"
          ),
      },
      {
        path: "help-center",
        name: "HelpCenter",
        component: () =>
          import(
            /* webpackChunkName: "user-support" */ "@/views/user/sections/HelpCenter.vue"
          ),
      },
      {
        path: "subscriptions",
        name: "UserSubscription",
        component: () =>
          import(
            /* webpackChunkName: "user-subscription" */ "@/views/user/sections/UserSubscription.vue"
          ),
      },
      {
        path: "order-history",
        name: "orderHistory",
        component: () =>
          import(
            /* webpackChunkName: "user-orders" */ "@/views/user/sections/MyBookings.vue"
          ),
      },
      {
        path: "my-referrals",
        name: "UserReferral",
        component: () =>
          import(
            /* webpackChunkName: "user-profile" */ "@/views/user/sections/UserReferral.vue"
          ),
      },
      {
        path: "subscription-plans",
        name: "PlansPage",
        component: () =>
          import(
            /* webpackChunkName: "user-subscription" */ "@/views/user/sections/PlansPage.vue"
          ),
      },
      {
        path: "notification",
        name: "UserNotifications",
        component: () =>
          import(
            /* webpackChunkName: "user-profile" */ "@/views/user/sections/UserNotifications.vue"
          ),
      },
    ],
  },
  {
    path: "/admin",
    component: AdminLayout,
    meta: { requiresAuth: true, requiresAdmin: true },
    children: [
      {
        path: "dashboard",
        name: "AdminDashboard",
        component: () =>
          import(
            /* webpackChunkName: "admin-core" */ "@/views/admin/AdminDashboard.vue"
          ),
      },
      {
        path: "employees/create",
        name: "AdminEmployeeCreate",
        component: () =>
          import(
            /* webpackChunkName: "admin-employees" */ "@/views/admin/EmployeeCreate.vue"
          ),
      },
      {
        path: "coupons",
        name: "AdminCouponManager",
        component: () =>
          import(
            /* webpackChunkName: "admin-management" */ "@/views/admin/CouponManager.vue"
          ),
      },
      {
        path: "services/config",
        name: "AdminServiceConfig",
        component: () =>
          import(
            /* webpackChunkName: "admin-management" */ "@/views/admin/ServiceConfig.vue"
          ),
      },
      {
        path: "orders/manage-orders",
        redirect: { name: "ManageOrders" },
      },
      {
        path: "reviews/all-reviews",
        redirect: { name: "StaffReviewsManager" },
      },
      {
        path: "issues/all-issues",
        redirect: { name: "StaffIssues" },
      },
      {
        path: "all-services",
        name: "ManageServices",
        component: () =>
          import(
            /* webpackChunkName: "admin-management" */ "@/views/admin/ManageServices.vue"
          ),
      },
      {
        path: "all-plans",
        name: "ManagePlans",
        component: () =>
          import(
            /* webpackChunkName: "admin-management" */ "@/views/admin/ManagePlans.vue"
          ),
      },
      {
        path: "admin-notifications",
        name: "AdminManageNotifications",
        component: () =>
          import(
            /* webpackChunkName: "admin-core" */ "@/views/admin/AdminManageNotifications.vue"
          ),
      },
    ],
  },
  {
    path: "/staff",
    component: StaffLayout,
    meta: { requiresAuth: true, requiresStaff: true },
    children: [
      {
        path: "orders/manage-orders",
        name: "ManageOrders",
        component: () =>
          import(
            /* webpackChunkName: "staff" */ "@/views/admin/ManageOrders.vue"
          ),
      },
      {
        path: "reviews/manager",
        name: "StaffReviewsManager",
        component: () =>
          import(
            /* webpackChunkName: "staff" */ "@/views/admin/AdminReviewsManager.vue"
          ),
      },
      {
        path: "issues/manager",
        name: "StaffIssues",
        component: () =>
          import(
            /* webpackChunkName: "staff" */ "@/views/admin/AdminIssues.vue"
          ),
      },
    ],
  },
  {
    path: "/employee",
    component: EmployeeLayout,
    meta: { requiresAuth: true, requiresEmployee: true },
    children: [
      {
        path: "dashboard",
        name: "EmployeeDashboard",
        component: () =>
          import(
            /* webpackChunkName: "employee" */ "@/views/employee/EmployeeDashboard.vue"
          ),
      },
    ],
  },
  // Auth routes - grouped by user type
  {
    path: "/admin/login",
    name: "AdminLogin",
    component: () =>
      import(
        /* webpackChunkName: "auth-admin" */ "@/views/admin/auth/AdminLogin.vue"
      ),
  },
  {
    path: "/admin/register",
    name: "AdminRegister",
    component: () =>
      import(
        /* webpackChunkName: "auth-admin" */ "@/views/admin/auth/AdminRegister.vue"
      ),
  },
  {
    path: "/login",
    name: "Login",
    component: () =>
      import(
        /* webpackChunkName: "auth-user" */ "@/views/user/auth/userLogin.vue"
      ),
  },
  {
    path: "/register",
    name: "Register",
    component: () =>
      import(
        /* webpackChunkName: "auth-user" */ "@/views/user/auth/userRegister.vue"
      ),
  },
  {
    path: "/verify-phone",
    name: "VerifyPhone",
    component: () =>
      import(
        /* webpackChunkName: "auth-user" */ "@/views/user/auth/verifyPhone.vue"
      ),
  },
  {
    path: "/resend-verification-code",
    name: "ResendVerificationCode",
    component: () =>
      import(
        /* webpackChunkName: "auth-user" */ "@/views/user/auth/resendCode.vue"
      ),
  },
  {
    path: "/reset-password",
    name: "ResetPassword",
    component: () =>
      import(
        /* webpackChunkName: "auth-user" */ "@/views/user/auth/resetPassword.vue"
      ),
  },
  {
    path: "/employee/login",
    name: "EmployeeLogin",
    component: () =>
      import(
        /* webpackChunkName: "auth-employee" */ "@/views/employee/auth/EmployeeLogin.vue"
      ),
  },
  {
    path: "/:pathMatch(.*)*",
    name: "NotFound",
    component: () =>
      import(/* webpackChunkName: "misc" */ "@/views/NotFound.vue"),
  },
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

// Optional: Add route-based preloading for better UX
router.beforeEach((to, from, next) => {
  // Preload likely next routes based on current route
  if (to.meta.preload) {
    to.meta.preload.forEach((routeName) => {
      // This would trigger the chunk download in background
      const route = router.resolve({ name: routeName });
    });
  }

  // Your existing auth logic
  const userLoggedIn = !!localStorage.getItem("userToken");
  const adminLoggedIn = !!localStorage.getItem("adminToken");
  const employeeLoggedIn = !!localStorage.getItem("employeeToken");

  const requiresAuth = to.matched.some((r) => r.meta.requiresAuth);
  const requiresAdmin = to.matched.some((r) => r.meta.requiresAdmin);
  const requiresStaff = to.matched.some((r) => r.meta.requiresStaff);

  if (requiresAuth && !userLoggedIn && !adminLoggedIn && !employeeLoggedIn) {
    if (requiresAdmin) return next({ name: "AdminLogin" });
    if (requiresStaff) return next({ name: "EmployeeLogin" });
    return next({ name: "Home" });
  }

  if (requiresAdmin && !adminLoggedIn) {
    console.warn(`Unauthorized admin access attempt: ${to.path}`);
    return next({ name: employeeLoggedIn ? "EmployeeDashboard" : "Login" });
  }

  if (requiresStaff && !adminLoggedIn && !employeeLoggedIn) {
    console.warn(`Unauthorized staff access attempt: ${to.path}`);
    return next({ name: "EmployeeLogin" });
  }

  if (
    (userLoggedIn || adminLoggedIn || employeeLoggedIn) &&
    [
      "Login",
      "Register",
      "AdminLogin",
      "AdminRegister",
      "EmployeeLogin",
    ].includes(to.name)
  ) {
    if (adminLoggedIn) return next({ name: "AdminDashboard" });
    if (employeeLoggedIn) return next({ name: "EmployeeDashboard" });
    return next({ name: "UserProfile" });
  }

  next();
});

export default router;
