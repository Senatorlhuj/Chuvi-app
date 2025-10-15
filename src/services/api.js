const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const USER_BASE_PATH = 'api/users/me';
function getEmployeeToken() {
    return localStorage.getItem('employeeToken');
}
function getAuthToken(endpoint) {
    const adminPrefix = 'api/admin';
    const employeePrefix = 'api/employee';
    const sharedPrefixes = [
        'api/admin/orders',
        'api/admin/reviews/',
        'api/admin/issues',
    ];

    if (endpoint.startsWith(adminPrefix) && !sharedPrefixes.some(p => endpoint.startsWith(p))) {
        return localStorage.getItem('adminToken');
    }


    if (endpoint.startsWith(employeePrefix)) {
        return getEmployeeToken();
    }
    if (sharedPrefixes.some(p => endpoint.startsWith(p))) {

        const adminToken = localStorage.getItem('adminToken');
        if (adminToken) return adminToken;

        const employeeToken = getEmployeeToken();
        if (employeeToken) return employeeToken;
    }
    return localStorage.getItem('userToken');
}
async function authorizedFetch(endpoint, options = {}) {
    const url = `${API_BASE_URL.replace(/\/+$/, '')}/${endpoint.replace(/^\/+/, '')}`;

    console.log('➡️ Sending order to:', url);
    const token = getAuthToken(endpoint);

    const defaultHeaders = {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : '',
    };

    const response = await fetch(url, {
        ...options,
        headers: {
            ...defaultHeaders,
            ...options.headers,
        },
    });

    if (!response.ok) {
        const errorBody = await response.json().catch(() => ({ message: 'Server error' }));
        throw new Error(errorBody.message || `HTTP error! Status: ${response.status}`);
    }

    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
        return response.json();
    }
    return null;
}
export async function register(userData) {
    return authorizedFetch('api/auth/register', {
        method: 'POST',
        body: JSON.stringify(userData)
    });
}

export async function login(credentials) {
    return authorizedFetch('api/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials)
    });
}

export async function verifyPhone(verificationData) {
    return authorizedFetch('api/auth/verify-phone', {
        method: 'POST',
        body: JSON.stringify(verificationData)
    });
}

export async function resendCode(phoneData) {
    return authorizedFetch('api/auth/resend-code', {
        method: 'POST',
        body: JSON.stringify(phoneData)
    });
}

export async function resetPassword(resetData) {
    return authorizedFetch('api/auth/reset-password', {
        method: 'POST',
        body: JSON.stringify(resetData)
    });
}
export async function fetchUserProfile() {
    return authorizedFetch(`${USER_BASE_PATH}`, { method: 'GET' });
}
export async function updateProfile(updateData) {
    return authorizedFetch(`${USER_BASE_PATH}`, {
        method: 'PUT',
        body: JSON.stringify(updateData),
    });
}
export async function updateUserProfile(profileData) {
    return authorizedFetch(`${USER_BASE_PATH}/profile`, {
        method: 'PUT',
        body: JSON.stringify(profileData),
    });
}
export async function updatePassword(passwordData) {
    return authorizedFetch(`${USER_BASE_PATH}/password`, {
        method: 'PUT',
        body: JSON.stringify(passwordData),
    });
}

export async function fetchAddresses() {
    return authorizedFetch(`${USER_BASE_PATH}/addresses`, { method: 'GET' });
}

export async function saveAddress(addressData) {
    return authorizedFetch(`${USER_BASE_PATH}/addresses`, {
        method: 'POST',
        body: JSON.stringify(addressData),
    });
}

export async function updateAddress(addressId, addressData) {
    return authorizedFetch(`${USER_BASE_PATH}/addresses/${addressId}`, {
        method: 'PUT',
        body: JSON.stringify(addressData),
    });
}

