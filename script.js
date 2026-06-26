/**
 * Traditional Luxury Digital Wedding Invitation - Interactive Features & Particles
 */

// --- Google Form Integration Configuration ---
// Follow the instructions in the setup guide to get these values.
const GOOGLE_FORM_CONFIG = {
    enabled: true, // Activated!
    formUrl: 'https://docs.google.com/forms/d/e/1FAIpQLSdyZ4qiAdPjb4iLa6zAwxBdq61beTep3lXHHjDkvQQ6jOurog/formResponse',
    entries: {
        name: 'entry.1066227594',
        attendance: 'entry.842250812',
        guests: 'entry.1730887486',
        notes: 'entry.246791842'
    }
};

document.addEventListener('DOMContentLoaded', () => {

    // --- 1. Falling Petals Animation System ---
    const petalsContainer = document.getElementById('petalsContainer');
    const maxPetals = 35; // Cap maximum active particles to preserve mobile CPU/Battery
    let activePetals = 0;

    // Hydrangea and forget-me-not blue petal colors (various pastel blues, periwinkles, and soft white accents)
    const roseColors = [
        'linear-gradient(135deg, #dce6f1 0%, #b9d1eb 100%)',   // Soft powder blue
        'linear-gradient(135deg, #e2e8f0 0%, #c4d3e6 100%)',   // Soft periwinkle
        'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)',   // Pastel sky blue
        'linear-gradient(135deg, #e0f7fa 0%, #b2ebf2 100%)',   // Ice blue
        'linear-gradient(135deg, #ffffff 0%, #f0f4f8 100%)',   // Pure ivory/white blossom
        'linear-gradient(135deg, #d4e2f4 0%, #adc8e6 100%)',   // Soft hydrangea blue
        'linear-gradient(135deg, #bcccdc 0%, #9fb3c8 100%)'    // Muted slate pastel blue
    ];

    // Different organic shapes for rose petals
    const petalShapes = [
        '50% 50% 50% 50% / 40% 40% 60% 60%',   // Curved cup shape
        '12% 85% 15% 80% / 15% 80% 15% 85%',   // Asymmetric organic flutter petal
        '70% 30% 70% 70% / 70% 30% 70% 70%',   // Teardrop petal
        '50% 50% 50% 50% / 30% 30% 70% 70%'    // Gentle heart petal
    ];

    function createPetal() {
        if (activePetals >= maxPetals || !petalsContainer) return;

        const petal = document.createElement('div');
        petal.classList.add('petal');
        activePetals++;

        // Randomize dimensions (increased slightly for better rose petal readability)
        const size = Math.random() * 12 + 10; // 10px to 22px
        petal.style.width = `${size}px`;
        petal.style.height = `${size}px`;

        // Randomize spawn position along top
        petal.style.left = `${Math.random() * 100}vw`;
        petal.style.top = `-25px`;

        // Randomize rose color gradient and border-radius shape
        petal.style.background = roseColors[Math.floor(Math.random() * roseColors.length)];
        petal.style.borderRadius = petalShapes[Math.floor(Math.random() * petalShapes.length)];

        // Soft drop-shadow and inner highlights for organic depth
        petal.style.boxShadow = '0 3px 6px rgba(217, 93, 111, 0.12), inset 0 1px 1px rgba(255, 255, 255, 0.35)';

        // Custom sway distances and final rotations via CSS Variables
        const swayX = `${(Math.random() - 0.5) * 160}px`; // sway -80px to +80px horizontally
        const rotateDeg = `${(Math.random() - 0.5) * 720}deg`; // spin up to 360 deg
        petal.style.setProperty('--sway-x', swayX);
        petal.style.setProperty('--rotate-deg', rotateDeg);

        // Randomize animation duration and delay
        const duration = Math.random() * 6 + 6; // 6s to 12s (slightly slower, more floating effect)
        petal.style.animationDuration = `${duration}s`;

        // Append to background container
        petalsContainer.appendChild(petal);

        // Remove element from DOM once transition completes to free memory
        setTimeout(() => {
            petal.remove();
            activePetals--;
        }, duration * 1000);
    }

    // Spawn petals at structured interval
    const spawnInterval = setInterval(createPetal, 350);


    // --- 2. Intersection Observer for Scroll Reveals ---
    const revealElements = document.querySelectorAll('.reveal, .timeline-bubble-item');

    if ('IntersectionObserver' in window) {
        const revealCallback = (entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('reveal-active');
                    observer.unobserve(entry.target);
                }
            });
        };

        const revealObserver = new IntersectionObserver(revealCallback, {
            root: null,
            threshold: 0.1,
            rootMargin: '0px 0px -40px 0px'
        });

        revealElements.forEach(element => {
            revealObserver.observe(element);
        });
    } else {
        // Fallback for older browsers
        revealElements.forEach(element => {
            element.classList.add('reveal-active');
        });
    }


    // --- 3. Bottom Sticky Action Bar Visibility Logic ---
    const bottomBar = document.getElementById('bottomBar');
    const heroSection = document.getElementById('hero');
    const rsvpSection = document.getElementById('rsvp');

    const handleScroll = () => {
        if (!heroSection || !bottomBar) return;

        const heroHeight = heroSection.offsetHeight;
        const scrollPosition = window.scrollY;

        // Show bottom bar after scrolling past 80% of hero height
        let showBar = scrollPosition > (heroHeight * 0.8);

        // Hide bar if user reaches the RSVP form section itself
        if (rsvpSection) {
            const rsvpTop = rsvpSection.offsetTop;
            const viewportHeight = window.innerHeight;
            if (scrollPosition + viewportHeight > rsvpTop + 150) {
                showBar = false;
            }
        }

        if (showBar) {
            bottomBar.classList.add('show');
        } else {
            bottomBar.classList.remove('show');
        }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Initial call to set correct state on page load
    handleScroll();


    // --- 4. Dynamic RSVP Form Interactive Logic ---
    const rsvpForm = document.getElementById('rsvpForm');
    const rsvpSuccessOverlay = document.getElementById('rsvpSuccessOverlay');
    const successMsg = document.getElementById('successMsg');
    const guestsWrapper = document.getElementById('guests-wrapper');
    const guestsInput = document.getElementById('guests');
    const attendanceRadios = document.querySelectorAll('input[name="attendance"]');

    // Toggle Number of Guests input based on attendance selection
    attendanceRadios.forEach(radio => {
        radio.addEventListener('change', (e) => {
            if (e.target.value === 'declined') {
                // Fade out and collapse guests wrapper
                guestsWrapper.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
                guestsWrapper.style.opacity = '0';
                guestsWrapper.style.transform = 'translateY(-10px)';
                setTimeout(() => {
                    guestsWrapper.style.display = 'none';
                    guestsInput.removeAttribute('required');
                }, 400);
            } else {
                // Show guests wrapper
                guestsWrapper.style.display = 'block';
                guestsInput.setAttribute('required', 'required');
                // Force layout recalculation before transitioning opacity
                guestsWrapper.offsetHeight;
                guestsWrapper.style.opacity = '1';
                guestsWrapper.style.transform = 'translateY(0)';
            }
        });
    });

    // Form Submission & Animation State
    rsvpForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Basic validation checks
        const nameInput = document.getElementById('name');
        let isValid = true;

        if (!nameInput.value.trim()) {
            markInvalid(nameInput);
            isValid = false;
        } else {
            clearInvalid(nameInput);
        }

        if (!isValid) return;

        // Visual loading state on the button
        const submitBtn = document.getElementById('submit-btn');
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending Details...';
        submitBtn.style.opacity = '0.8';

        const attendance = document.querySelector('input[name="attendance"]:checked').value;
        const guestName = nameInput.value.trim();
        const guestsVal = attendance === 'accepted' ? guestsInput.value : '0';
        const notesVal = document.getElementById('notes').value.trim();

        // Function to handle the layout transition and overlay display
        const displaySuccessState = () => {
            if (attendance === 'accepted') {
                successMsg.textContent = `Dear ${guestName}, we are delighted to know that you will join us. We look forward to celebrating our betrothal with you in August!`;
            } else {
                successMsg.textContent = `Dear ${guestName}, thank you for letting us know. You will be missed, and we appreciate your warm thoughts and blessings.`;
            }

            // Display success overlay screen
            rsvpSuccessOverlay.classList.add('active');

            // Reset button state
            submitBtn.disabled = false;
            submitBtn.textContent = 'Send RSVP';
            submitBtn.style.opacity = '';
        };

        if (GOOGLE_FORM_CONFIG.enabled) {
            // Remove any previously added hidden inputs to avoid duplicates
            const oldHiddenInputs = rsvpForm.querySelectorAll('.google-form-hidden');
            oldHiddenInputs.forEach(el => el.remove());

            // Create hidden fields with Google Form names and append them to the form
            const createHiddenInput = (name, value) => {
                const input = document.createElement('input');
                input.type = 'hidden';
                input.name = name;
                input.value = value;
                input.className = 'google-form-hidden';
                rsvpForm.appendChild(input);
            };

            createHiddenInput(GOOGLE_FORM_CONFIG.entries.name, guestName);
            createHiddenInput(GOOGLE_FORM_CONFIG.entries.attendance, attendance === 'accepted' ? 'Joyfully accept' : 'Regretfully decline');
            createHiddenInput(GOOGLE_FORM_CONFIG.entries.guests, guestsVal);
            createHiddenInput(GOOGLE_FORM_CONFIG.entries.notes, notesVal);

            // Set form attributes for silent iframe submission
            rsvpForm.action = GOOGLE_FORM_CONFIG.formUrl;
            rsvpForm.method = 'POST';
            rsvpForm.target = 'hidden_iframe';

            // Submit the form programmatically (bypasses the submit listener)
            rsvpForm.submit();

            // Display success UI state immediately
            setTimeout(displaySuccessState, 500);
        } else {
            // Simulate luxury loading delay when Google Form integration is disabled
            setTimeout(() => {
                displaySuccessState();
                console.log('RSVP Details Mock Submitted:', {
                    name: guestName,
                    attendance: attendance,
                    guests: guestsVal,
                    notes: notesVal
                });
            }, 1500);
        }
    });

    function markInvalid(inputElement) {
        inputElement.style.borderBottomColor = '#df4747';
        inputElement.parentElement.style.animation = 'shake 0.3s ease';
        setTimeout(() => {
            inputElement.parentElement.style.animation = '';
        }, 300);
    }

    function clearInvalid(inputElement) {
        inputElement.style.borderBottomColor = '';
    }

    // CSS injection for input shake animation
    const style = document.createElement('style');
    style.innerHTML = `
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-4px); }
            75% { transform: translateX(4px); }
        }
    `;
    document.head.appendChild(style);


    // --- 5. Smooth Anchor Scrolling for Fixed Navigation ---
    const rsvpStickyBtn = document.getElementById('rsvp-sticky-btn');
    if (rsvpStickyBtn) {
        rsvpStickyBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = rsvpStickyBtn.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            if (targetSection) {
                targetSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }

    // --- 6. Love Story Timeline Progress Animation ---
    const progressPath = document.getElementById('timelineWavePathProgress');
    const timelineSection = document.getElementById('story-timeline');

    if (progressPath && timelineSection) {
        let pathLength = progressPath.getTotalLength();

        const initPath = () => {
            pathLength = progressPath.getTotalLength();
            progressPath.style.strokeDasharray = pathLength;
            progressPath.style.strokeDashoffset = pathLength;
        };

        initPath();

        // Recalculate path length on resize to handle responsive layouts
        window.addEventListener('resize', () => {
            initPath();
            handleTimelineScroll();
        });

        const handleTimelineScroll = () => {
            const sectionRect = timelineSection.getBoundingClientRect();
            const sectionHeight = timelineSection.offsetHeight;
            const viewportHeight = window.innerHeight;

            // Start drawing when the top of the timeline reaches 70% viewport height
            // Finish when the bottom of the timeline reaches 30% viewport height (10% clear of viewport bottom)
            const startScroll = sectionRect.top - (viewportHeight * 0.7);
            const scrollRange = sectionHeight - (viewportHeight * 0.4);

            let pct = -startScroll / scrollRange;
            pct = Math.max(0, Math.min(1, pct));

            progressPath.style.strokeDashoffset = pathLength - (pct * pathLength);
        };

        window.addEventListener('scroll', handleTimelineScroll, { passive: true });
        // Initial call in case user loads page scrolled down
        handleTimelineScroll();
    }

    // --- 6.5. Scroll-Driven Floating Countdown Items (Parallax) ---
    const countdownSection = document.querySelector('.countdown-section');
    const countdownItems = document.querySelectorAll('.countdown-item');

    const handleCountdownScroll = () => {
        if (!countdownSection) return;
        const rect = countdownSection.getBoundingClientRect();
        const viewportHeight = window.innerHeight;

        // Check if countdown section is visible in viewport
        if (rect.top < viewportHeight && rect.bottom > 0) {
            // Calculate normalization factor based on section position relative to viewport center
            const sectionCenter = rect.top + rect.height / 2;
            const viewportCenter = viewportHeight / 2;
            const centerOffset = sectionCenter - viewportCenter;

            // Apply different floating velocities/offsets to each item for organic floating
            const velocities = [-0.14, 0.1, -0.07, 0.07];

            countdownItems.forEach((item, idx) => {
                const velocity = velocities[idx % velocities.length];
                const translateY = centerOffset * velocity;
                item.style.setProperty('--scroll-translate-y', `${translateY}px`);
            });
        }
    };

    window.addEventListener('scroll', handleCountdownScroll, { passive: true });
    // Initial call to align items on load
    handleCountdownScroll();


    // --- 7. Cinematic Countdown Timer ---
    const targetDate = new Date('August 20, 2026 16:30:00').getTime();

    // Main elements
    const daysEl = document.getElementById('cd-days');
    const hoursEl = document.getElementById('cd-hours');
    const minutesEl = document.getElementById('cd-minutes');
    const secondsEl = document.getElementById('cd-seconds');
    const messageEl = document.getElementById('countdownMessage');

    // Sticky Top elements
    const topDaysEl = document.getElementById('top-cd-days');
    const topHoursEl = document.getElementById('top-cd-hours');
    const topMinutesEl = document.getElementById('top-cd-minutes');
    const topSecondsEl = document.getElementById('top-cd-seconds');
    const topCountdownBar = document.getElementById('topCountdownBar');

    const updateCountdown = () => {
        const now = new Date().getTime();
        const difference = targetDate - now;

        if (difference <= 0) {
            const zeroText = '00';
            if (daysEl) daysEl.textContent = zeroText;
            if (hoursEl) hoursEl.textContent = zeroText;
            if (minutesEl) minutesEl.textContent = zeroText;
            if (secondsEl) secondsEl.textContent = zeroText;

            if (topDaysEl) topDaysEl.textContent = zeroText;
            if (topHoursEl) topHoursEl.textContent = zeroText;
            if (topMinutesEl) topMinutesEl.textContent = zeroText;
            if (topSecondsEl) topSecondsEl.textContent = zeroText;

            if (messageEl) messageEl.textContent = "The Blessed Celebration Has Begun!";
            clearInterval(countdownInterval);
            return;
        }

        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        const dStr = String(days).padStart(2, '0');
        const hStr = String(hours).padStart(2, '0');
        const mStr = String(minutes).padStart(2, '0');
        const sStr = String(seconds).padStart(2, '0');

        if (daysEl) daysEl.textContent = dStr;
        if (hoursEl) hoursEl.textContent = hStr;
        if (minutesEl) minutesEl.textContent = mStr;
        if (secondsEl) secondsEl.textContent = sStr;

        if (topDaysEl) topDaysEl.textContent = dStr;
        if (topHoursEl) topHoursEl.textContent = hStr;
        if (topMinutesEl) topMinutesEl.textContent = mStr;
        if (topSecondsEl) topSecondsEl.textContent = sStr;
    };

    let countdownInterval;
    if (daysEl || topDaysEl) {
        updateCountdown();
        countdownInterval = setInterval(updateCountdown, 1000);
    }

    // Scroll Visibility for Sticky Top Countdown Bar
    // Displays once the main large countdown section scrolls off the top of the viewport
    const handleTopBarScroll = () => {
        if (!countdownSection || !topCountdownBar) return;
        const sectionRect = countdownSection.getBoundingClientRect();

        // Reveal sticky top bar only when the bottom of the main countdown section has scrolled out of view
        if (sectionRect.bottom < 0) {
            topCountdownBar.classList.add('show');
        } else {
            topCountdownBar.classList.remove('show');
        }
    };

    window.addEventListener('scroll', handleTopBarScroll, { passive: true });
    // Initial call to set correct visibility state on page load
    handleTopBarScroll();

    // --- 8. Add to Calendar Dropdown Interactivity ---
    const calendarDropdowns = document.querySelectorAll('.calendar-dropdown');

    calendarDropdowns.forEach(dropdown => {
        const trigger = dropdown.querySelector('.btn-calendar-trigger');
        if (trigger) {
            trigger.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                dropdown.classList.toggle('active');
                const isExpanded = dropdown.classList.contains('active');
                trigger.setAttribute('aria-expanded', isExpanded);
            });
        }
    });

    // Close dropdown on click outside
    document.addEventListener('click', () => {
        calendarDropdowns.forEach(dropdown => {
            dropdown.classList.remove('active');
            const trigger = dropdown.querySelector('.btn-calendar-trigger');
            if (trigger) trigger.setAttribute('aria-expanded', 'false');
        });
    });

    // iCal / Apple Calendar / Outlook (.ics) Download Event Handler
    const icalLinks = document.querySelectorAll('.ical-download-link');
    icalLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();

            const icsContent = [
                'BEGIN:VCALENDAR',
                'VERSION:2.0',
                'PRODID:-//Dijo and Anna Wedding//NONSGML Invitation//EN',
                'CALSCALE:GREGORIAN',
                'METHOD:PUBLISH',
                'BEGIN:VEVENT',
                'UID:dijo-anna-wedding-2026@dijoinvitation.vercel.app',
                'DTSTAMP:20260625T120000Z',
                'DTSTART;TZID=Asia/Kolkata:20260820T163000',
                'DTEND;TZID=Asia/Kolkata:20260820T210000',
                'SUMMARY:Betrothal: Dijo & Anna',
                'DESCRIPTION:You are cordially invited to celebrate the holy betrothal of Dijo J Perumalil and Anna Rajeev on Thursday\\, August 20\\, 2026.\\n\\n4:30 PM: Holy Betrothal at St. George Forane Church\\, Vazhakulam\\n6:00 PM: Reception at Parish Hall',
                'LOCATION:St. George Forane Church\\, Vazhakulam\\, Muvattupuzha\\, Kerala',
                'STATUS:CONFIRMED',
                'SEQUENCE:0',
                'END:VEVENT',
                'END:VCALENDAR'
            ].join('\r\n');

            const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8;' });
            const downloadUrl = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = downloadUrl;
            a.download = 'Dijo_Anna_Wedding.ics';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(downloadUrl);
        });
    });

    // --- 9. Invisible Autoplay Background Music Logic ---
    const bgMusic = document.getElementById('bgMusic');

    if (bgMusic) {
        // Set default volume (soft and background-friendly)
        bgMusic.volume = 0.35;

        // Force browser to start preloading/buffering the audio immediately
        bgMusic.load();

        let isPlayAttempted = false;

        const playAudio = () => {
            if (isPlayAttempted) return;
            isPlayAttempted = true;

            // Remove listeners immediately to prevent concurrent calls
            removeInteractionListeners();

            bgMusic.play()
                .then(() => {
                    console.log("Audio playing successfully.");
                })
                .catch(err => {
                    console.log("Autoplay blocked or waiting for user interaction:", err.message);
                    isPlayAttempted = false;
                    // Re-add interaction listeners in case the block was transient or requires a different gesture
                    addInteractionListeners();
                });
        };

        const autoPlayOnInteraction = () => {
            playAudio();
        };

        const addInteractionListeners = () => {
            document.addEventListener('click', autoPlayOnInteraction);
            document.addEventListener('touchstart', autoPlayOnInteraction);
            document.addEventListener('touchend', autoPlayOnInteraction);
            document.addEventListener('pointerdown', autoPlayOnInteraction);
            document.addEventListener('mousedown', autoPlayOnInteraction);
            document.addEventListener('keydown', autoPlayOnInteraction);
        };

        const removeInteractionListeners = () => {
            document.removeEventListener('click', autoPlayOnInteraction);
            document.removeEventListener('touchstart', autoPlayOnInteraction);
            document.removeEventListener('touchend', autoPlayOnInteraction);
            document.removeEventListener('pointerdown', autoPlayOnInteraction);
            document.removeEventListener('mousedown', autoPlayOnInteraction);
            document.removeEventListener('keydown', autoPlayOnInteraction);
        };

        // 1. Try to play immediately (some desktop browsers/webviews might allow it on load)
        playAudio();

        // 2. Always listen for user interactions in case autoplay is blocked (standard mobile behavior)
        addInteractionListeners();
    }
});

