/**
 * Oscar's Craft Barbershop - Main JavaScript
 */

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    initMobileMenu();
    initBookingForm();
    initContactForm();
    initBackToTop();
    initSmoothScrolling();
    initGalleryLightbox();
    initFormValidation();
    initDatePicker();
    initWhatsAppButton();
});

/**
 * Mobile menu functionality
 */
function initMobileMenu() {
    const menuToggle = document.getElementById('menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');

    if (!menuToggle || !mobileMenu) return;

    menuToggle.addEventListener('click', function() {
        mobileMenu.classList.toggle('hidden');
        mobileMenu.classList.toggle('active');

        // Change icon based on menu state
        const icon = menuToggle.querySelector('i');
        if (icon) {
            if (mobileMenu.classList.contains('hidden')) {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            } else {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            }
        }
    });

    // Close menu when clicking outside
    document.addEventListener('click', function(event) {
        if (!menuToggle.contains(event.target) && !mobileMenu.contains(event.target)) {
            if (!mobileMenu.classList.contains('hidden')) {
                mobileMenu.classList.add('hidden');
                mobileMenu.classList.remove('active');

                const icon = menuToggle.querySelector('i');
                if (icon) {
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
            }
        }
    });
}

/**
 * Booking form handling
 */
function initBookingForm() {
    const appointmentForm = document.getElementById('appointment-form');
    const serviceSelect = document.getElementById('service');
    const dateInput = document.getElementById('date');
    const timeSelect = document.getElementById('time');

    if (!appointmentForm || !serviceSelect || !dateInput || !timeSelect) return;

    // Initialize available time slots
    const availableTimeSlots = {
        'Adult Haircut': ['9:00 AM', '10:00 AM', '11:00 AM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM'],
        'Kids/Teens Haircut': ['9:00 AM', '10:00 AM', '11:00 AM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM']
    };

    // Service durations in minutes
    const serviceDurations = {
        'Adult Haircut': 60,
        'Kids/Teens Haircut': 45
    };

    // Service prices
    const servicePrices = {
        'Adult Haircut': 'R100',
        'Kids/Teens Haircut': 'R70'
    };

    // Booked appointments (simulated database)
    const bookedAppointments = [
        { date: '2025-05-20', time: '10:00 AM', service: 'Adult Haircut' },
        { date: '2025-05-20', time: '2:00 PM', service: 'Kids/Teens Haircut' },
        { date: '2025-05-21', time: '11:00 AM', service: 'Adult Haircut' }
    ];

    // Booking summary elements
    const bookingSummary = document.getElementById('booking-summary');
    const summaryService = document.getElementById('summary-service');
    const summaryDate = document.getElementById('summary-date');
    const summaryTime = document.getElementById('summary-time');
    const summaryDuration = document.getElementById('summary-duration');
    const summaryPrice = document.getElementById('summary-price');

    // Update available times when service or date changes
    function updateAvailableTimes() {
        const selectedService = serviceSelect.value;
        const selectedDate = dateInput.value;

        // Clear current options
        timeSelect.innerHTML = '<option value="">Select a time</option>';

        // If service or date not selected, return early
        if (!selectedService || !selectedDate) {
            console.log("Service or date not selected");
            return;
        }

        console.log(`Updating times for service: ${selectedService}, date: ${selectedDate}`);

        // Get available times for the selected service
        let serviceTimes = [];
        if (availableTimeSlots[selectedService]) {
            serviceTimes = [...availableTimeSlots[selectedService]];
            console.log("Available service times:", serviceTimes);
        } else {
            console.error(`No time slots found for service: ${selectedService}`);
            // Fallback to default times
            serviceTimes = ['9:00 AM', '10:00 AM', '11:00 AM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM'];
        }

        // Filter out booked times for the selected date and service
        const bookedTimes = bookedAppointments
            .filter(appointment => appointment.date === selectedDate)
            .map(appointment => appointment.time);

        console.log("Booked times:", bookedTimes);

        // Add available times to the select
        serviceTimes.forEach(time => {
            if (!bookedTimes.includes(time)) {
                const option = document.createElement('option');
                option.value = time;
                option.textContent = time;
                timeSelect.appendChild(option);
            }
        });

        // If no times available, show message
        if (timeSelect.options.length === 1) {
            const option = document.createElement('option');
            option.value = "";
            option.textContent = "No available times for this date";
            option.disabled = true;
            timeSelect.appendChild(option);
        }

        console.log(`Added ${timeSelect.options.length - 1} time options`);
    }

    // Function to update booking summary
    function updateBookingSummary() {
        const selectedService = serviceSelect.value;
        const selectedDate = dateInput.value;
        const selectedTime = timeSelect.value;

        if (!selectedService || !selectedDate || !selectedTime) {
            bookingSummary.classList.add('hidden');
            return;
        }

        // Show the summary
        bookingSummary.classList.remove('hidden');

        // Update summary details
        summaryService.textContent = selectedService;
        summaryDate.textContent = formatDate(selectedDate);
        summaryTime.textContent = selectedTime;

        // Calculate end time
        const duration = serviceDurations[selectedService];
        const endTime = calculateEndTime(selectedTime, duration);
        summaryDuration.textContent = `${duration} minutes (${selectedTime} - ${endTime})`;

        // Set price
        summaryPrice.textContent = servicePrices[selectedService];
    }

    // Event listeners for service and date changes
    serviceSelect.addEventListener('change', function() {
        updateAvailableTimes();
        updateBookingSummary();
    });

    dateInput.addEventListener('change', function() {
        updateAvailableTimes();
        updateBookingSummary();
    });

    // Event listener for time changes
    timeSelect.addEventListener('change', updateBookingSummary);

    // Initialize with default times if service and date are already selected
    if (serviceSelect.value && dateInput.value) {
        updateAvailableTimes();
    }

    // Form submission
    appointmentForm.addEventListener('submit', function(e) {
        e.preventDefault();

        if (!validateForm(appointmentForm)) {
            return;
        }

        // Get form values
        const name = document.getElementById('name').value;
        const phone = document.getElementById('phone').value;
        const email = document.getElementById('email').value;
        const service = serviceSelect.value;
        const date = dateInput.value;
        const time = timeSelect.value;
        const notes = document.getElementById('notes').value;

        // Calculate end time based on service duration
        const duration = serviceDurations[service];
        const endTime = calculateEndTime(time, duration);

        // Add to booked appointments (simulated database update)
        bookedAppointments.push({ date, time, service });

        // Show booking confirmation with more details
        showBookingConfirmation(name, service, date, time, endTime, email);

        // Reset form and update available times
        appointmentForm.reset();
        timeSelect.innerHTML = '<option value="">Select a time</option>';
    });

    // Calculate end time based on start time and duration
    function calculateEndTime(startTime, durationMinutes) {
        const [hours, minutes] = startTime.match(/(\d+):(\d+)/).slice(1, 3);
        const period = startTime.includes('PM') ? 'PM' : 'AM';

        let startHour = parseInt(hours);
        if (period === 'PM' && startHour !== 12) startHour += 12;
        if (period === 'AM' && startHour === 12) startHour = 0;

        const startMinutes = parseInt(minutes);

        // Calculate end time
        let endDateTime = new Date();
        endDateTime.setHours(startHour, startMinutes + durationMinutes, 0, 0);

        // Format end time
        let endHour = endDateTime.getHours();
        const endMinutes = endDateTime.getMinutes();
        const endPeriod = endHour >= 12 ? 'PM' : 'AM';

        if (endHour > 12) endHour -= 12;
        if (endHour === 0) endHour = 12;

        return `${endHour}:${endMinutes.toString().padStart(2, '0')} ${endPeriod}`;
    }
}

/**
 * Form validation
 */
function validateForm(form) {
    let isValid = true;
    const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');

    // Remove any existing error messages
    const errorMessages = form.querySelectorAll('.error-message');
    errorMessages.forEach(el => el.remove());

    // Reset all inputs
    inputs.forEach(input => {
        input.classList.remove('border-red-500');
    });

    // Check each required field
    inputs.forEach(input => {
        if (!input.value.trim()) {
            isValid = false;
            input.classList.add('border-red-500');

            // Add error message
            const errorMessage = document.createElement('p');
            errorMessage.className = 'text-red-500 text-sm mt-1 error-message';
            errorMessage.textContent = 'This field is required';
            input.parentNode.appendChild(errorMessage);
        } else if (input.type === 'email' && !isValidEmail(input.value)) {
            isValid = false;
            input.classList.add('border-red-500');

            // Add error message
            const errorMessage = document.createElement('p');
            errorMessage.className = 'text-red-500 text-sm mt-1 error-message';
            errorMessage.textContent = 'Please enter a valid email address';
            input.parentNode.appendChild(errorMessage);
        } else if (input.id === 'phone' && !isValidPhone(input.value)) {
            isValid = false;
            input.classList.add('border-red-500');

            // Add error message
            const errorMessage = document.createElement('p');
            errorMessage.className = 'text-red-500 text-sm mt-1 error-message';
            errorMessage.textContent = 'Please enter a valid phone number';
            input.parentNode.appendChild(errorMessage);
        }
    });

    return isValid;
}

/**
 * Email validation
 */
function isValidEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

/**
 * Phone validation
 */
function isValidPhone(phone) {
    // Basic validation - can be enhanced for specific formats
    const re = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/;
    return re.test(String(phone));
}

/**
 * Show booking confirmation
 */
function showBookingConfirmation(name, service, date, time, endTime, email) {
    // Format date for display
    const formattedDate = formatDate(date);

    // Create booking reference number
    const bookingRef = generateBookingReference();

    // Create modal for better UX
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 flex items-center justify-center z-50';
    modal.innerHTML = `
        <div class="fixed inset-0 bg-black opacity-50"></div>
        <div class="bg-white rounded-lg p-8 max-w-md w-full relative z-10">
            <h3 class="text-2xl font-bold text-gray-800 mb-4">Booking Confirmed!</h3>
            <div class="bg-green-50 border-l-4 border-green-500 p-4 mb-6">
                <p class="text-green-700">Your booking has been confirmed. A confirmation email has been sent to ${email}.</p>
            </div>
            <div class="mb-6">
                <h4 class="font-bold text-gray-700 mb-2">Booking Details:</h4>
                <ul class="space-y-2 text-gray-600">
                    <li><span class="font-semibold">Name:</span> ${name}</li>
                    <li><span class="font-semibold">Service:</span> ${service}</li>
                    <li><span class="font-semibold">Date:</span> ${formattedDate}</li>
                    <li><span class="font-semibold">Time:</span> ${time} - ${endTime}</li>
                    <li><span class="font-semibold">Booking Reference:</span> <span class="text-amber-600 font-mono">${bookingRef}</span></li>
                </ul>
            </div>
            <div class="bg-gray-50 p-4 rounded mb-6 text-sm text-gray-500">
                <p class="mb-2"><i class="fas fa-info-circle mr-2"></i> Please arrive 5 minutes before your appointment time.</p>
                <p><i class="fas fa-calendar-alt mr-2"></i> You can reschedule or cancel your appointment up to 24 hours before the scheduled time by calling us.</p>
            </div>
            <div class="flex space-x-4">
                <button class="flex-1 bg-amber-600 hover:bg-amber-700 text-white font-bold py-3 px-4 rounded-lg transition duration-300" id="confirm-close">
                    Close
                </button>
                <button class="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-3 px-4 rounded-lg transition duration-300" id="add-calendar">
                    <i class="fas fa-calendar-plus mr-2"></i> Add to Calendar
                </button>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    // Close modal on button click
    document.getElementById('confirm-close').addEventListener('click', function() {
        modal.remove();
    });

    // Add to calendar functionality
    document.getElementById('add-calendar').addEventListener('click', function() {
        addToCalendar(name, service, date, time, endTime);
    });

    // Close modal when clicking outside
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.remove();
        }
    });

    // Simulate sending confirmation email
    simulateSendEmail(name, email, service, formattedDate, time, endTime, bookingRef);
}

/**
 * Format date for display (YYYY-MM-DD to Day, Month DD, YYYY)
 */
function formatDate(dateString) {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', options);
}

/**
 * Generate a random booking reference
 */
function generateBookingReference() {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let result = 'OC-';
    for (let i = 0; i < 6; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

/**
 * Add appointment to calendar (generates an .ics file)
 */
function addToCalendar(name, service, date, startTime, endTime) {
    // Parse date and times
    const [year, month, day] = date.split('-').map(Number);

    // Parse start time
    let [startHour, startMinute] = startTime.match(/(\d+):(\d+)/).slice(1, 3).map(Number);
    const startPeriod = startTime.includes('PM');
    if (startPeriod && startHour !== 12) startHour += 12;
    if (!startPeriod && startHour === 12) startHour = 0;

    // Parse end time
    let [endHour, endMinute] = endTime.match(/(\d+):(\d+)/).slice(1, 3).map(Number);
    const endPeriod = endTime.includes('PM');
    if (endPeriod && endHour !== 12) endHour += 12;
    if (!endPeriod && endHour === 12) endHour = 0;

    // Create start and end date objects
    const startDate = new Date(year, month - 1, day, startHour, startMinute);
    const endDate = new Date(year, month - 1, day, endHour, endMinute);

    // Format dates for iCalendar
    const formatICSDate = (date) => {
        return date.toISOString().replace(/-|:|\.\d+/g, '');
    };

    // Create iCalendar content
    const icsContent = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'PRODID:-//Oscar\'s Craft Barbershop//EN',
        'CALSCALE:GREGORIAN',
        'BEGIN:VEVENT',
        `SUMMARY:${service} at Oscar's Craft Barbershop`,
        `DTSTART:${formatICSDate(startDate)}`,
        `DTEND:${formatICSDate(endDate)}`,
        `LOCATION:3 Ascent Avenue, South Hills, Johannesburg South, 2197`,
        `DESCRIPTION:Your appointment for ${service} at Oscar's Craft Barbershop.\\nPlease arrive 5 minutes early.\\nPhone: +27 71 983 7228`,
        'STATUS:CONFIRMED',
        `ORGANIZER;CN=Oscar's Craft Barbershop:mailto:hello@oscarscraft.com`,
        'END:VEVENT',
        'END:VCALENDAR'
    ].join('\r\n');

    // Create a blob and download link
    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `oscars_craft_appointment_${date}.ics`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

/**
 * Simulate sending a confirmation email
 */
function simulateSendEmail(name, email, service, date, startTime, endTime, bookingRef) {
    console.log(`Sending confirmation email to ${email}`);
    console.log(`Subject: Your Appointment Confirmation - ${bookingRef}`);
    console.log(`Body: Dear ${name}, your appointment for ${service} on ${date} at ${startTime} has been confirmed.`);

    // In a real application, this would connect to an email service
}

/**
 * Back to top button
 */
function initBackToTop() {
    const backToTopButton = document.getElementById('back-to-top');

    if (!backToTopButton) return;

    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            backToTopButton.classList.remove('opacity-0', 'invisible');
            backToTopButton.classList.add('opacity-100', 'visible');
        } else {
            backToTopButton.classList.remove('opacity-100', 'visible');
            backToTopButton.classList.add('opacity-0', 'invisible');
        }
    });

    backToTopButton.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

