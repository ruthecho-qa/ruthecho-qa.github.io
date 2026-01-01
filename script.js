// Cookie Consent Management
const CookieConsent = {
    COOKIE_NAME: 'portfolio_cookie_consent',
    COOKIE_EXPIRY_DAYS: 365,

    getCookie: function(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
        return null;
    },

    setCookie: function(name, value, days) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        const expires = `expires=${date.toUTCString()}`;
        document.cookie = `${name}=${value};${expires};path=/;SameSite=Lax`;
    },

    hasConsent: function() {
        return this.getCookie(this.COOKIE_NAME) === 'accepted';
    },

    giveConsent: function() {
        this.setCookie(this.COOKIE_NAME, 'accepted', this.COOKIE_EXPIRY_DAYS);
        this.enableAnalytics();
    },

    denyConsent: function() {
        this.setCookie(this.COOKIE_NAME, 'declined', this.COOKIE_EXPIRY_DAYS);
        this.disableAnalytics();
    },

    enableAnalytics: function() {
        if (typeof gtag !== 'undefined') {
            gtag('consent', 'update', {
                'analytics_storage': 'granted'
            });

            // Track consent given event
            gtag('event', 'cookie_consent_granted');

            // Initialize tracking now that consent is given
            initializeTracking();
        }
    },

    disableAnalytics: function() {
        if (typeof gtag !== 'undefined') {
            gtag('consent', 'update', {
                'analytics_storage': 'denied'
            });

            // Track consent denied event (without storing data)
            gtag('event', 'cookie_consent_denied');
        }
    },

    showBanner: function() {
        const banner = document.getElementById('cookie-consent');
        if (banner) {
            setTimeout(() => {
                banner.classList.add('show');
            }, 1000);
        }
    },

    hideBanner: function() {
        const banner = document.getElementById('cookie-consent');
        if (banner) {
            banner.classList.remove('show');
        }
    }
};

// Initialize Cookie Consent on page load
document.addEventListener('DOMContentLoaded', function() {
    const consentStatus = CookieConsent.getCookie(CookieConsent.COOKIE_NAME);

    if (consentStatus === null) {
        // No consent preference set, show banner
        CookieConsent.showBanner();

        // Set default consent to denied until user accepts
        if (typeof gtag !== 'undefined') {
            gtag('consent', 'default', {
                'analytics_storage': 'denied'
            });
        }
    } else if (consentStatus === 'accepted') {
        // User has previously accepted
        CookieConsent.enableAnalytics();
    } else {
        // User has previously declined
        CookieConsent.disableAnalytics();
    }

    // Handle Accept button
    const acceptBtn = document.getElementById('cookie-accept');
    if (acceptBtn) {
        acceptBtn.addEventListener('click', function() {
            CookieConsent.giveConsent();
            CookieConsent.hideBanner();
        });
    }

    // Handle Decline button
    const declineBtn = document.getElementById('cookie-decline');
    if (declineBtn) {
        declineBtn.addEventListener('click', function() {
            CookieConsent.denyConsent();
            CookieConsent.hideBanner();
        });
    }
});

// Initialize all tracking (only called after consent)
function initializeTracking() {
    // Track Traffic Source
    if (typeof gtag !== 'undefined') {
        const referrer = document.referrer;
        const urlParams = new URLSearchParams(window.location.search);

        // Track referrer source
        if (referrer) {
            const referrerDomain = new URL(referrer).hostname;
            gtag('event', 'traffic_source', {
                'source_type': 'referral',
                'referrer_domain': referrerDomain,
                'referrer_url': referrer
            });
        } else if (urlParams.has('utm_source')) {
            // Track UTM parameters if present
            gtag('event', 'traffic_source', {
                'source_type': 'utm_campaign',
                'utm_source': urlParams.get('utm_source'),
                'utm_medium': urlParams.get('utm_medium'),
                'utm_campaign': urlParams.get('utm_campaign')
            });
        } else {
            // Direct traffic
            gtag('event', 'traffic_source', {
                'source_type': 'direct'
            });
        }
    }
}

