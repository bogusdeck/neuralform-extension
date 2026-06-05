// Register ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

// Hero Entrance Animation
const tl = gsap.timeline({ defaults: { ease: "power4.out", duration: 1.2 }});

tl.from(".navbar", { y: -100, opacity: 0 })
  .from(".reveal-text", { y: 100, opacity: 0, stagger: 0.2 }, "-=0.8")
  .from(".hero-actions", { y: 50, opacity: 0 }, "-=1")
  .from(".glass-card", { scale: 0.8, opacity: 0, rotationY: 45 }, "-=1.2")
  .from(".blob", { scale: 0, opacity: 0, stagger: 0.3 }, "-=1.5");

// Floating Animation for Glass Card
gsap.to(".glass-card", {
    y: 20,
    duration: 3,
    repeat: -1,
    yoyo: true,
    ease: "sine.inOut"
});

// Mock Input Animation (AI Filling Effect)
const fillTimeline = gsap.timeline({ repeat: -1, repeatDelay: 2 });
fillTimeline.to(".ai-active", { backgroundColor: "#c6f6d5", duration: 1 })
            .fromTo(".ai-active::after", { opacity: 0 }, { opacity: 1, duration: 0.5 });

// Feature Cards Entrance
gsap.from(".feature-card", {
    scrollTrigger: {
        trigger: ".features",
        start: "top 80%",
    },
    y: 100,
    opacity: 0,
    stagger: 0.1,
    duration: 1,
    ease: "back.out(1.7)"
});

// Steps Entrance
gsap.from(".step-item", {
    scrollTrigger: {
        trigger: ".how-it-works",
        start: "top 70%",
    },
    x: -100,
    opacity: 0,
    stagger: 0.2,
    duration: 0.8,
    ease: "power2.out"
});

// CTA Scale Up
gsap.from(".cta h2, .cta p, .cta .btn", {
    scrollTrigger: {
        trigger: ".cta",
        start: "top 80%",
    },
    scale: 0.9,
    opacity: 0,
    stagger: 0.1,
    duration: 1,
    ease: "power3.out"
});

// Parallax effect for blobs
window.addEventListener("mousemove", (e) => {
    const { clientX, clientY } = e;
    const x = (clientX - window.innerWidth / 2) / 50;
    const y = (clientY - window.innerHeight / 2) / 50;

    gsap.to(".blob-1", { x: x * 2, y: y * 2, duration: 1 });
    gsap.to(".blob-2", { x: -x * 3, y: -y * 3, duration: 1 });
});
