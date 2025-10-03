import { createApp } from 'vue';
import './style.css';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';
import { Form, Field, ErrorMessage } from 'vee-validate';

// --- Font Awesome Imports ---
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import {
  faPhoneVolume,
  faEnvelope,
  faLocationDot,
  faPaperPlane,
  faAt,
  faMedal,
  faBolt,
  faLeaf,
  faSignInAlt,
  faUser,
  faBars,
  faTimes,
  faHome,
  faCogs,
  faTags,
  faQuestionCircle,
  faInfoCircle,
  faCalendarDays,
  faHandsWash,
  faTshirt,
  faTag,
  faShirt,
  faUserTie,
  faHandsHolding,
  faDoorOpen, faBuilding,
  faHouse,
  faUserPlus,
  faTrash,
  faTruckRampBox,
  faGear,
  faBox,
  faClock,
  faDollarSign,
  faPenToSquare,
  faXmark,
  // Icons reported in error logs
  faCheckCircle,
  faSignOutAlt,

  // Icons used in the UserDashboardLayout for the sidebar

  faMapMarkerAlt,
  faCog,
  faCrown,
  faHeart,
  faTachometerAlt,    
  faMapMarkedAlt,   
  faWallet,         
  faCalendarPlus    
} from '@fortawesome/free-solid-svg-icons';

import {
  faFacebook,
  faInstagram,
  faTiktok
} from '@fortawesome/free-brands-svg-icons';

// --- Swiper Imports (CSS and Components) ---
import 'swiper/css';
import 'swiper/css/pagination'; // Only import the CSS for modules you are using
import { Swiper, SwiperSlide } from 'swiper/vue';

// Add only the specific icons you need to the library
library.add(
  faPhoneVolume,
  faEnvelope,
  faLocationDot,
  faPaperPlane,
  faAt,
  faMedal,
  faBolt,
  faLeaf,
  faSignInAlt,
  faUser,
  faBars,
  faTimes,
  faHome,
  faCogs,
  faTags,
  faQuestionCircle,
  faInfoCircle,
  faCalendarDays,
  faHandsWash,
  faTshirt,
  faTag,
  faShirt,
  faUserTie,
  faHandsHolding,
  faFacebook,
  faInstagram,
  faTiktok,
  faDoorOpen, faBuilding,
  faUserPlus,
  faPenToSquare,
  faTrash,
  faTruckRampBox,
  faGear,
  faBox,
  faClock,
  faDollarSign,
  faPenToSquare,
  faHouse,
  faXmark,
  // Icons reported in error logs
  faCheckCircle,
  faSignOutAlt,

  // Icons used in the UserDashboardLayout for the sidebar

  faMapMarkerAlt,
  faCog,
  faCrown,
  faHeart,
  faTachometerAlt,    
  faMapMarkedAlt,   
  faWallet,         
  faCalendarPlus    
);

const app = createApp(App);

app.use(createPinia());
app.use(router);

app.component('VeeForm', Form);
app.component('VeeField', Field);
app.component('VeeErrorMessage', ErrorMessage);

// Register Font Awesome component globally
app.component('font-awesome-icon', FontAwesomeIcon);

// Register Swiper components globally
app.component('Swiper', Swiper);
app.component('SwiperSlide', SwiperSlide);

app.mount('#app');