export async function deleteAddress(addressId) {
    if (!addressId) throw new Error("Address ID is required");
    return authorizedFetch(`${USER_BASE_PATH}/addresses/${addressId}`, {
        method: 'DELETE',
    });
}
export async function updateProfilePhoto(photoFormData) { // Accepts FormData object for the file
    const endpoint = 'api/users/photo';
    const token = getAuthToken(endpoint);
    const url = `${API_BASE_URL.replace(/\/+$/, '')}/${endpoint.replace(/^\/+/, '')}`;

    console.log('➡️ Sending photo update to:', url);


    const response = await fetch(url, {
        method: 'PATCH',
        headers: {
            'Authorization': token ? `Bearer ${token}` : '',
        },
        body: photoFormData,
    });


    if (!response.ok) {
        const errorBody = await response.json().catch(() => ({ message: 'Server error' }));
        throw new Error(errorBody.message || `HTTP error! Status: ${response.status}`);
    }

    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
        return response.json();
    }
    return null;
}
export async function updatePreferences(preferencesData) {
    return authorizedFetch(`${USER_BASE_PATH}/preferences`, {
        method: 'PATCH',
        body: JSON.stringify(preferencesData),
    });
}

// --- FIXED MEMBERSHIP ---
export async function joinMembership() {
    return authorizedFetch(`api/users/membership/join`, {
        method: 'POST', // was PUT, backend expects POST
    });
}

export async function leaveMembership() {
    return authorizedFetch(`api/users/membership/leave`, {
        method: 'POST',
    });
}


export async function getReferralInfo() {
    return authorizedFetch('api/users/refer', {
        method: 'GET',
    });
}

export async function fetchUserPlanByCode(planCode) {
    return authorizedFetch(`api/users/plans/${planCode}`, { method: 'GET' });
}
export async function fetchUserPlans() {
    return authorizedFetch('api/users/plans', { method: 'GET' });
}
export async function subscribeUser(subscriptionData) {
    return authorizedFetch('api/users/subscribe', {
        method: 'POST',
        body: JSON.stringify(subscriptionData),
    });
}
export async function subscribeToPlan(subscriptionData) {
    return authorizedFetch('api/subscriptions/subscribe', {
        method: 'POST',
        body: JSON.stringify(subscriptionData)
    });
}


export async function pauseSubscription(pauseData = {}) {
    return authorizedFetch('api/subscriptions/pause', {
        method: 'POST',
        body: JSON.stringify(pauseData)
    });
}

export async function resumeSubscription(resumeData = {}) {
    return authorizedFetch('api/subscriptions/resume', {
        method: 'POST',
        body: JSON.stringify(resumeData)
    });
}

export async function changeSubscriptionPlan(changeData) {
    return authorizedFetch('api/subscriptions/change-plan', {
        method: 'POST',
        body: JSON.stringify(changeData)
    });
}

export async function rolloverSubscription(rolloverData = {}) {
    return authorizedFetch('api/subscriptions/rollover', {
        method: 'POST',
        body: JSON.stringify(rolloverData)
    });
}

export async function getCurrentSubscription() {
    return authorizedFetch('api/subscriptions/current', {
        method: 'GET'
    });
}

export async function cancelAutoPayment(subscriptionId, payload = {}) {
    return authorizedFetch(`api/subscriptions/${subscriptionId}/cancel-auto-payment`, {
        method: 'PATCH',
        body: JSON.stringify(payload)
    });
}

export async function createOrder(orderFormData) { // Accepts FormData object

    const token = getAuthToken('api/orders');
    const url = `${API_BASE_URL.replace(/\/+$/, '')}/api/orders`;

    const response = await fetch(url, {
        method: 'POST',
        headers: {

            'Authorization': token ? `Bearer ${token}` : '',
        },
        body: orderFormData, // Pass the FormData object directly
    });

    // ... Error and JSON handling remains the same as authorizedFetch
    if (!response.ok) {
        const errorBody = await response.json().catch(() => ({ message: 'Server error' }));
        throw new Error(errorBody.message || `HTTP error! Status: ${response.status}`);
    }

    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
        return response.json();
    }
    return null;
}
export async function previewOrder(previewData) {
    return authorizedFetch('api/orders/preview', {
        method: 'POST',
        body: JSON.stringify(previewData),
    });
}

