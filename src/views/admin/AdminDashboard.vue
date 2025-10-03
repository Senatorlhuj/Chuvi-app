<template>
  <div class="space-y-8">
    <h2 class="text-3xl font-bold text-charcoal">Dashboard Overview</h2>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <SummaryCard title="Total Orders" value="1,200" icon="fa-solid fa-box" color="bg-charcoal" />
      <SummaryCard title="Pending Pickups" value="45" icon="fa-solid fa-clock" color="bg-golden-brown" />
      <SummaryCard title="New Employees" value="3" icon="fa-solid fa-user-plus" color="bg-navy-blue" />
      <SummaryCard title="Revenue (MoM)" value="$12,500" icon="fa-solid fa-dollar-sign" color="bg-pure-gold" />
    </div>

    <div class="bg-bone-white p-6 rounded-xl ">
      <h3 class="text-2xl font-semibold text-charcoal mb-4">Quick Actions</h3>
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <router-link :to="{ name: 'AdminEmployeeCreate' }" class="p-4 bg-cream rounded-lg text-center border border-transparent hover:border-golden-brown transition-border">
          <font-awesome-icon icon="fa-solid fa-user-plus" class="text-3xl mb-2 text-navy-blue" />
          <p class="font-medium text-navy-blue">Create Employee</p>
        </router-link>
        <router-link :to="{ name: 'AdminCouponManager' }" class="p-4 bg-cream rounded-lg text-center border border-transparent hover:border-golden-brown transition-border">
          <font-awesome-icon icon="fa-solid fa-tag" class="text-3xl mb-2 text-navy-blue" />
          <p class="font-medium text-navy-blue">Manage Coupons</p>
        </router-link>
        <router-link :to="{ name: 'AdminOrderStatusUpdate' }" class="p-4 bg-cream rounded-lg text-center border border-transparent hover:border-golden-brown transition-border">
          <font-awesome-icon icon="fa-solid fa-truck-ramp-box" class="text-3xl mb-2 text-navy-blue" />
          <p class="font-medium text-navy-blue">Update Order Status</p>
        </router-link>
      </div>
    </div>

    <div class="bg-white p-6 rounded-xl ">
      <h3 class="text-2xl font-semibold text-charcoal mb-4">Recent Orders</h3>
      <p class="text-gray-500">Table of recent orders will go here...</p>
    </div>
  </div>
</template>

<script setup>
import SummaryCard from '@/components/admin/SummaryCard.vue'; 

</script>