// Track Time Spent on Sections
document.addEventListener('DOMContentLoaded', function() {
    const sections = document.querySelectorAll('section[id]');
    const sectionTimes = {};

    sections.forEach(section => {
        const sectionId = section.id;
        sectionTimes[sectionId] = {
            startTime: null,
            totalTime: 0,
            isVisible: false
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Section became visible
                    sectionTimes[sectionId].startTime = Date.now();
                    sectionTimes[sectionId].isVisible = true;
                } else if (sectionTimes[sectionId].isVisible) {
                    // Section became invisible
                    const timeSpent = Date.now() - sectionTimes[sectionId].startTime;
                    sectionTimes[sectionId].totalTime += timeSpent;
                    sectionTimes[sectionId].isVisible = false;

                    // Track time spent (only if more than 2 seconds)
                    if (timeSpent > 2000 && typeof gtag !== 'undefined') {
                        gtag('event', 'section_time', {
                            'section_name': sectionId,
                            'time_spent_seconds': Math.round(timeSpent / 1000),
                            'total_time_seconds': Math.round(sectionTimes[sectionId].totalTime / 1000)
                        });
                    }
                }
            });
        }, {
            threshold: 0.5,  // Section is considered visible when 50% is in viewport
            rootMargin: '-50px'  // Add some margin to avoid false positives
        });

        observer.observe(section);
    });

    // Track total time on page before user leaves
    window.addEventListener('beforeunload', function() {
        if (typeof gtag !== 'undefined') {
            // Calculate total session time
            const sessionTime = Date.now() - performance.timing.navigationStart;

            gtag('event', 'session_summary', {
                'total_session_seconds': Math.round(sessionTime / 1000)
            });

            // Send section time summary
            Object.keys(sectionTimes).forEach(sectionId => {
                if (sectionTimes[sectionId].totalTime > 0) {
                    gtag('event', 'session_section_summary', {
                        'section_name': sectionId,
                        'total_time_seconds': Math.round(sectionTimes[sectionId].totalTime / 1000)
                    });
                }
            });
        }
    });
});

// Mobile Menu Toggle
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', function() {
            navLinks.classList.toggle('active');
            this.textContent = navLinks.classList.contains('active') ? '✕' : '☰';
        });

        // Close mobile menu when clicking a link
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', function() {
                navLinks.classList.remove('active');
                if (mobileMenuToggle) {
                    mobileMenuToggle.textContent = '☰';
                }
            });
        });
    }
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });

            // Track navigation clicks
            if (typeof gtag !== 'undefined') {
                gtag('event', 'navigation_click', {
                    'section': this.getAttribute('href').replace('#', '')
                });
            }
        }
    });
});

// Track Contact Section clicks
document.addEventListener('DOMContentLoaded', function() {
    // Track contact link clicks
    const contactItems = document.querySelectorAll('.contact-item');
    contactItems.forEach(item => {
        item.addEventListener('click', function(e) {
            const linkText = this.textContent.trim();
            const linkHref = this.getAttribute('href');
            
            // Determine contact type
            let contactType = 'other';
            if (linkHref.includes('mailto:')) {
                contactType = 'email';
            } else if (linkHref.includes('wa.me')) {
                contactType = 'whatsapp';
            } else if (linkHref.includes('linkedin.com')) {
                contactType = 'linkedin';
            } else if (linkHref.includes('sribu.com')) {
                contactType = 'sribu';
            }
            
            // Send event to Google Analytics
            if (typeof gtag !== 'undefined') {
                gtag('event', 'contact_click', {
                    'contact_type': contactType,
                    'contact_text': linkText
                });
            }
            
            // Log to console for debugging
            console.log('Contact clicked:', contactType, linkText);
        });
    });
    
    // Track when user scrolls to Contact section
    const contactSection = document.querySelector('#contact');
    if (contactSection) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && typeof gtag !== 'undefined') {
                    gtag('event', 'section_view', {
                        'section_name': 'contact'
                    });
                    // Unobserve after first view
                    observer.unobserve(contactSection);
                }
            });
        }, { threshold: 0.5 });
        
        observer.observe(contactSection);
    }
    
    // Track Other Projects section view
    const otherProjectsSection = document.querySelector('#other-projects');
    if (otherProjectsSection) {
        const otherProjectsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && typeof gtag !== 'undefined') {
                    gtag('event', 'section_view', {
                        'section_name': 'other_projects'
                    });
                    otherProjectsObserver.unobserve(otherProjectsSection);
                }
            });
        }, { threshold: 0.3 });
        
        otherProjectsObserver.observe(otherProjectsSection);
    }
});

