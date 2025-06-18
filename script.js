document.addEventListener('DOMContentLoaded', () => {
    // --- Global Elements ---
    const topBar = document.querySelector('.top-bar');
    const mobileMenuToggleBtn = document.getElementById('mobile-menu-toggle-btn');
    const mobileNavPanel = document.getElementById('mobile-nav');
    const mobileMenuCloseBtn = document.getElementById('mobile-menu-close-btn');
    const navLinks = document.querySelectorAll('.nav-links a');
    const mobileNavPanelLinks = document.querySelectorAll('.mobile-nav-panel .mobile-nav-links a');

    // --- Hero Slider Data ---
    const slidesData = [
        {
            image: 'hero/slide/slide1.jpg',
            content: {
                subHeading: 'Welcome to Hurst Enterprises',
                mainHeading: 'Designs that Speak, Experiences that Connect',
                description: 'We are 100+ professional software engineers with more than 10 years of experience in delivering superior products.',
            }
        },
        {
            image: 'hero/slide/slide2.jpg',
            content: {
                subHeading: 'We Create Leading Digital Products',
                mainHeading: 'END-TO-END DEVELOPMENT',
                description: 'We are 100+ professional software engineers with more than 10 years of experience in delivering superior products.',
            }
        },
        {
            image: 'hero/slide/slide3.jpg',
            content: {
                subHeading: 'Only High-Quality Services',
                mainHeading: 'SOFTWARE IT OUTSOURCING',
                description: 'We are 100+ professional software engineers with more than 10 years of experience in delivering superior products.',
            }
        }
    ];

    // --- Hero Slider Elements & Logic ---
    const sliderWrapper = document.getElementById('hero-slider');
    let slidesContainer; // Declare here, define in init
    let currentSlideIndex = 0;
    let autoSlideInterval;
    const autoSlideDelay = 5000; // 5 seconds
    let totalSlides = 0;

    function createSlides() {
        slidesContainer = sliderWrapper.querySelector('.hero-slides-container'); // Define here
        if (!slidesContainer) {
            console.error("Hero slides container not found in createSlides!");
            return false; // Indicate failure
        }
        
        // Clear any existing slides (if re-initializing, though not typical here)
        slidesContainer.innerHTML = ''; 

        slidesData.forEach(slideItemData => {
            const slideDiv = document.createElement('div');
            slideDiv.classList.add('hero-slide-item');
            slideDiv.style.backgroundImage = `url('${slideItemData.image}')`;

            const overlayDiv = document.createElement('div');
            overlayDiv.classList.add('hero-overlay');

            const contentDiv = document.createElement('div');
            contentDiv.classList.add('hero-content');

            const subHeadingP = document.createElement('p');
            subHeadingP.classList.add('sub-heading');
            subHeadingP.textContent = slideItemData.content.subHeading;

            const mainHeadingH1 = document.createElement('h1');
            mainHeadingH1.classList.add('main-heading');
            mainHeadingH1.textContent = slideItemData.content.mainHeading;

            const descriptionP = document.createElement('p');
            descriptionP.classList.add('description');
            descriptionP.textContent = slideItemData.content.description;

            const buttonA = document.createElement('a');
            buttonA.href = "#"; 
            buttonA.classList.add('btn', 'btn-hero');
            buttonA.textContent = 'LEARN MORE';

            contentDiv.appendChild(subHeadingP);
            contentDiv.appendChild(mainHeadingH1);
            contentDiv.appendChild(descriptionP);
            contentDiv.appendChild(buttonA);

            slideDiv.appendChild(overlayDiv);
            slideDiv.appendChild(contentDiv);
            
            slidesContainer.appendChild(slideDiv);
        });

        totalSlides = slidesData.length;
        if (totalSlides > 0) {
            slidesContainer.style.width = `${totalSlides * 100}%`;
            // Ensure all slide items also have correct width relative to the new container width
             const slideItems = slidesContainer.querySelectorAll('.hero-slide-item');
             slideItems.forEach(item => {
                 item.style.width = `${100 / totalSlides}%`;
             });
        }
        return true; // Indicate success
    }
    
    function manageSlideContentAnimation(slideElement, action) {
        if (!slideElement) return;
        const contentElements = slideElement.querySelectorAll('.hero-content > *');
        contentElements.forEach(el => {
            if (action === 'animateIn') {
                el.classList.remove('content-animate-final', 'content-animate-init'); // Clear both
                // Force reflow before adding init. Sometimes helps.
                void el.offsetWidth; 
                el.classList.add('content-animate-init');    
                
                setTimeout(() => { 
                    el.classList.remove('content-animate-init'); 
                    el.classList.add('content-animate-final');
                }, 30); 
            } else if (action === 'reset') {
                el.classList.remove('content-animate-final');
                el.classList.add('content-animate-init');    
            }
        });
    }
    
    function goToSlide(index) {
        if (!slidesContainer || totalSlides === 0) {
            // console.error("Cannot go to slide: slidesContainer or totalSlides issue.");
            return;
        }
        
        // Calculate the percentage to translate for each slide
        const percentagePerSlide = 100 / totalSlides;
        slidesContainer.style.transform = `translateX(-${index * percentagePerSlide}%)`;
        // console.log(`Sliding to index ${index}, transform: translateX(-${index * percentagePerSlide}%)`);
        
        const allSlideItems = slidesContainer.querySelectorAll('.hero-slide-item');
        if (allSlideItems.length !== totalSlides) {
            // console.warn("Mismatch between totalSlides and actual slide items found.");
        }

        allSlideItems.forEach((slide, i) => {
            if (i === index) {
                manageSlideContentAnimation(slide, 'animateIn');
            } else {
                manageSlideContentAnimation(slide, 'reset');
            }
        });
        currentSlideIndex = index;
    }

    function nextSlideAction() {
        if (totalSlides === 0) return;
        let newIndex = (currentSlideIndex + 1) % totalSlides;
        goToSlide(newIndex);
    }

    function prevSlideAction() {
        if (totalSlides === 0) return;
        let newIndex = (currentSlideIndex - 1 + totalSlides) % totalSlides;
        goToSlide(newIndex);
    }

    function startAutoSlide() {
        clearInterval(autoSlideInterval); 
        if (totalSlides > 0) { // Only start if there are slides
            autoSlideInterval = setInterval(nextSlideAction, autoSlideDelay);
        }
    }

    function initSlider() {
        if (sliderWrapper && slidesData.length > 0) {
            if (createSlides()) { // If slides were created successfully
                setTimeout(() => { // Slight delay for DOM rendering
                    goToSlide(0); 
                    startAutoSlide();
                }, 100); 

                const prevButton = document.getElementById('hero-slider-prev');
                const nextButton = document.getElementById('hero-slider-next');
                if(prevButton && nextButton){ 
                    prevButton.addEventListener('click', () => {
                        prevSlideAction();
                        startAutoSlide(); 
                    });
                    nextButton.addEventListener('click', () => {
                        nextSlideAction();
                        startAutoSlide(); 
                    });
                }
            }
        } else {
            console.error("Hero slider could not be initialized. Wrapper or slides data missing.");
        }
    }

    // --- Initialize Everything ---
    initSlider(); // Call the slider initialization

    // --- Sticky Header on Scroll (Same as before) ---
    window.addEventListener('scroll', () => {
        let currentTopBarHeight = (topBar && getComputedStyle(topBar).display !== 'none') ? topBar.offsetHeight : 0;
        if (window.scrollY > currentTopBarHeight) {
            document.body.classList.add('scrolled');
        } else {
            document.body.classList.remove('scrolled');
        }
    });

    // --- Mobile Menu Toggle (Same as before) ---
    if (mobileMenuToggleBtn && mobileNavPanel && mobileMenuCloseBtn) {
        mobileMenuToggleBtn.addEventListener('click', () => {
            mobileNavPanel.classList.add('open');
            document.body.style.overflow = 'hidden';
        });
        mobileMenuCloseBtn.addEventListener('click', () => {
            mobileNavPanel.classList.remove('open');
            document.body.style.overflow = '';
        });
    }
    
    function closeMobileMenu() { 
        if (mobileNavPanel) {
            mobileNavPanel.classList.remove('open');
            document.body.style.overflow = '';
        }
    }
    
    mobileNavPanelLinks.forEach(link => {
        link.addEventListener('click', () => {
            closeMobileMenu();
            setActiveLink(link, mobileNavPanelLinks); 
            const desktopEquivalentHref = link.getAttribute('href');
            const desktopLink = document.querySelector(`.nav-links a[href="${desktopEquivalentHref}"]`);
            if (desktopLink) setActiveLink(desktopLink, navLinks);
        });
    });

    // --- Active Navigation Link (Same as before) ---
    function setActiveLink(clickedLink, allLinks) {
        allLinks.forEach(link => link.classList.remove('active'));
        clickedLink.classList.add('active');
    }
    
    navLinks.forEach(link => {
        link.addEventListener('click', function (event) {
            setActiveLink(this, navLinks);
        });
    });
});