/**
 * Smooth scrolling for navigation
 */
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop,
                    behavior: 'smooth'
                });

                // Close mobile menu if open
                const mobileMenu = document.getElementById('mobile-menu');
                if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
                    mobileMenu.classList.add('hidden');
                    mobileMenu.classList.remove('active');

                    const menuToggle = document.getElementById('menu-toggle');
                    if (menuToggle) {
                        const icon = menuToggle.querySelector('i');
                        if (icon) {
                            icon.classList.remove('fa-times');
                            icon.classList.add('fa-bars');
                        }
                    }
                }
            }
        });
    });
}

/**
 * Gallery lightbox functionality
 */
function initGalleryLightbox() {
    // Create lightbox container
    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    lightbox.innerHTML = `
        <div class="lightbox-content">
            <img src="" alt="Gallery image" id="lightbox-image">
        </div>
        <span class="lightbox-close">&times;</span>
        <div class="lightbox-nav">
            <button class="lightbox-prev"><i class="fas fa-chevron-left"></i></button>
            <button class="lightbox-next"><i class="fas fa-chevron-right"></i></button>
        </div>
    `;
    document.body.appendChild(lightbox);

    // Get all gallery images
    const galleryItems = document.querySelectorAll('.gallery-item img');
    let currentIndex = 0;

    // Add click event to gallery images
    galleryItems.forEach((item, index) => {
        item.addEventListener('click', function() {
            currentIndex = index;
            updateLightboxImage();
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden'; // Prevent scrolling
        });
    });

    // Close lightbox
    const closeButton = lightbox.querySelector('.lightbox-close');
    closeButton.addEventListener('click', closeLightbox);

    // Close on background click
    lightbox.addEventListener('click', function(e) {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });

    // Navigation
    const prevButton = lightbox.querySelector('.lightbox-prev');
    const nextButton = lightbox.querySelector('.lightbox-next');

    prevButton.addEventListener('click', function() {
        currentIndex = (currentIndex - 1 + galleryItems.length) % galleryItems.length;
        updateLightboxImage();
    });

    nextButton.addEventListener('click', function() {
        currentIndex = (currentIndex + 1) % galleryItems.length;
        updateLightboxImage();
    });

    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (!lightbox.classList.contains('active')) return;

        if (e.key === 'Escape') {
            closeLightbox();
        } else if (e.key === 'ArrowLeft') {
            currentIndex = (currentIndex - 1 + galleryItems.length) % galleryItems.length;
            updateLightboxImage();
        } else if (e.key === 'ArrowRight') {
            currentIndex = (currentIndex + 1) % galleryItems.length;
            updateLightboxImage();
        }
    });

    function updateLightboxImage() {
        const lightboxImage = document.getElementById('lightbox-image');
        lightboxImage.src = galleryItems[currentIndex].src;
        lightboxImage.alt = galleryItems[currentIndex].alt;
    }

    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = ''; // Restore scrolling
    }
}

