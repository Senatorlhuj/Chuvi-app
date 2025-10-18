import { createApp } from 'vue';
import './style.css';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';
import { Form, Field, ErrorMessage } from 'vee-validate';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// FontAwesome
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

// Solid icons
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
  faDoorOpen,
  faBuilding,
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
  faStarHalfAlt, // half star
  faStar,        // solid star
  faExclamationTriangle,
  faPlus,
  faSearch,
  faLink,
  faBell,
  faShoppingCart,
  faTimesCircle,
  faMapPin,
  faListOl,
  faShieldAlt,
  faGem,
  faGift,
  faMobileAlt,
  faGlobe,
  faChartLine,
  faUsers,
  faSave,
  faPen,
  faKey,
  faUpload,
  faSlidersH,
  faEyeSlash,
  faEye,
  faCopy,
  faRightFromBracket,
  faAngleLeft,
  faAngleRight,
  faCalendarCheck,
  faHand,
  faExclamationCircle,
  faListCheck,
  faAnglesLeft,
  faAnglesRight,
  faSpinner,
  faTruckMoving,
  faChartBar
   

} from '@fortawesome/free-solid-svg-icons';

// Regular icons
import { faStar as farStar } from '@fortawesome/free-regular-svg-icons';

// Brand icons
import {
  faFacebook,
  faInstagram,
  faTiktok
} from '@fortawesome/free-brands-svg-icons';

// Swiper
import 'swiper/css';
import 'swiper/css/pagination';
import { Swiper, SwiperSlide } from 'swiper/vue';

// Add icons to library
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
  faDoorOpen,
  faBuilding,
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
  faStarHalfAlt,
  faStar,        // solid star
  farStar,       // regular star (empty)
  faExclamationTriangle,
  faPlus,
  faSearch,
  faLink,
  faBell,
  faShoppingCart,
  faTimesCircle,
  faMapPin,
  faFacebook,
  faInstagram,
  faTiktok,
  faListOl,
  faShieldAlt,
  faGem,
  faGift,
  faMobileAlt,
  faGlobe,
  faChartLine,
  faUsers,
  faSave,
  faPen,
  faKey,
  faUpload,
  faSlidersH,
  faEyeSlash,
  faEye,
  faCopy,
  faRightFromBracket,
  faAngleLeft,
  faAngleRight,
  faCalendarCheck,
  faHand,
  faExclamationCircle,
  faListCheck,
  faAnglesLeft,
  faAnglesRight,
  faSpinner,
  faTruckMoving,
  faChartBar
   
);

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

// Create Vue app
const app = createApp(App);

// Make GSAP and ScrollTrigger globally available
app.config.globalProperties.$gsap = gsap;
app.config.globalProperties.$ScrollTrigger = ScrollTrigger;

// Pinia & Router
app.use(createPinia());
app.use(router);

// VeeValidate components
app.component('VeeForm', Form);
app.component('VeeField', Field);
app.component('VeeErrorMessage', ErrorMessage);

// FontAwesome
app.component('font-awesome-icon', FontAwesomeIcon);

// Swiper components
app.component('Swiper', Swiper);
app.component('SwiperSlide', SwiperSlide);

// Mount app
app.mount('#app');