document.addEventListener('DOMContentLoaded', () => {
    // --- Interactive Underline Logic ---
    const interactiveElements = document.querySelectorAll('.interactive-underline');

    interactiveElements.forEach(element => {
        element.addEventListener('click', function(event) {
            // Agar link hai toh default action rok dein agar zaroorat ho (e.g. SPA mein)
            // event.preventDefault(); 

            // Pehle sab interactive elements se 'active' class hatao (agar group banana hai)
            // Agar har element alag alag active reh sakta hai, toh yeh step skip kar sakte hain.
            // Filhal, hum yeh farz karte hain ke ek waqt mein ek hi active hoga in groups.
            
            // Grouping logic (optional, agar sirf ek active rakhna hai feature items mein)
            if (this.parentElement.classList.contains('feature-item')) {
                const featureHeadings = this.closest('.features-grid').querySelectorAll('.feature-item h3.interactive-underline');
                featureHeadings.forEach(h => h.classList.remove('active'));
            }
            // Agar yeh learn-more-link hai, toh isko alag se handle karein ya koi group na banayein.

            // Clicked element par 'active' class toggle karo ya add karo
            // this.classList.toggle('active'); // Agar toggle karna hai
            this.classList.add('active'); // Agar sirf add karna hai aur manually remove karna hai
        });
    });


    // --- Scroll to Top Button Logic (Optional) ---
    const scrollToTopBtn = document.getElementById('scrollToTopBtn');

    if (scrollToTopBtn) {
        window.addEventListener('scroll', () => {
            if (document.body.scrollTop > 100 || document.documentElement.scrollTop > 100) {
                scrollToTopBtn.style.display = "block";
                scrollToTopBtn.style.opacity = "1";
            } else {
                scrollToTopBtn.style.opacity = "0";
                // Optionally hide it completely after fade out
                setTimeout(() => {
                    if (!(document.body.scrollTop > 100 || document.documentElement.scrollTop > 100)) {
                         scrollToTopBtn.style.display = "none";
                    }
                }, 300); // Match opacity transition time
            }
        });

        scrollToTopBtn.addEventListener('click', () => {
            window.scrollTo({top: 0, behavior: 'smooth'});
        });
    }

    // --- Baaki aapka JavaScript code (slider, sticky header etc.) yahan ---
    // Make sure this new code doesn't conflict with existing DOMContentLoaded listeners
    // If you have multiple DOMContentLoaded, consider merging them or ensuring they don't overwrite variables.
});



document.addEventListener('DOMContentLoaded', () => {
    // Scroll to Top Button Logic (agar use kar rahe hain, warna pichle code se copy karein)
    const scrollToTopBtn = document.getElementById('scrollToTopBtn'); 

    if (scrollToTopBtn) {
        // ... (scroll to top JS logic)
    }

    // Aapka baaki JavaScript code (slider, sticky header, etc.) yahan
});