// Project Image Slideshow
document.addEventListener('DOMContentLoaded', function() {
    const slideshows = document.querySelectorAll('.project-slideshow');
    
    slideshows.forEach(slideshow => {
        const slides = slideshow.querySelectorAll('.project-slide');
        const dots = slideshow.parentElement.querySelectorAll('.slideshow-dot');
        let currentSlide = 0;
        let slideInterval;

        function showSlide(index) {
            slides.forEach(slide => slide.classList.remove('active'));
            dots.forEach(dot => dot.classList.remove('active'));
            
            slides[index].classList.add('active');
            dots[index].classList.add('active');
        }

        function nextSlide() {
            currentSlide = (currentSlide + 1) % slides.length;
            showSlide(currentSlide);
        }

        function startSlideshow() {
            slideInterval = setInterval(nextSlide, 3000);
        }

        function stopSlideshow() {
            clearInterval(slideInterval);
        }

        // Add click event to dots
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                currentSlide = index;
                showSlide(currentSlide);
                stopSlideshow();
                startSlideshow();
            });
        });

        // Pause on hover
        slideshow.parentElement.addEventListener('mouseenter', stopSlideshow);
        slideshow.parentElement.addEventListener('mouseleave', startSlideshow);

        // Start the slideshow
        startSlideshow();
    });
});

// Modal functions
function openModal(id) {
    const modal = document.getElementById(id + '-modal');
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Track modal opens
    if (typeof gtag !== 'undefined') {
        gtag('event', 'project_view', {
            'project_name': id
        });
    }
    
    // Add click handlers to gallery items in this modal
    setTimeout(() => {
        const galleryItems = modal.querySelectorAll('.modal-gallery-item');
        
        galleryItems.forEach(item => {
            // Remove old listeners by cloning
            const newItem = item.cloneNode(true);
            item.parentNode.replaceChild(newItem, item);
            
            // Add new listener
            newItem.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                const icon = this.querySelector('.modal-gallery-icon').textContent;
                const text = this.querySelector('.modal-gallery-text').textContent;
                const caption = this.querySelector('.modal-gallery-caption').textContent;
                openLightbox(icon, text, caption);
            });
        });
    }, 100);
}

function closeModal(id) {
    document.getElementById(id + '-modal').classList.remove('active');
    document.body.style.overflow = 'auto';
}

// Lightbox functions
function openLightbox(icon, text, caption) {
    const lightbox = document.getElementById('lightbox');
    document.getElementById('lightbox-icon').textContent = icon;
    document.getElementById('lightbox-text').textContent = text;
    document.getElementById('lightbox-caption').textContent = caption;
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Track lightbox opens
    if (typeof gtag !== 'undefined') {
        gtag('event', 'image_zoom', {
            'image_name': text
        });
    }
}

function closeLightbox() {
    const lightbox = document.getElementById('lightbox');
    lightbox.classList.remove('active');
    document.body.style.overflow = 'auto';
}

// Close lightbox when clicking outside
document.addEventListener('DOMContentLoaded', function() {
    const lightbox = document.getElementById('lightbox');
    if (lightbox) {
        lightbox.addEventListener('click', function(e) {
            if (e.target === this) {
                closeLightbox();
            }
        });
    }
});

