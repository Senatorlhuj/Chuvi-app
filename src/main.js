import { createApp } from 'vue';
import './style.css';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';
import { Form, Field, ErrorMessage } from 'vee-validate';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

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
  faCheckCircle,
  faSignOutAlt,
  faMapMarkerAlt,
  faCog,
  faCrown,
  faHeart,
  faTachometerAlt,    
  faMapMarkedAlt,   
  faWallet,         
  faCalendarPlus,
  faTriangleExclamation,
  faCommentDots, 
  faStarHalfStroke,
  faStar,
  faExclamationTriangle, faPlus, faSearch, faLink, faBell
} from '@fortawesome/free-solid-svg-icons';

import {
  faFacebook,
  faInstagram,
  faTiktok
} from '@fortawesome/free-brands-svg-icons';


import 'swiper/css';
import 'swiper/css/pagination'; 
import { Swiper, SwiperSlide } from 'swiper/vue';

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
  faCheckCircle,
  faSignOutAlt,
  faMapMarkerAlt,
  faCog,
  faCrown,
  faHeart,
  faTachometerAlt,    
  faMapMarkedAlt,   
  faWallet,         
  faCalendarPlus,
  faTriangleExclamation,
  faCommentDots, 
  faStarHalfStroke,
  faStar,
  faExclamationTriangle, faPlus, faSearch, faLink, faBell        
);
gsap.registerPlugin(ScrollTrigger);
const app = createApp(App);
app.config.globalProperties.$gsap = gsap;
app.config.globalProperties.$ScrollTrigger = ScrollTrigger;
app.use(createPinia());
app.use(router);

app.component('VeeForm', Form);
app.component('VeeField', Field);
app.component('VeeErrorMessage', ErrorMessage);
app.component('font-awesome-icon', FontAwesomeIcon);
app.component('Swiper', Swiper);
app.component('SwiperSlide', SwiperSlide);

app.mount('#app');