/**
 * Form validation for all forms
 */
function initFormValidation() {
    const forms = document.querySelectorAll('form');

    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            if (!validateForm(form)) {
                e.preventDefault();
            }
        });
    });
}

/**
 * Contact form handling
 */
function initContactForm() {
    const contactForm = document.querySelector('.contact-form');

    if (!contactForm) return;

    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();

        if (!validateForm(contactForm)) {
            return;
        }

        // Get form values
        const name = document.getElementById('contact-name').value;
        const email = document.getElementById('contact-email').value;
        const subject = document.getElementById('contact-subject').value;
        const message = document.getElementById('contact-message').value;

        // Show confirmation message
        showContactConfirmation(name);

        // Reset form
        contactForm.reset();
    });
}

/**
 * Show contact form confirmation
 */
function showContactConfirmation(name) {
    // Create modal for better UX
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 flex items-center justify-center z-50';
    modal.innerHTML = `
        <div class="fixed inset-0 bg-black opacity-50"></div>
        <div class="bg-white rounded-lg p-8 max-w-md w-full relative z-10">
            <h3 class="text-2xl font-bold text-gray-800 mb-4">Message Sent!</h3>
            <p class="text-gray-600 mb-6">Thanks, ${name}! Your message has been sent. We'll get back to you as soon as possible.</p>
            <button class="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold py-3 px-4 rounded-lg transition duration-300" id="contact-close">
                Close
            </button>
        </div>
    `;

    document.body.appendChild(modal);

    // Close modal on button click
    document.getElementById('contact-close').addEventListener('click', function() {
        modal.remove();
    });

    // Close modal when clicking outside
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.remove();
        }
    });
}