export async function getUserOrders(phone) {
    try {
        // --- Normalize to +234 format ---
        let localPhone = phone.replace(/\D/g, '');
        if (localPhone.startsWith('0')) {
            localPhone = '+234' + localPhone.slice(1);
        } else if (localPhone.startsWith('234')) {
            localPhone = '+' + localPhone;
        } else if (!localPhone.startsWith('+234')) {
            localPhone = '+234' + localPhone;
        }
        console.log("🔍 Normalized phone:", localPhone);
        console.log("➡️ Sending order to:", `/api/orders/user/${localPhone}`);

        // --- Fetch (authorizedFetch already handles JSON/headers) ---
        const data = await authorizedFetch(`/api/orders/user/${localPhone}`, {
            method: 'GET',
        });

        // If API returns directly usable JSON, use it
        return data;



    } catch (error) {
        console.error("Error in getUserOrders:", error);
        throw new Error("Failed to fetch user orders. Please try again later.");
    }
}



export async function getOrderById(orderId) {
    return authorizedFetch(`api/orders/${orderId}`, {
        method: 'GET'
    });
}

export const cancelUserOrder = async (orderId, data) => {
    return authorizedFetch(`${API_BASE_URL}/orders/${orderId}/cancel`, {
        method: 'POST',
        body: JSON.stringify(data), 
    });
};

export async function getOrderDetails(orderId) {
    if (!orderId) throw new Error("Order ID is required");
    return authorizedFetch(`api/orders/${orderId}`, { method: 'GET' });
}
export async function getOrderReceipt(orderId) {
    if (!orderId) throw new Error("Order ID is required");

    const response = await authorizedFetch(`api/orders/${orderId}/receipt`, {
        method: 'GET',
        headers: {
            'Accept': 'application/pdf',
        },
    });

    if (!response.ok) {
        const text = await response.text();
        throw new Error(`Failed to fetch receipt: ${text || response.statusText}`);
    }

    const blob = await response.blob();
    return blob;
}

export async function trackOrderPublic(orderId) {
    if (!orderId) throw new Error("Order ID is required");
    return authorizedFetch(`api/orders/track/${orderId}`, { method: 'GET' });
}

export async function createReview(reviewData) {
    return authorizedFetch('api/reviews', {
        method: 'POST',
        body: JSON.stringify(reviewData),
    });
}
export async function createIssue(issueData) {
    return authorizedFetch('api/issues', {
        method: 'POST',
        body: JSON.stringify(issueData),
    });
}

export async function getAllServicesCatalog() {
    const data = await authorizedFetch('api/services', { method: 'GET' });
    return data;
}

// ==================== Notifications ====================

export async function getNotifications() {
    return authorizedFetch('api/notifications', { method: 'GET' });
}

export async function markNotificationAsRead(notificationId) {
    if (!notificationId) throw new Error('Notification ID is required');
    return authorizedFetch(`api/notifications/${notificationId}/read`, { method: 'PATCH' });
}

export async function markAllNotificationsAsRead() {
    return authorizedFetch('api/notifications/read-all', { method: 'PATCH' });
}

// ==================== Newsletter Subscription ====================
export async function subscribeToNewsletter(emailData) {
    if (!emailData || !emailData.email) {
        throw new Error("Email is required for newsletter subscription");
    }

    return authorizedFetch('api/subscribe', {
        method: 'POST',
        body: JSON.stringify(emailData),
    });
}

export async function getAllOrdersAdmin() {
    return authorizedFetch('api/admin/orders', { method: 'GET' });
}

export async function getOrdersTotalAdmin() {
    return authorizedFetch('api/admin/orders/total', { method: 'GET' });
}

export async function adminUpdateOrderStatus(orderId, statusData) {
    return authorizedFetch(`api/admin/orders/${orderId}/status`, {
        method: 'PATCH',
        body: JSON.stringify(statusData)
    });
}

export async function adminCancelOrder(orderId, noteData = {}) {
    return authorizedFetch(`api/admin/orders/${orderId}/cancel`, {
        method: 'PATCH',
        body: JSON.stringify(noteData)
    });
}
export async function adminLogin(credentials) {
    return authorizedFetch('api/admin/login', { method: 'POST', body: JSON.stringify(credentials) });
}

export async function adminRegister(userData) {
    return authorizedFetch('api/admin/register', { method: 'POST', body: JSON.stringify(userData) });
}

export async function createEmployee(employeeData) {

    return authorizedFetch('api/admin/employees', { method: 'POST', body: JSON.stringify(employeeData) });
}

export async function getEmployees() {

    return authorizedFetch('api/admin/get-employees');
}

export async function deleteEmployee(id) {

    return authorizedFetch(`api/admin/employees/${id}`, { method: 'DELETE' });
}