// Close modal when clicking outside content
document.querySelectorAll('.modal').forEach(modal => {
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal(modal.id.replace('-modal', ''));
        }
    });
});

// Close modal and lightbox with Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        // Close lightbox first if it's open
        const lightbox = document.getElementById('lightbox');
        if (lightbox && lightbox.classList.contains('active')) {
            closeLightbox();
        } else {
            // Otherwise close modal
            document.querySelectorAll('.modal.active').forEach(modal => {
                closeModal(modal.id.replace('-modal', ''));
            });
        }
    }
});

// Project image zoom functionality
document.addEventListener('DOMContentLoaded', function() {
    const projectImages = document.querySelectorAll('.project-image img');

    projectImages.forEach(img => {
        // Make image clickable
        img.style.cursor = 'pointer';
        img.title = 'Click to zoom';

        img.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();

            // Get project name from card
            const projectCard = this.closest('.project-card');
            const projectName = projectCard.querySelector('h3').textContent;
            const imageSrc = this.getAttribute('src');

            // Open lightbox with actual image
            openProjectImageLightbox(imageSrc, projectName);
        });
    });
});

// Back to Top Button functionality
document.addEventListener('DOMContentLoaded', function() {
    const backToTopButton = document.getElementById('back-to-top');

    if (backToTopButton) {
        // Show/hide button based on scroll position
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 300) {
                backToTopButton.classList.add('visible');
            } else {
                backToTopButton.classList.remove('visible');
            }
        });

        // Scroll to top when clicked
        backToTopButton.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });

            // Track back to top clicks
            if (typeof gtag !== 'undefined') {
                gtag('event', 'back_to_top_click', {
                    'scroll_position': window.pageYOffset
                });
            }
        });
    }
});

// Function to open project images in lightbox
function openProjectImageLightbox(imageSrc, projectName) {
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.getElementById('lightbox-image');
    const lightboxText = document.getElementById('lightbox-text');
    const lightboxCaption = document.getElementById('lightbox-caption');

    // Clear existing content
    lightboxImage.innerHTML = '';

    // Create wrapper for zoom control
    const imgWrapper = document.createElement('div');
    imgWrapper.style.maxWidth = '95vw';
    imgWrapper.style.maxHeight = '90vh';
    imgWrapper.style.display = 'flex';
    imgWrapper.style.alignItems = 'center';
    imgWrapper.style.justifyContent = 'center';
    imgWrapper.style.overflow = 'auto';

    // Create and add actual image
    const img = document.createElement('img');
    img.src = imageSrc;
    img.alt = projectName;
    img.style.minWidth = '150%'; // Ensure at least 150% zoom
    img.style.width = 'auto';
    img.style.height = 'auto';
    img.style.maxWidth = 'none';
    img.style.objectFit = 'contain';
    img.style.borderRadius = '10px';
    img.style.boxShadow = '0 10px 40px rgba(0,0,0,0.3)';
    img.style.cursor = 'zoom-in';

    // Load image and set proper size
    img.onload = function() {
        // Calculate dimensions for at least 150% zoom
        const naturalWidth = this.naturalWidth;
        const naturalHeight = this.naturalHeight;
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        // Set to at least 150% of viewport or natural size, whichever is larger
        const targetWidth = Math.max(naturalWidth, viewportWidth * 1.5);
        img.style.width = targetWidth + 'px';
        img.style.maxWidth = 'none';
    };

    imgWrapper.appendChild(img);
    lightboxImage.appendChild(imgWrapper);

    // Update text
    lightboxText.textContent = projectName;
    lightboxCaption.textContent = 'Project Screenshot - Scroll to view full image';

    // Hide the icon placeholders
    const lightboxIcon = document.getElementById('lightbox-icon');
    if (lightboxIcon) lightboxIcon.style.display = 'none';

    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';

    // Track zoom event
    if (typeof gtag !== 'undefined') {
        gtag('event', 'project_image_zoom', {
            'project_name': projectName
        });
    }
}