// ===== NAVIGATION =====
const header = document.getElementById('header');
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');
const navLinkItems = document.querySelectorAll('.nav-link');

// Scroll handler for header
function handleScroll() {
  if (window.scrollY > 50) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
}

window.addEventListener('scroll', handleScroll);
handleScroll();

// Mobile menu toggle
hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('active');
  navLinks.classList.toggle('open');
  document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
});

// Close mobile menu on link click
navLinkItems.forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navLinks.classList.remove('open');
    document.body.style.overflow = '';
  });
});

// Active nav link on scroll
function updateActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const scrollPos = window.scrollY + 120;

  sections.forEach(section => {
    const top = section.offsetTop;
    const height = section.offsetHeight;
    const id = section.getAttribute('id');

    if (scrollPos >= top && scrollPos < top + height) {
      navLinkItems.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${id}`) {
          link.classList.add('active');
        }
      });
    }
  });
}

window.addEventListener('scroll', updateActiveNav);

// ===== HERO STATS COUNTER =====
function animateCounters() {
  const counters = document.querySelectorAll('.stat-number');
  counters.forEach(counter => {
    const target = parseInt(counter.getAttribute('data-target'));
    const duration = 2000;
    const startTime = performance.now();

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      counter.textContent = Math.floor(target * eased).toLocaleString();

      if (progress < 1) {
        requestAnimationFrame(update);
      }
    }

    requestAnimationFrame(update);
  });
}

// Intersection Observer for stats
const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounters();
      statsObserver.disconnect();
    }
  });
}, { threshold: 0.5 });

const heroStats = document.querySelector('.hero-stats');
if (heroStats) {
  statsObserver.observe(heroStats);
}

// ===== SERVICE TABS =====
const tabBtns = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');

tabBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const tab = btn.getAttribute('data-tab');

    tabBtns.forEach(b => b.classList.remove('active'));
    tabContents.forEach(c => c.classList.remove('active'));

    btn.classList.add('active');
    document.getElementById(`tab-${tab}`).classList.add('active');
  });
});

// ===== CONTACT FORM =====
const contactForm = document.getElementById('contactForm');

contactForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const formData = new FormData(contactForm);
  const data = Object.fromEntries(formData.entries());

  // Validate
  if (!data.name || !data.email || !data.subject || !data.message) {
    showNotification('Please fill in all required fields.', 'error');
    return;
  }

  // Simulate submission
  const submitBtn = contactForm.querySelector('button[type="submit"]');
  const originalText = submitBtn.innerHTML;
  submitBtn.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="spin"><circle cx="12" cy="12" r="10"/></svg> Sending...';
  submitBtn.disabled = true;

  setTimeout(() => {
    submitBtn.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg> Message Sent!';
    submitBtn.style.background = '#16a34a';

    showNotification('Thank you! Your message has been sent. We will get back to you shortly.', 'success');

    setTimeout(() => {
      contactForm.reset();
      submitBtn.innerHTML = originalText;
      submitBtn.disabled = false;
      submitBtn.style.background = '';
    }, 3000);
  }, 1500);
});

// ===== NEWSLETTER FORM =====
const newsletterForm = document.getElementById('newsletterForm');

newsletterForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const input = newsletterForm.querySelector('input');
  const email = input.value.trim();

  if (!email || !isValidEmail(email)) {
    showNotification('Please enter a valid email address.', 'error');
    return;
  }

  const btn = newsletterForm.querySelector('button');
  btn.textContent = 'Subscribed!';
  btn.style.background = '#16a34a';

  showNotification('You have been subscribed to PPAU SACCO newsletter!', 'success');

  setTimeout(() => {
    input.value = '';
    btn.textContent = 'Subscribe';
    btn.style.background = '';
  }, 3000);
});

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// ===== NOTIFICATION SYSTEM =====
function showNotification(message, type = 'info') {
  // Remove existing notifications
  const existing = document.querySelector('.notification');
  if (existing) existing.remove();

  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.innerHTML = `
    <div class="notification-content">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        ${type === 'success'
          ? '<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>'
          : '<circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>'}
      </svg>
      <span>${message}</span>
    </div>
    <button class="notification-close" onclick="this.parentElement.remove()">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
      </svg>
    </button>
  `;

  // Add styles if not already present
  if (!document.getElementById('notificationStyles')) {
    const style = document.createElement('style');
    style.id = 'notificationStyles';
    style.textContent = `
      .notification {
        position: fixed;
        top: 100px;
        right: 24px;
        z-index: 9999;
        background: white;
        border-radius: 12px;
        padding: 16px 20px;
        box-shadow: 0 20px 40px rgba(0,0,0,0.15);
        display: flex;
        align-items: center;
        gap: 12px;
        max-width: 420px;
        animation: slideInRight 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        border-left: 4px solid;
      }
      .notification-success { border-color: #16a34a; }
      .notification-error { border-color: #dc2626; }
      .notification-info { border-color: #3b82f6; }
      .notification-content {
        display: flex;
        align-items: center;
        gap: 12px;
        flex: 1;
      }
      .notification-success .notification-content svg { color: #16a34a; }
      .notification-error .notification-content svg { color: #dc2626; }
      .notification-info .notification-content svg { color: #3b82f6; }
      .notification span { font-size: 0.9rem; color: #374151; line-height: 1.4; }
      .notification-close {
        background: none;
        border: none;
        cursor: pointer;
        color: #9ca3af;
        padding: 4px;
        transition: color 0.2s;
      }
      .notification-close:hover { color: #374151; }
      @keyframes slideInRight {
        from { opacity: 0; transform: translateX(100px); }
        to { opacity: 1; transform: translateX(0); }
      }
      @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }
      .spin { animation: spin 1s linear infinite; }
    `;
    document.head.appendChild(style);
  }

  document.body.appendChild(notification);

  // Auto-remove after 5 seconds
  setTimeout(() => {
    if (notification.parentElement) {
      notification.style.animation = 'slideInRight 0.4s cubic-bezier(0.4, 0, 0.2, 1) reverse';
      setTimeout(() => notification.remove(), 400);
    }
  }, 5000);
}

// ===== SCROLL ANIMATIONS =====
const fadeElements = document.querySelectorAll(
  '.about-content, .about-mission, .service-card, .membership-card, .leader-card, .news-card, .contact-info, .contact-form-wrapper'
);

fadeElements.forEach(el => el.classList.add('fade-in'));

const fadeObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      fadeObserver.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
});

fadeElements.forEach(el => fadeObserver.observe(el));

// ===== BACK TO TOP =====
const backToTop = document.getElementById('backToTop');

window.addEventListener('scroll', () => {
  if (window.scrollY > 500) {
    backToTop.classList.add('visible');
  } else {
    backToTop.classList.remove('visible');
  }
});

backToTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ===== HERO PARTICLES =====
function createParticles() {
  const container = document.getElementById('heroParticles');
  if (!container) return;

  for (let i = 0; i < 30; i++) {
    const particle = document.createElement('div');
    const size = Math.random() * 6 + 2;

    particle.style.cssText = `
      position: absolute;
      width: ${size}px;
      height: ${size}px;
      background: rgba(255, 255, 255, ${Math.random() * 0.15 + 0.05});
      border-radius: 50%;
      left: ${Math.random() * 100}%;
      top: ${Math.random() * 100}%;
      animation: float ${Math.random() * 10 + 10}s linear infinite;
      animation-delay: ${Math.random() * 10}s;
    `;

    container.appendChild(particle);
  }

  // Add float animation
  if (!document.getElementById('particleStyles')) {
    const style = document.createElement('style');
    style.id = 'particleStyles';
    style.textContent = `
      @keyframes float {
        0% { transform: translateY(100vh) rotate(0deg); opacity: 0; }
        10% { opacity: 1; }
        90% { opacity: 1; }
        100% { transform: translateY(-10vh) rotate(720deg); opacity: 0; }
      }
    `;
    document.head.appendChild(style);
  }
}

createParticles();

// ===== SMOOTH SCROLL FOR ANCHOR LINKS =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

// ===== LOADING ANIMATION =====
window.addEventListener('load', () => {
  document.body.style.opacity = '1';
});

// ==================================================================
// PORTAL JAVASCRIPT
// ==================================================================

// Check if we're on the portal page
const isPortal = !!document.getElementById('authSection');

if (isPortal) {
  initPortal();
}

function initPortal() {
  // Handle hash-based navigation
  handlePortalHash();

  // Login form
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', handleLogin);
  }

  // Register form
  const registerForm = document.getElementById('registerForm');
  if (registerForm) {
    registerForm.addEventListener('submit', handleRegister);
  }

  // Step navigation
  const nextBtn = document.getElementById('nextStep');
  const prevBtn = document.getElementById('prevStep');
  if (nextBtn) nextBtn.addEventListener('click', nextFormStep);
  if (prevBtn) prevBtn.addEventListener('click', prevFormStep);

  // Password strength
  const regPassword = document.getElementById('regPassword');
  if (regPassword) {
    regPassword.addEventListener('input', checkPasswordStrength);
  }
}

// Hash navigation
function handlePortalHash() {
  const hash = window.location.hash.replace('#', '');
  if (hash === 'register') {
    showPanel('register');
  } else if (hash === 'login') {
    showPanel('login');
  } else if (hash === 'payments') {
    showPanel('payment');
  } else if (hash === 'dashboard') {
    showDashboard();
  }
}

window.addEventListener('hashchange', handlePortalHash);

// Panel switching
function showPanel(panel) {
  const loginPanel = document.getElementById('loginPanel');
  const registerPanel = document.getElementById('registerPanel');
  const paymentPanel = document.getElementById('paymentPanel');
  const authSection = document.getElementById('authSection');

  if (!loginPanel) return;

  loginPanel.classList.remove('active');
  registerPanel.classList.remove('active');
  paymentPanel.classList.remove('active');
  authSection.style.display = '';

  // Update nav links
  document.querySelectorAll('.portal-nav-link').forEach(l => l.classList.remove('active'));

  if (panel === 'login') {
    loginPanel.classList.add('active');
    document.getElementById('navToLogin')?.classList.add('active');
  } else if (panel === 'register') {
    registerPanel.classList.add('active');
    document.getElementById('navToRegister')?.classList.add('active');
  } else if (panel === 'payment') {
    paymentPanel.classList.add('active');
    document.getElementById('navToPayments')?.classList.add('active');
  }
}

// Login handler
function handleLogin(e) {
  e.preventDefault();
  const email = document.getElementById('loginEmail').value.trim();
  const password = document.getElementById('loginPassword').value;

  if (!email || !password) {
    showPortalNotification('Please fill in all fields.', 'error');
    return;
  }

  const btn = e.target.querySelector('button[type="submit"]');
  const originalText = btn.innerHTML;
  btn.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="spin"><circle cx="12" cy="12" r="10"/></svg> Signing in...';
  btn.disabled = true;

  // Simulate login
  setTimeout(() => {
    btn.innerHTML = originalText;
    btn.disabled = false;

    // Store login state
    localStorage.setItem('ppau_logged_in', 'true');
    localStorage.setItem('ppau_user_name', 'John');
    localStorage.setItem('ppau_user_fullname', 'John Doe');
    localStorage.setItem('ppau_member_id', 'PPAU-2026-0001');

    showDashboard();
    showPortalNotification('Welcome back, John! Redirecting to dashboard...', 'success');
  }, 1500);
}

// Show dashboard
function showDashboard() {
  const authSection = document.getElementById('authSection');
  const dashSection = document.getElementById('dashboardSection');

  if (!authSection || !dashSection) return;

  authSection.style.display = 'none';
  dashSection.style.display = 'block';

  // Update nav
  document.querySelectorAll('.portal-nav-link').forEach(l => l.classList.remove('active'));
  document.getElementById('navToRegister').style.display = 'none';
  document.getElementById('navToLogin').textContent = 'Dashboard';
  document.getElementById('navToLogin').classList.add('active');
  document.getElementById('navToLogin').href = '#dashboard';
  document.getElementById('navToPayments').style.display = 'inline-flex';

  // Set user data
  const name = localStorage.getItem('ppau_user_name') || 'Member';
  const fullname = localStorage.getItem('ppau_user_fullname') || 'Member';
  const memberId = localStorage.getItem('ppau_member_id') || 'PPAU-2026-XXXX';

  const welcomeName = document.getElementById('dashWelcomeName');
  const dashName = document.getElementById('dashName');
  const dashMemberId = document.getElementById('dashMemberId');

  if (welcomeName) welcomeName.textContent = name;
  if (dashName) dashName.textContent = fullname;
  if (dashMemberId) dashMemberId.textContent = memberId;
}

// Logout
function logout() {
  localStorage.removeItem('ppau_logged_in');
  localStorage.removeItem('ppau_user_name');
  localStorage.removeItem('ppau_user_fullname');
  localStorage.removeItem('ppau_member_id');

  const authSection = document.getElementById('authSection');
  const dashSection = document.getElementById('dashboardSection');

  if (dashSection) dashSection.style.display = 'none';
  if (authSection) authSection.style.display = '';

  // Reset nav
  document.getElementById('navToRegister').style.display = '';
  document.getElementById('navToLogin').textContent = 'Sign In';
  document.getElementById('navToLogin').href = '#login';
  document.getElementById('navToPayments').style.display = 'none';

  showPanel('login');
  showPortalNotification('You have been logged out.', 'info');
}

// Check if already logged in on page load
if (isPortal && localStorage.getItem('ppau_logged_in') === 'true') {
  const hash = window.location.hash.replace('#', '');
  if (!hash || hash === 'login') {
    showDashboard();
  }
}

// Registration form steps
let currentStep = 1;
const totalSteps = 3;

function nextFormStep() {
  if (currentStep >= totalSteps) return;

  // Basic validation for current step
  const currentStepEl = document.querySelector(`.form-step[data-step="${currentStep}"]`);
  const requiredInputs = currentStepEl.querySelectorAll('[required]');
  let valid = true;

  requiredInputs.forEach(input => {
    if (!input.value.trim()) {
      valid = false;
      input.style.borderColor = '#dc2626';
      setTimeout(() => { input.style.borderColor = ''; }, 2000);
    }
  });

  if (!valid) {
    showPortalNotification('Please fill in all required fields.', 'error');
    return;
  }

  // Check password match on step 3
  if (currentStep === 2) {
    const pw = document.getElementById('regPassword');
    const cpw = document.getElementById('regConfirmPassword');
    if (pw && cpw && pw.value !== cpw.value) {
      showPortalNotification('Passwords do not match.', 'error');
      cpw.style.borderColor = '#dc2626';
      return;
    }
  }

  currentStep++;
  updateFormSteps();
}

function prevFormStep() {
  if (currentStep <= 1) return;
  currentStep--;
  updateFormSteps();
}

function updateFormSteps() {
  // Update steps
  document.querySelectorAll('.form-step').forEach(step => {
    step.classList.remove('active');
  });
  document.querySelector(`.form-step[data-step="${currentStep}"]`).classList.add('active');

  // Update dots
  document.querySelectorAll('.step-dot').forEach(dot => {
    const dotStep = parseInt(dot.getAttribute('data-step'));
    dot.classList.remove('active', 'completed');
    if (dotStep === currentStep) dot.classList.add('active');
    if (dotStep < currentStep) dot.classList.add('completed');
  });

  // Update buttons
  const prevBtn = document.getElementById('prevStep');
  const nextBtn = document.getElementById('nextStep');
  const submitBtn = document.getElementById('submitRegistration');

  prevBtn.style.display = currentStep > 1 ? '' : 'none';
  nextBtn.style.display = currentStep < totalSteps ? '' : 'none';
  submitBtn.style.display = currentStep === totalSteps ? '' : 'none';
}

// Register handler
function handleRegister(e) {
  e.preventDefault();

  const btn = document.getElementById('submitRegistration');
  const originalText = btn.innerHTML;
  btn.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="spin"><circle cx="12" cy="12" r="10"/></svg> Creating Account...';
  btn.disabled = true;

  // Collect form data
  const formData = {
    firstName: document.getElementById('regFirstName').value,
    lastName: document.getElementById('regLastName').value,
    email: document.getElementById('regEmail').value,
    phone: document.getElementById('regPhone').value,
  };

  // Simulate registration
  setTimeout(() => {
    btn.innerHTML = originalText;
    btn.disabled = false;

    // Generate member ID
    const memberId = 'PPAU-2026-' + String(Math.floor(Math.random() * 9000) + 1000);

    // Store user data
    localStorage.setItem('ppau_logged_in', 'true');
    localStorage.setItem('ppau_user_name', formData.firstName);
    localStorage.setItem('ppau_user_fullname', `${formData.firstName} ${formData.lastName}`);
    localStorage.setItem('ppau_member_id', memberId);
    localStorage.setItem('ppau_user_email', formData.email);

    // Show payment panel
    showPanel('payment');
    showPortalNotification(`Registration successful! Your Member ID is ${memberId}. Please complete payment to activate your account.`, 'success');
  }, 2000);
}

// Payment method selection
function selectPaymentMethod(card) {
  const method = card.getAttribute('data-method');

  // Remove previous selection
  document.querySelectorAll('.payment-method-card').forEach(c => {
    c.classList.remove('selected');
  });

  // Select this one
  card.classList.add('selected');
}

// Copy to clipboard
function copyToClipboard(text) {
  navigator.clipboard.writeText(text).then(() => {
    const btn = event.target.closest('.copy-btn');
    if (btn) {
      const originalHTML = btn.innerHTML;
      btn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg> Copied!';
      btn.classList.add('copied');
      setTimeout(() => {
        btn.innerHTML = originalHTML;
        btn.classList.remove('copied');
      }, 2000);
    }
    showPortalNotification('Number copied to clipboard!', 'success');
  }).catch(() => {
    // Fallback for older browsers
    const textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
    showPortalNotification('Number copied to clipboard!', 'success');
  });
}

// File upload handler
function handleProofUpload(input, method) {
  const file = input.files[0];
  if (!file) return;

  if (file.size > 5 * 1024 * 1024) {
    showPortalNotification('File size must be under 5MB.', 'error');
    input.value = '';
    return;
  }

  const preview = input.closest('.upload-proof').querySelector('.upload-preview');
  if (preview) {
    preview.style.display = 'block';

    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        preview.innerHTML = `
          <div style="display:flex;align-items:center;gap:12px;">
            <img src="${e.target.result}" style="width:60px;height:60px;object-fit:cover;border-radius:8px;" />
            <div>
              <strong style="font-size:0.85rem;color:var(--gray-900);">${file.name}</strong>
              <p style="font-size:0.75rem;color:var(--gray-500);margin-top:2px;">${(file.size / 1024).toFixed(1)} KB - Ready to submit</p>
            </div>
          </div>
        `;
      };
      reader.readAsDataURL(file);
    } else {
      preview.innerHTML = `
        <div style="display:flex;align-items:center;gap:12px;">
          <div style="width:60px;height:60px;background:var(--blue-100);border-radius:8px;display:flex;align-items:center;justify-content:center;">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--blue-700)" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
          </div>
          <div>
            <strong style="font-size:0.85rem;color:var(--gray-900);">${file.name}</strong>
            <p style="font-size:0.75rem;color:var(--gray-500);margin-top:2px;">${(file.size / 1024).toFixed(1)} KB - Ready to submit</p>
          </div>
        </div>
      `;
    }
  }

  showPortalNotification('Proof of payment uploaded successfully.', 'success');
}

// Confirm payment
function confirmPayment() {
  const selected = document.querySelector('.payment-method-card.selected');
  if (!selected) {
    showPortalNotification('Please select a payment method first.', 'error');
    return;
  }

  const method = selected.getAttribute('data-method');
  const methodNames = {
    bank: 'Bank Transfer',
    airtel: 'Airtel Money',
    momo: 'MTN MoMo',
    visa: 'Visa Card'
  };

  // Check if there's an uploaded file (except for card payments)
  if (method !== 'visa') {
    const hasUpload = selected.querySelector('.upload-preview[style*="block"], .upload-preview:not([style*="none"])');
    const uploadPreview = selected.querySelector('.upload-preview');
    if (!uploadPreview || uploadPreview.style.display === 'none' || !uploadPreview.innerHTML.trim()) {
      showPortalNotification('Please upload proof of payment before confirming.', 'error');
      return;
    }
  }

  const btn = event.target;
  const originalText = btn.innerHTML;
  btn.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="spin"><circle cx="12" cy="12" r="10"/></svg> Processing...';
  btn.disabled = true;

  setTimeout(() => {
    btn.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg> Payment Confirmed!';
    btn.style.background = '#16a34a';

    showPortalNotification(`Payment via ${methodNames[method]} submitted successfully! Our team will verify and activate your account within 24-48 hours.`, 'success');

    // Redirect to dashboard after delay
    setTimeout(() => {
      showDashboard();
    }, 3000);
  }, 2000);
}

// Card payment processing
function processCardPayment() {
  const cardName = document.getElementById('cardName')?.value;
  const cardNumber = document.getElementById('cardNumber')?.value;
  const cardExpiry = document.getElementById('cardExpiry')?.value;
  const cardCvv = document.getElementById('cardCvv')?.value;

  if (!cardName || !cardNumber || !cardExpiry || !cardCvv) {
    showPortalNotification('Please fill in all card details.', 'error');
    return;
  }

  if (cardNumber.replace(/\s/g, '').length < 16) {
    showPortalNotification('Please enter a valid 16-digit card number.', 'error');
    return;
  }

  const btn = event.target;
  const originalText = btn.innerHTML;
  btn.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="spin"><circle cx="12" cy="12" r="10"/></svg> Processing Payment...';
  btn.disabled = true;

  setTimeout(() => {
    btn.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg> Payment Successful!';
    btn.style.background = '#16a34a';

    showPortalNotification('Card payment of UGX 150,000 processed successfully! Redirecting to your dashboard...', 'success');

    setTimeout(() => {
      showDashboard();
    }, 3000);
  }, 2500);
}

// Format card number with spaces
function formatCardNumber(input) {
  let value = input.value.replace(/\D/g, '');
  value = value.replace(/(\d{4})(?=\d)/g, '$1 ');
  input.value = value.substring(0, 19);
}

// Format expiry date
function formatExpiry(input) {
  let value = input.value.replace(/\D/g, '');
  if (value.length >= 2) {
    value = value.substring(0, 2) + '/' + value.substring(2);
  }
  input.value = value.substring(0, 5);
}

// Password strength checker
function checkPasswordStrength() {
  const password = document.getElementById('regPassword').value;
  const strengthFill = document.querySelector('.strength-fill');
  const strengthText = document.querySelector('.strength-text');

  if (!strengthFill || !strengthText) return;

  let strength = 0;
  if (password.length >= 8) strength++;
  if (password.length >= 12) strength++;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
  if (/\d/.test(password)) strength++;
  if (/[^a-zA-Z\d]/.test(password)) strength++;

  const levels = [
    { width: '0%', color: 'var(--gray-300)', text: 'Password strength' },
    { width: '20%', color: '#dc2626', text: 'Very weak' },
    { width: '40%', color: '#ea580c', text: 'Weak' },
    { width: '60%', color: '#ca8a04', text: 'Fair' },
    { width: '80%', color: '#16a34a', text: 'Strong' },
    { width: '100%', color: '#059669', text: 'Very strong' }
  ];

  const level = levels[strength] || levels[0];
  strengthFill.style.width = level.width;
  strengthFill.style.background = level.color;
  strengthText.textContent = level.text;
  strengthText.style.color = level.color;
}

// Toggle password visibility
function togglePassword(inputId, btn) {
  const input = document.getElementById(inputId);
  if (!input) return;

  if (input.type === 'password') {
    input.type = 'text';
    btn.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>';
  } else {
    input.type = 'password';
    btn.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>';
  }
}

// Dashboard tab switching
function showDashTab(link, tab) {
  event.preventDefault();

  document.querySelectorAll('.sidebar-link').forEach(l => l.classList.remove('active'));
  link.classList.add('active');

  document.querySelectorAll('.dash-tab').forEach(t => t.classList.remove('active'));
  const tabEl = document.getElementById('dash' + tab.charAt(0).toUpperCase() + tab.slice(1));
  if (tabEl) tabEl.classList.add('active');
}

// Portal notification (separate from main site notifications)
function showPortalNotification(message, type = 'info') {
  const existing = document.querySelector('.portal-notification');
  if (existing) existing.remove();

  const notification = document.createElement('div');
  notification.className = `portal-notification portal-notification-${type}`;
  notification.innerHTML = `
    <div class="notification-content">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        ${type === 'success'
          ? '<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>'
          : type === 'error'
          ? '<circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>'
          : '<circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>'}
      </svg>
      <span>${message}</span>
    </div>
    <button class="notification-close" onclick="this.parentElement.remove()">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
      </svg>
    </button>
  `;

  // Add styles if not present
  if (!document.getElementById('portalNotificationStyles')) {
    const style = document.createElement('style');
    style.id = 'portalNotificationStyles';
    style.textContent = `
      .portal-notification {
        position: fixed;
        top: 90px;
        right: 24px;
        z-index: 9999;
        background: white;
        border-radius: 12px;
        padding: 16px 20px;
        box-shadow: 0 20px 40px rgba(0,0,0,0.15);
        display: flex;
        align-items: center;
        gap: 12px;
        max-width: 440px;
        animation: slideInRight 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        border-left: 4px solid;
      }
      .portal-notification-success { border-color: #16a34a; }
      .portal-notification-error { border-color: #dc2626; }
      .portal-notification-info { border-color: #3b82f6; }
      .portal-notification .notification-content {
        display: flex;
        align-items: flex-start;
        gap: 12px;
        flex: 1;
      }
      .portal-notification-success .notification-content svg { color: #16a34a; }
      .portal-notification-error .notification-content svg { color: #dc2626; }
      .portal-notification-info .notification-content svg { color: #3b82f6; }
      .portal-notification span { font-size: 0.85rem; color: #374151; line-height: 1.5; }
      .portal-notification .notification-close {
        background: none;
        border: none;
        cursor: pointer;
        color: #9ca3af;
        padding: 4px;
        transition: color 0.2s;
        flex-shrink: 0;
      }
      .portal-notification .notification-close:hover { color: #374151; }
    `;
    document.head.appendChild(style);
  }

  document.body.appendChild(notification);

  setTimeout(() => {
    if (notification.parentElement) {
      notification.style.animation = 'slideInRight 0.4s cubic-bezier(0.4, 0, 0.2, 1) reverse';
      setTimeout(() => notification.remove(), 400);
    }
  }, 6000);
}
