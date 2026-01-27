document.addEventListener('DOMContentLoaded', () => {

    // --- PARTICLE MESH BACKGROUND ---
    const backgroundGlobes = document.querySelector('.background-globes');
    if (backgroundGlobes) {
        const canvas = document.createElement('canvas');
        canvas.classList.add('particle-mesh');
        canvas.style.position = 'absolute';
        canvas.style.top = '0';
        canvas.style.left = '0';
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        canvas.style.pointerEvents = 'none';
        canvas.style.zIndex = '-1';
        backgroundGlobes.appendChild(canvas);

        const ctx = canvas.getContext('2d');
        let width, height;
        let particles = [];

        function resize() {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        }
        window.addEventListener('resize', resize);
        resize();

        class Particle {
            constructor() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.vx = (Math.random() - 0.5) * 0.5;
                this.vy = (Math.random() - 0.5) * 0.5;
                this.size = Math.random() * 2;
            }
            update() {
                this.x += this.vx;
                this.y += this.vy;
                if (this.x < 0 || this.x > width) this.vx *= -1;
                if (this.y < 0 || this.y > height) this.vy *= -1;
            }
            draw() {
                ctx.fillStyle = 'rgba(157, 78, 221, 0.5)';
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        for (let i = 0; i < 50; i++) particles.push(new Particle());

        function animateParticles() {
            ctx.clearRect(0, 0, width, height);
            particles.forEach(p => {
                p.update();
                p.draw();
                particles.forEach(p2 => {
                    const dx = p.x - p2.x;
                    const dy = p.y - p2.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 150) {
                        ctx.strokeStyle = `rgba(157, 78, 221, ${0.1 - dist / 1500})`;
                        ctx.beginPath();
                        ctx.moveTo(p.x, p.y);
                        ctx.lineTo(p2.x, p2.y);
                        ctx.stroke();
                    }
                });
            });
            requestAnimationFrame(animateParticles);
        }
        animateParticles();
    }

    // --- MOBILE MENU TOGGLE ---
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (mobileMenuToggle && navLinks) {
        mobileMenuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            // Toggle icon
            const icon = mobileMenuToggle.querySelector('i');
            if (navLinks.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
                // Ensure mobile menu styles apply (handled in CSS usually)
                navLinks.style.display = 'flex';
                navLinks.style.flexDirection = 'column';
                navLinks.style.position = 'absolute';
                navLinks.style.top = '70px';
                navLinks.style.right = '0';
                navLinks.style.width = '100%';
                navLinks.style.background = 'rgba(5, 5, 16, 0.95)';
                navLinks.style.padding = '2rem';
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
                navLinks.style.display = ''; // Reset to CSS default
            }
        });

        // Close when clicking a link
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                const icon = mobileMenuToggle.querySelector('i');
                if (icon) {
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
                navLinks.style.display = '';
            });
        });
    }

    // --- CUSTOM CURSOR ---
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorOutline = document.querySelector('.cursor-outline');

    if (cursorDot && cursorOutline) {
        window.addEventListener('mousemove', (e) => {
            const posX = e.clientX;
            const posY = e.clientY;

            cursorDot.style.left = `${posX}px`;
            cursorDot.style.top = `${posY}px`;

            cursorOutline.animate({
                left: `${posX}px`,
                top: `${posY}px`
            }, { duration: 500, fill: "forwards" });
        });

        // Hover states
        document.querySelectorAll('a, button, .service-card, .spade-center-container').forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursorOutline.style.transform = 'translate(-50%, -50%) scale(1.5)';
                cursorDot.style.opacity = '0.5';
            });
            el.addEventListener('mouseleave', () => {
                cursorOutline.style.transform = 'translate(-50%, -50%) scale(1)';
                cursorDot.style.opacity = '1';
            });
        });
    }

    // --- 3D TILT EFFECT ---
    document.querySelectorAll('.service-card').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = ((y - centerY) / centerY) * -5;
            const rotateY = ((x - centerX) / centerX) * 5;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
        });
    });

    // --- SERVICE DETAILS MODAL (Restored) ---
    const serviceDetails = {
        'data-management': {
            title: 'Data Management',
            content: `
                <p class="modal-intro">Streamline your business intelligence with our robust data solutions.</p>
                <ul>
                    <li><strong>Database Architecture:</strong> Designing fast and reliable storage systems.</li>
                    <li><strong>ETL Processes:</strong> Moving and transforming data efficiently.</li>
                    <li><strong>Data Cleaning:</strong> Ensuring your data is accurate and ready for analysis.</li>
                    <li><strong>Cloud Integration:</strong> Seamless connection to Azure or AWS.</li>
                </ul>
            `
        },
        'web-app': {
            title: 'Web Application',
            content: `
                <p class="modal-intro">Building powerful, interactive tools tailored to your workflow.</p>
                <ul>
                    <li><strong>Custom Logic:</strong> Solutions designed for your specific needs.</li>
                    <li><strong>User Authentication:</strong> Secure access for your team.</li>
                    <li><strong>API Integrations:</strong> Connecting with your favorite tools.</li>
                    <li><strong>Scalability:</strong> Built to grow with your business.</li>
                </ul>
            `
        },
        'portfolio': {
            title: 'Portfolio',
            content: `
                 <p class="modal-intro">Your digital first impression, perfected.</p>
                 <ul>
                    <li><strong>Sleek Design:</strong> High-end aesthetics that capture attention.</li>
                    <li><strong>Responsive:</strong> Looks great on all devices.</li>
                    <li><strong>SEO Optimized:</strong> Built to be found.</li>
                 </ul>
            `
        },
        'poster-design': {
            title: 'Poster Design',
            content: `
                <p class="modal-intro">Capture attention with impactful visual storytelling.</p>
                 <ul>
                    <li><strong>Vector Portraits:</strong> Clean, scalable digital art.</li>
                    <li><strong>Event Branding:</strong> Posters for any occasion.</li>
                    <li><strong>Visual Storytelling:</strong> conveying your message instantly.</li>
                 </ul>
             `
        },
        'default': { title: 'Service', content: 'Contact us for more details.' }
    };

    const serviceModal = document.getElementById('serviceModal');
    const serviceModalTitle = document.getElementById('modalTitle');
    const serviceModalBody = document.getElementById('modalBody');
    const closeServiceModal = serviceModal ? serviceModal.querySelector('.close-modal') : null;

    document.querySelectorAll('.service-card').forEach(card => {
        card.addEventListener('click', () => {
            const type = card.getAttribute('data-service');
            const data = serviceDetails[type] || serviceDetails['default'];

            if (serviceModalTitle && serviceModalBody && serviceModal) {
                serviceModalTitle.innerText = data.title;
                serviceModalBody.innerHTML = data.content;
                serviceModal.classList.add('show');
                document.body.style.overflow = 'hidden';
            }
        });
    });

    if (closeServiceModal) {
        closeServiceModal.addEventListener('click', () => {
            serviceModal.classList.remove('show');
            document.body.style.overflow = 'auto';
        });
    }

    // Close any modal on outside click
    window.addEventListener('click', (e) => {
        if (e.target === serviceModal) {
            serviceModal.classList.remove('show');
            document.body.style.overflow = 'auto';
        }
        if (e.target === contactModal) {
            closeContactModalFunc();
        }
    });


    // --- CONTACT FORM & DUAL MODAL (New enhancements) ---
    const contactForm = document.getElementById('contactForm');
    const contactModal = document.getElementById('contactMethodModal');
    const closeContactModal = document.getElementById('closeContactMethod');
    const btnDirectSend = document.getElementById('btnDirectSend');
    const btnMailApp = document.getElementById('btnMailApp');
    const sendFeedback = document.getElementById('sendFeedback');

    const modalContentWrapper = document.getElementById('modalContentWrapper');
    const modalSuccessView = document.getElementById('modalSuccessView');

    let formData = {};

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const message = document.getElementById('message').value;

            // Store data
            formData = { name, email, message };

            // Reset Modal State (Show options, hide success)
            if (modalContentWrapper) modalContentWrapper.style.display = 'block';
            if (modalSuccessView) modalSuccessView.style.display = 'none';

            if (btnDirectSend) {
                btnDirectSend.disabled = false;
                btnDirectSend.innerHTML = '<i class="fas fa-bolt"></i> Send Now (Direct)';
            }
            if (sendFeedback) {
                sendFeedback.style.display = 'none';
            }

            // Show Modal
            contactModal.classList.add('show');
            document.body.style.overflow = 'hidden';
        });
    }

    function closeContactModalFunc() {
        contactModal.classList.remove('show');
        document.body.style.overflow = 'auto';
    }

    if (closeContactModal) {
        closeContactModal.addEventListener('click', closeContactModalFunc);
    }

    // Option 1: Direct Send (FormSubmit.co AJAX)
    if (btnDirectSend) {
        btnDirectSend.addEventListener('click', () => {
            const { name, email, message } = formData;

            // Loading UI
            btnDirectSend.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            btnDirectSend.disabled = true;

            fetch("https://formsubmit.co/ajax/spadeintech@outlook.com", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    name: name,
                    email: email,
                    message: message,
                    _subject: `New Inquiry from ${name}`
                })
            })
                .then(response => response.json())
                .then(data => {
                    // SUCCESS STATE
                    if (modalContentWrapper) modalContentWrapper.style.display = 'none';
                    if (modalSuccessView) modalSuccessView.style.display = 'block';

                    // Clear form
                    contactForm.reset();

                    // Auto close after 3 seconds
                    setTimeout(() => {
                        closeContactModalFunc();
                    }, 3000);
                })
                .catch(error => {
                    if (sendFeedback) {
                        sendFeedback.style.color = '#ff6b6b';
                        sendFeedback.innerText = 'Something went wrong. Please try "Via Mail App".';
                        sendFeedback.style.display = 'block';
                    }
                    btnDirectSend.innerHTML = '<i class="fas fa-bolt"></i> Send Now (Direct)';
                    btnDirectSend.disabled = false;
                });
        });
    }

    // Option 2: Mail App
    if (btnMailApp) {
        btnMailApp.addEventListener('click', () => {
            const { name, email, message } = formData;
            const subject = `Project Inquiry from ${name}`;
            const body = `Name: ${name}%0D%0AEmail: ${email}%0D%0A%0D%0AMessage:%0D%0A${message}`;

            window.location.href = `mailto:spadeintech@outlook.com?subject=${subject}&body=${body}`;

            closeContactModalFunc();
            contactForm.reset();
        });
    }

    // Smooth Scroll (Restored)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            // Ignore links that are just "#" (like the logo), as they have their own handler
            if (href === '#') return;

            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
                // If mobile menu is open, close it
                if (navLinks && navLinks.classList.contains('active')) {
                    navLinks.classList.remove('active');
                }
            }
        });
    });

    // Scroll Animation (Fade In) - Restored
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.service-card, .hero, .contact-form-container').forEach(el => {
        el.classList.add('fade-in-section');
        observer.observe(el);
    });

    // Haptic Feedback (Restored)
    const spadeHalves = document.querySelectorAll('.spade-half');
    spadeHalves.forEach(half => {
        half.addEventListener('mouseenter', () => {
            if (navigator.vibrate) navigator.vibrate(15);
        });
        half.addEventListener('touchstart', () => {
            if (navigator.vibrate) navigator.vibrate(15);
        }, { passive: true });
    });

    // --- HEADER LOGO: HAPTIC + SCROLL TOP ---
    const logoLink = document.querySelector('.logo-text');
    if (logoLink) {
        logoLink.addEventListener('click', (e) => {
            e.preventDefault();
            if (navigator.vibrate) navigator.vibrate(50);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // --- GLOBAL CLICK HAPTICS ---
    // Targets: Left/Right Spade Halves, Nav Contact Button, Service Cards
    const hapticTargets = document.querySelectorAll('.spade-half, .btn-primary, .service-card, .nav-links a');

    hapticTargets.forEach(el => {
        el.addEventListener('click', () => {
            if (navigator.vibrate) navigator.vibrate(40); // Subtle 'tick' feel
        });
    });

    // --- SPADE SHATTER ANIMATION ---
    const leftHalf = document.querySelector('.left-half');
    const rightHalf = document.querySelector('.right-half');
    const dispMapLeft = document.getElementById('dispMapLeft');
    const dispMapRight = document.getElementById('dispMapRight');

    function animateShatter(element, mapElement) {
        let scaleVal = 0;
        let animationId;

        element.addEventListener('mouseenter', () => {
            cancelAnimationFrame(animationId);
            let direction = 1;

            const animateIn = () => {
                // Expansion Phase
                if (scaleVal < 100 && direction === 1) {
                    scaleVal += 1;
                }
                // Continuous Oscillation Phase (90 <-> 110)
                else {
                    scaleVal += direction * 0.3; // Slow drift
                    if (scaleVal > 110) direction = -1;
                    if (scaleVal < 90) direction = 1;
                }

                mapElement.setAttribute('scale', scaleVal);
                animationId = requestAnimationFrame(animateIn);
            };
            animateIn();
        });

        element.addEventListener('mouseleave', () => {
            cancelAnimationFrame(animationId);
            const animateOut = () => {
                if (scaleVal > 0) {
                    scaleVal -= 2; // Faster rejoin than scatter
                    mapElement.setAttribute('scale', scaleVal);
                    animationId = requestAnimationFrame(animateOut);
                }
            };
            animateOut();
        });
    }

    if (leftHalf && dispMapLeft) animateShatter(leftHalf, dispMapLeft);
    if (rightHalf && dispMapRight) animateShatter(rightHalf, dispMapRight);

    // --- STEM INTERACTION (Triggers Both) ---
    const stem = document.querySelector('.spade-stem');
    if (stem && leftHalf && rightHalf) {

        // Helper to trigger hover on element
        const triggerHover = (el, type) => {
            const event = new MouseEvent(type, {
                view: window,
                bubbles: true,
                cancelable: true
            });
            el.dispatchEvent(event);
        };

        stem.addEventListener('mouseenter', () => {
            // Trigger JS Animation
            triggerHover(leftHalf, 'mouseenter');
            triggerHover(rightHalf, 'mouseenter');

            // Trigger CSS Styles (Text, Fill, etc)
            leftHalf.classList.add('active-hover');
            rightHalf.classList.add('active-hover');

            if (navigator.vibrate) navigator.vibrate(20);
        });

        stem.addEventListener('mouseleave', () => {
            // Stop JS Animation
            triggerHover(leftHalf, 'mouseleave');
            triggerHover(rightHalf, 'mouseleave');

            // Remove CSS Styles
            leftHalf.classList.remove('active-hover');
            rightHalf.classList.remove('active-hover');
        });

        stem.addEventListener('click', () => {
            if (navigator.vibrate) navigator.vibrate(60);
        });
    }

});