export async function createCoupon(couponData) {
    const mappedData = {
        code: couponData.couponCode,
        discountPercent: couponData.discountPercent,
        discountAmount: couponData.discountAmount,
        expiresAt: couponData.expiryDate,
        minOrderValue: couponData.minOrderValue,
        maxUses: couponData.maxUsage,
    };
    return authorizedFetch('api/admin/create/coupons', { method: 'POST', body: JSON.stringify(mappedData) });
}

export async function getAllCoupons() {
    return authorizedFetch('api/admin/coupons');
}

export async function updateCoupon(couponId, couponData) {
    const mappedData = {
        code: couponData.couponCode,
        discountPercent: couponData.discountPercent,
        discountAmount: couponData.discountAmount,
        expiresAt: couponData.expiryDate,
        minOrderValue: couponData.minOrderValue,
        maxUses: couponData.maxUsage,
    };
    return authorizedFetch(`api/admin/coupons/${couponId}`, { method: 'PUT', body: JSON.stringify(mappedData) });
}

export async function toggleCoupon(couponId) {
    return authorizedFetch(`api/admin/coupons/${couponId}/toggle`, { method: 'PATCH' });
}

export async function deleteCoupon(couponId) {
    return authorizedFetch(`api/admin/coupons/${couponId}`, { method: 'DELETE' });
}

export async function updateCouponStatus(couponId, statusData) {
    return authorizedFetch(`api/admin/coupons/${couponId}/status`, { method: 'PUT', body: JSON.stringify(statusData) });
}
export async function createSubscriptionPlan(planData) {
    return authorizedFetch('api/admin/create/subcription-plan', { method: 'POST', body: JSON.stringify(planData) });
}

export async function getAllSubscriptionPlans() {
    return authorizedFetch('api/admin/create/get-subcription-plan');
}

export async function getConfig() {
    return authorizedFetch('api/admin/get-config');
}

export async function getConfigByKey(key) {
    return authorizedFetch(`api/admin/config/${key}`);
}

export async function createConfig(configData) {
    return authorizedFetch('api/admin/create/config', { method: 'POST', body: JSON.stringify(configData) });
}

export async function deleteConfig(key) {
    return authorizedFetch(`api/admin/config/${key}`, { method: 'DELETE' });
}

export async function getServices() {
    return authorizedFetch('api/admin/get-services');
}

export async function createService(serviceData) {
    return authorizedFetch('api/admin/create/services', { method: 'POST', body: JSON.stringify(serviceData) });
}

export async function getServiceById(serviceId) {
    return authorizedFetch(`api/admin/services/${serviceId}`);
}

export async function updateService(serviceId, serviceData) {
    return authorizedFetch(`api/admin/services/${serviceId}`, { method: 'PUT', body: JSON.stringify(serviceData) });
}

export async function deleteService(serviceId) {
    return authorizedFetch(`api/admin/services/${serviceId}`, { method: 'DELETE' });
}

export async function getServicePricings() {
    return authorizedFetch('api/admin/get-service-pricings');
}

export async function getServicePricingById(pricingId) {
    return authorizedFetch(`api/admin/service-pricings/${pricingId}`);
}

export async function updateServicePricing(pricingId, pricingData) {
    return authorizedFetch(`api/admin/service-pricings/${pricingId}`, { method: 'PUT', body: JSON.stringify(pricingData) });
}

export async function deleteServicePricing(pricingId) {
    return authorizedFetch(`api/admin/service-pricings/${pricingId}`, { method: 'DELETE' });
}

export async function getReviewSummary() {
    return authorizedFetch('api/admin/reviews/summary', { method: 'GET' });
}

export async function getAdminAllReviews() {
    return authorizedFetch('api/admin/reviews/', { method: 'GET' });
}

export const getIssues = async () => {

    const data = await authorizedFetch('api/admin/issues', { method: 'GET' });
    return data.issues;
};

export const updateIssue = async (id, payload) => {

    const data = await authorizedFetch(`api/admin/issues/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(payload)
    });
    return data.issue;
};
export async function getIssuesTotalAdmin() {
    return authorizedFetch('api/admin/issues/total', {
        method: 'GET',
    });
}
export async function employeeLogin(credentials) {
    return authorizedFetch('api/employee/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
    });
}


export { authorizedFetch };