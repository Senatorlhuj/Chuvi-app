import { onMounted, onUnmounted } from 'vue';
import gsap from 'gsap';

export function useScrollReveal(targetRef, yOffset = 50, startPosition = "top 85%") {
  
  let animationTimeline = null;

  onMounted(() => {
  
    if (targetRef.value) {
      const element = targetRef.value;
      
      
      gsap.set(element, { 
        opacity: 0, 
        y: yOffset 
      });

    
      animationTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: element,
          start: startPosition,
          scrub: 1, 
        
          toggleActions: "play none none reverse", 
          
        }
      });

      animationTimeline.to(element, {
        opacity: 1,
        y: 0,
        duration: 1.5,
        ease: "power2.out"
      });
    }
  });
  onUnmounted(() => {
    if (animationTimeline && animationTimeline.scrollTrigger) {
      animationTimeline.scrollTrigger.kill();
    }
  });
}