/**
 * Initialize date picker with restrictions
 */
function initDatePicker() {
    const dateInput = document.getElementById('date');

    if (!dateInput) return;

    // Set min date to today
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');

    dateInput.min = `${year}-${month}-${day}`;

    // Set max date to 3 months from now
    const maxDate = new Date();
    maxDate.setMonth(maxDate.getMonth() + 3);
    const maxYear = maxDate.getFullYear();
    const maxMonth = String(maxDate.getMonth() + 1).padStart(2, '0');
    const maxDay = String(maxDate.getDate()).padStart(2, '0');

    dateInput.max = `${maxYear}-${maxMonth}-${maxDay}`;

    // Disable Sundays (0 = Sunday, 6 = Saturday)
    dateInput.addEventListener('input', function() {
        const selectedDate = new Date(this.value);
        const dayOfWeek = selectedDate.getDay();

        if (dayOfWeek === 0) { // Sunday
            alert('Sorry, we are closed on Sundays. Please select another day.');
            this.value = '';
        }
    });
}

/**
 * Initialize WhatsApp button with dynamic message
 */
function initWhatsAppButton() {
    const whatsappLinks = document.querySelectorAll('a[href^="https://wa.me/"]');

    whatsappLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Get current date and time
            const now = new Date();
            const formattedDate = now.toLocaleDateString();

            // Create message
            const message = `Hello Oscar! I'm interested in booking an appointment on ${formattedDate}. Can you help me?`;

            // Update link with encoded message
            const baseUrl = this.href.split('?')[0];
            this.href = `${baseUrl}?text=${encodeURIComponent(message)}`;
        });
    });
}
