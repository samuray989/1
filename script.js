/**
 * Grand L'Aura Resort & Spa - Interactivity Script
 * Handles custom animations, scrolling, page-state management, and booking validation.
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize elements
  const navbar = document.getElementById('main-navbar');
  const reservationForm = document.getElementById('reservation-form');
  const checkinInput = document.getElementById('input-checkin');
  const checkoutInput = document.getElementById('input-checkout');
  
  // Set minimum dates for check-in and check-out to today
  const today = new Date().toISOString().split('T')[0];
  checkinInput.min = today;
  checkoutInput.min = today;

  // 1. Dynamic Navbar Scroll Effect
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // 2. Scroll-Reveal Animation (Intersection Observer)
  const revealElements = document.querySelectorAll(
    '.reveal-up, .reveal-up-delay-1, .reveal-up-delay-2, .reveal-up-delay-3, .reveal-left, .reveal-right'
  );

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal-active');
        // Once revealed, no need to keep observing
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15, // trigger when 15% of element is in viewport
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));

  // 3. Date Validation: Check-Out must be after Check-In
  checkinInput.addEventListener('change', () => {
    if (checkinInput.value) {
      // Check-out date must be at least one day after check-in
      const checkinDate = new Date(checkinInput.value);
      const minCheckout = new Date(checkinDate);
      minCheckout.setDate(minCheckout.getDate() + 1);
      
      checkoutInput.min = minCheckout.toISOString().split('T')[0];
      
      if (checkoutInput.value && new Date(checkoutInput.value) <= checkinDate) {
        checkoutInput.value = '';
      }
    }
  });

  // 4. Reservation Inquiry Form Submission & Modal Handling
  reservationForm.addEventListener('submit', (e) => {
    e.preventDefault();
    e.stopPropagation();

    // Check basic HTML5 validation first
    if (!reservationForm.checkValidity()) {
      reservationForm.classList.add('was-validated');
      return;
    }

    // Verify dates logic
    const checkinDate = new Date(checkinInput.value);
    const checkoutDate = new Date(checkoutInput.value);

    if (checkoutDate <= checkinDate) {
      checkoutInput.setCustomValidity('Checkout date must be after checkin date.');
      reservationForm.classList.add('was-validated');
      return;
    } else {
      checkoutInput.setCustomValidity('');
    }

    // Capture values for Modal display
    const guestName = document.getElementById('input-name').value;
    const suiteName = document.getElementById('input-suite').value;
    const checkinVal = checkinInput.value;
    const checkoutVal = checkoutInput.value;

    // Generate pseudo booking reference ID
    const randomRef = 'LAURA-' + Math.floor(10000 + Math.random() * 90000) + String.fromCharCode(65 + Math.floor(Math.random() * 26));

    // Update Modal Content dynamically
    document.getElementById('guest-display-name').textContent = guestName;
    document.getElementById('suite-display-name').textContent = suiteName;
    document.getElementById('booking-id-display').textContent = randomRef;
    document.getElementById('arrival-date-display').textContent = formatDateString(checkinVal);
    document.getElementById('departure-date-display').textContent = formatDateString(checkoutVal);

    // Show Success Modal via Bootstrap API
    const successModal = bootstrap.Modal.getOrCreateInstance(document.getElementById('success-modal'));
    successModal.show();

    // Reset form states
    reservationForm.reset();
    reservationForm.classList.remove('was-validated');
  });
});

/**
 * Suite Selection Helper
 * Selects suite in the form dropdown and scrolls down smoothly.
 */
function selectSuite(suiteName) {
  const suiteDropdown = document.getElementById('input-suite');
  if (suiteDropdown) {
    suiteDropdown.value = suiteName;
  }
}

/**
 * Format string date (YYYY-MM-DD) into readable verbal format
 */
function formatDateString(dateStr) {
  if (!dateStr) return '-';
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateStr).toLocaleDateString('en-US', options);
}
