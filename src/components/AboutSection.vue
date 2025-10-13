<template>
  <section id="about" class="relative bg-bone-white py-24 overflow-hidden">
    <!-- Decorative Blobs -->
    <div class="absolute inset-0 overflow-hidden opacity-5">
      <div class="absolute top-10 left-0 w-72 h-72 bg-pure-gold rounded-full blur-3xl"></div>
      <div class="absolute bottom-10 right-0 w-96 h-96 bg-golden-brown rounded-full blur-3xl"></div>
    </div>

    <div class="relative z-10 container mx-auto px-6 max-w-6xl space-y-24">
      <!-- ABOUT -->
      <div
        id="intro"
        data-animate
        :class="isVisible.intro ? 'visible' : ''"
        class="text-center space-y-6"
      >
        <h2 class="text-5xl font-extrabold text-charcoal tracking-tight">
          ABOUT <span class="text-pure-gold">CHUVI</span>
        </h2>
        <p class="max-w-4xl mx-auto text-lg text-charcoal/80 leading-relaxed">
          CHUVI was born from a desire to redefine laundry—where clothes aren’t just cleaned,
          they’re <span class="font-semibold text-golden-brown">cared for</span>.
          We saw a gap in emotional attention and quality, and we stepped in to fill it.
          Every garment we handle is treated like a symbol of the person wearing it.
          Not just clean but Cared for.
        </p>
        
      </div>

      <!-- PURPOSE -->
      <div
        id="purpose"
        data-animate
        :class="isVisible.purpose ? 'visible' : ''"
        class="grid md:grid-cols-2 gap-10 items-center"
      >
        <div>
          <h3 class="text-3xl font-bold text-charcoal mb-4">Our Purpose</h3>
          <p class="text-charcoal/80 leading-relaxed">
            The main purpose of starting CHUVI was to redefine what laundry means—
            to create a service that doesn’t just remove stains but restores dignity,
            confidence, and comfort through every freshly returned piece.
            We started CHUVI to fill a gap: clean clothes were everywhere,
            but truly cared-for garments were rare. We exist to make people feel
            seen, respected, and refreshed—one outfit at a time.
          </p>
        </div>
        <div
          class="bg-white rounded-3xl p-8 border border-golden-brown/30"
        >
          <h4 class="font-semibold text-xl mb-3 text-golden-brown">
            What makes CHUVI stand out:
          </h4>
          <ul class="space-y-2 text-charcoal/80">
            <li>▪ Emotional Care: We don’t just clean—we care.</li>
            <li>▪ Brand Experience: From packaging to pick-up, everything feels premium and thoughtful.</li>
            <li>▪ Speed + Consistency: Reliable turnaround time with high-quality results.</li>
            <li>▪ Modern Touch: Clean visuals, digital access, and a polished, customer-first experience.</li>
            <li>▪ Cultural Elegance: We blend subtle African warmth with contemporary luxury.</li>
          </ul>
          <p class="mt-4 text-charcoal font-medium">
            We're not the cheapest, but we're the most dependable.<br />
            When we say <span class="text-golden-brown font-semibold">2 days</span>, we mean 2 days.
            When we say <span class="text-golden-brown font-semibold">6pm pickup</span>, our rider is there at 6pm.
          </p>
        </div>
      </div>

      <!-- OUR STANDARDS -->
      <div
        id="standards"
        data-animate
        :class="isVisible.standards ? 'visible' : ''"
        class="bg-charcoal/5 rounded-3xl p-10 border border-charcoal/10"
      >
        <h3 class="text-3xl font-bold text-center text-charcoal mb-6">
          Our Standards
        </h3>
        <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 text-center text-charcoal/80">
          <div>
            <p class="font-semibold text-golden-brown">On-Time Delivery</p>
            <p>We target ≥95% on or before the promised time.</p>
          </div>
          <div>
            <p class="font-semibold text-golden-brown">Order Accuracy</p>
            <p>We target 100% — no mix-ups.</p>
          </div>
          <div>
            <p class="font-semibold text-golden-brown">Pressing Quality</p>
            <p>We aim for 100% QC pass before packaging.</p>
          </div>
          <div>
            <p class="font-semibold text-golden-brown">Customer Happiness</p>
            <p>Not happy? Tell us—we’ll fix fast or re-do at no cost.</p>
          </div>
        </div>
      </div>

      <!-- VISION -->
      <div
        id="vision"
        data-animate
        :class="isVisible.vision ? 'visible' : ''"
        class="text-center max-w-5xl mx-auto space-y-6"
      >
        <h3 class="text-3xl font-bold text-charcoal">Our Vision</h3>
        <p class="text-charcoal/80 leading-relaxed">
          If there were no limits, CHUVI would be the most trusted laundry brand in Africa—
          with flagship care hubs in major cities, a tech-powered system that allows
          same-day delivery, and a strong emotional brand that people don’t just use,
          but love.
        </p>
        <p class="text-charcoal/70">
          In 10 years, CHUVI will have nationwide presence, a seamless mobile app,
          sustainable fabric technology, a training academy for garment specialists,
          and a brand reputation so strong people say:
        </p>
        <blockquote
          class="italic font-bold text-2xl text-transparent bg-clip-text bg-gradient-to-r from-pure-gold to-golden-brown"
        >
          “If it’s not CHUVI-cleaned, it’s not truly clean.”
        </blockquote>
      </div>

      <!-- VALUES -->
      <div
        id="values"
        data-animate
        :class="isVisible.values ? 'visible' : ''"
        class="bg-white rounded-3xl p-10 border border-charcoal/10"
      >
        <h3 class="text-3xl font-bold text-center text-charcoal mb-6">
          Our Values
        </h3>
        <ul class="space-y-3 text-charcoal/80 max-w-4xl mx-auto leading-relaxed">
          <li><span class="font-semibold text-golden-brown">1. Care Above All —</span> Every fabric, every customer, every detail—treated with deep respect and emotional attention.</li>
          <li><span class="font-semibold text-golden-brown">2. Consistency is Royalty —</span> We deliver the same premium standard every single time, no matter what.</li>
          <li><span class="font-semibold text-golden-brown">3. Clean with Purpose —</span> We’re not just removing dirt—we’re restoring confidence and dignity through cleanliness.</li>
          <li><span class="font-semibold text-golden-brown">4. Trust is Earned Daily —</span> From turnaround time to handling delicate items, our integrity is proven in every wash.</li>
          <li><span class="font-semibold text-golden-brown">5. Quiet Excellence —</span> We don’t shout—we show. Through packaging, presentation, and the way customers feel when their items return.</li>
          <li><span class="font-semibold text-golden-brown">6. Innovation with Soul —</span> We embrace modern tools and ideas, but always in ways that serve people—not just processes.</li>
        </ul>
      </div>

      <!-- TEAM & TAGLINE -->
      <div
        id="team"
        data-animate
        :class="isVisible.team ? 'visible' : ''"
        class="text-center space-y-4 bg-golden-brown/10 rounded-3xl p-10  border border-golden-brown/30"
      >
        <p class="text-charcoal/80 text-lg leading-relaxed">
          Professional cleaners trained in fabric care. Friendly riders who treat customers
          with respect. Customer service that actually responds to WhatsApp messages.
        </p>
        <h4
          class="text-3xl font-black italic text-transparent bg-clip-text bg-gradient-to-r from-pure-gold to-golden-brown"
        >
          “Not Just Clean, but Cared For.”
        </h4>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";

const isVisible = ref({});

onMounted(() => {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          isVisible.value[entry.target.id] = true;
        }
      });
    },
    { threshold: 0.2 }
  );

  document
    .querySelectorAll("[data-animate]")
    .forEach((el) => observer.observe(el));

  onBeforeUnmount(() => observer.disconnect());
});
</script>

<style scoped>
[data-animate] {
  opacity: 0;
  transform: translateY(30px);
  transition: all 1s ease;
}
[data-animate].visible {
  opacity: 1;
  transform: translateY(0);
}
</style>
