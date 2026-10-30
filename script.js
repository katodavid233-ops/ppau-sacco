// ===== NAVIGATION (homepage only) =====
const header = document.getElementById('header');
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');
const navLinkItems = document.querySelectorAll('.nav-link');

if (header) {
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
}

// Mobile menu toggle
if (hamburger) {
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('open');
    document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
  });
}

// Close mobile menu on link click
if (navLinkItems.length) {
  navLinkItems.forEach(link => {
    link.addEventListener('click', () => {
      if (hamburger) hamburger.classList.remove('active');
      if (navLinks) navLinks.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
}

// Active nav link on scroll
if (header) {
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
}

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

// ===== SERVICE TABS (homepage only) =====
const tabBtns = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');

if (tabBtns.length) {
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const tab = btn.getAttribute('data-tab');
      tabBtns.forEach(b => b.classList.remove('active'));
      tabContents.forEach(c => c.classList.remove('active'));
      btn.classList.add('active');
      document.getElementById(`tab-${tab}`).classList.add('active');
    });
  });
}

// ===== CONTACT FORM (homepage only) =====
const contactForm = document.getElementById('contactForm');

if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const formData = new FormData(contactForm);
    const data = Object.fromEntries(formData.entries());

    if (!data.name || !data.email || !data.subject || !data.message) {
      showNotification('Please fill in all required fields.', 'error');
      return;
    }

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
}

// ===== NEWSLETTER FORM (homepage only) =====
const newsletterForm = document.getElementById('newsletterForm');

if (newsletterForm) {
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
}

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

if (backToTop) {
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
}

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

// API Configuration - Update this to your Cloudflare Worker URL after deployment
const API_BASE = window.location.hostname === 'localhost'
  ? 'https://ppau-sacco-api.katodavid233.workers.dev'
  : 'https://ppau-sacco-api.katodavid233.workers.dev';

async function apiCall(endpoint, method = 'GET', body = null) {
  const options = {
    method,
    headers: { 'Content-Type': 'application/json' },
  };
  if (body) options.body = JSON.stringify(body);

  try {
    const response = await fetch(`${API_BASE}${endpoint}`, options);
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || data.message || 'API request failed');
    }
    return data;
  } catch (err) {
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      return demoApiCall(endpoint, method, body);
    }
    throw err;
  }
}

// Demo mode for local testing without backend
function demoApiCall(endpoint, method, body) {
  // Register
  if (endpoint === '/api/register') {
    const memberId = 'PPAU-' + new Date().getFullYear() + '-' + String(Math.floor(Math.random() * 9999)).padStart(4, '0');
    const token = 'demo_token_' + Date.now();
    localStorage.setItem('ppau_demo_members', JSON.stringify({ ...body, memberId, token, status: 'pending', totalSavings: 0, totalShares: 0 }));
    return Promise.resolve({ memberId, token, message: 'Registration successful' });
  }

  // Login
  if (endpoint === '/api/login') {
    const stored = JSON.parse(localStorage.getItem('ppau_demo_members') || 'null');
    if (!stored) throw new Error('No registered member found. Please register first.');
    if (stored.email !== body.identifier && stored.phone !== body.identifier) throw new Error('Member not found. Try your email or phone.');
    if (stored.password !== body.password) throw new Error('Incorrect password.');
    return Promise.resolve({ token: stored.token, member: { firstName: stored.firstName, lastName: stored.lastName, memberId: stored.memberId, status: stored.status } });
  }

  // Payment confirm
  if (endpoint === '/api/payment/confirm') {
    const stored = JSON.parse(localStorage.getItem('ppau_demo_members') || 'null');
    if (stored) {
      stored.totalSavings = 150000;
      stored.paymentStatus = 'submitted';
      localStorage.setItem('ppau_demo_members', JSON.stringify(stored));
    }
    return Promise.resolve({ message: 'Payment submitted', status: 'submitted' });
  }

  // Fetch member data
  if (endpoint === '/api/member') {
    const stored = JSON.parse(localStorage.getItem('ppau_demo_members') || 'null');
    if (!stored) throw new Error('Member not found');
    return Promise.resolve({ member: { firstName: stored.firstName, lastName: stored.lastName, memberId: stored.memberId, email: stored.email, phone: stored.phone, status: 'active', totalSavings: stored.totalSavings || 0, totalShares: stored.totalShares || 0, gender: stored.gender, employer: stored.employer, location: stored.location } });
  }

  // Admin login
  if (endpoint === '/api/admin/login') {
    if (body.email === 'admin@ppausacco.org' && body.password === 'Admin@2026!') {
      return Promise.resolve({ token: 'demo_admin_token', admin: { email: body.email } });
    }
    throw new Error('Invalid admin credentials');
  }

  if (endpoint.startsWith('/api/admin/registrations')) {
    const stored = JSON.parse(localStorage.getItem('ppau_demo_members') || 'null');
    if (!stored) return Promise.resolve({ registrations: [] });
    return Promise.resolve({ registrations: [stored] });
  }

  if (endpoint.startsWith('/api/admin/payments')) {
    return Promise.resolve({ payments: [] });
  }

  // Elections
  if (endpoint === '/api/elections') {
    return Promise.resolve({ elections: [] });
  }

  if (endpoint.startsWith('/api/elections/')) {
    const electionParts = endpoint.split('/').filter(Boolean);
    const electionId = electionParts[2];
    if (electionParts[3] === 'vote') {
      const stored = JSON.parse(localStorage.getItem('ppau_demo_members') || 'null');
      const votes = JSON.parse(localStorage.getItem('ppau_demo_election_votes') || '{}');
      if (votes[electionId]) throw new Error('You have already voted in this election.');
      if (!stored) throw new Error('Please sign in to vote in elections.');
      votes[electionId] = body?.candidateId || 'c1';
      localStorage.setItem('ppau_demo_election_votes', JSON.stringify(votes));
      return Promise.resolve({ success: true, message: 'Vote submitted', tally: [{ candidateId: votes[electionId], name: 'Demo Candidate', votes: 1, percentage: 100 }] });
    }
    return Promise.resolve({ success: true, election: null, voterStatus: null, tally: [] });
  }

  if (endpoint === '/api/admin/elections') {
    return Promise.resolve({ elections: [] });
  }

  if (endpoint.startsWith('/api/admin/elections/')) {
    return Promise.resolve({ success: true, election: null, elections: [] });
  }

  // Flutterwave init
  if (endpoint === '/api/payment/flutterwave/initialize') {
    throw new Error('Card payments require the live backend. Please use bank transfer, Airtel Money, or MTN MoMo.');
  }

  return Promise.resolve({ message: 'Demo mode' });
}

// Registration form steps
let currentStep = 1;
const totalSteps = 3;

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

  // Admin form
  const adminLoginForm = document.getElementById('adminLoginForm');
  if (adminLoginForm) {
    adminLoginForm.addEventListener('submit', handleAdminLogin);
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

  // Prevent Enter key from submitting form before final step
  if (registerForm) {
    registerForm.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' && currentStep < totalSteps) {
        e.preventDefault();
        nextFormStep();
      }
    });
  }

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
  } else if (hash === 'admin') {
    showAdminPanel();
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
  const adminSection = document.getElementById('adminSection');
  const dashSection = document.getElementById('dashboardSection');

  if (!loginPanel) return;

  loginPanel.classList.remove('active');
  registerPanel.classList.remove('active');
  paymentPanel.classList.remove('active');
  if (authSection) authSection.style.display = '';
  if (adminSection) adminSection.style.display = 'none';
  if (dashSection) dashSection.style.display = 'none';

  // Update nav links
  document.querySelectorAll('.portal-nav-link').forEach(l => l.classList.remove('active'));

  if (panel === 'login') {
    loginPanel.classList.add('active');
    document.getElementById('navToLogin')?.classList.add('active');
  } else if (panel === 'register') {
    registerPanel.classList.add('active');
    document.getElementById('navToRegister')?.classList.add('active');
    // Reset form steps to step 1
    currentStep = 1;
    updateFormSteps();
  } else if (panel === 'payment') {
    paymentPanel.classList.add('active');
    document.getElementById('navToPayments')?.classList.add('active');
  }
}

// Login handler
async function handleLogin(e) {
  e.preventDefault();
  const identifier = document.getElementById('loginEmail').value.trim();
  const password = document.getElementById('loginPassword').value;

  if (!identifier || !password) {
    showPortalNotification('Please fill in all fields.', 'error');
    return;
  }

  const btn = e.target.querySelector('button[type="submit"]');
  const originalText = btn.innerHTML;
  btn.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="spin"><circle cx="12" cy="12" r="10"/></svg> Signing in...';
  btn.disabled = true;

  try {
    const data = await apiCall('/api/login', 'POST', { identifier, password });

    // Store login state
    localStorage.setItem('ppau_logged_in', 'true');
    localStorage.setItem('ppau_token', data.token);
    localStorage.setItem('ppau_user_name', data.member.firstName);
    localStorage.setItem('ppau_user_fullname', `${data.member.firstName} ${data.member.lastName}`);
    localStorage.setItem('ppau_member_id', data.member.memberId);

    // Track login event
    if (typeof gtag === 'function') {
      gtag('event', 'login', { method: 'portal' });
    }

    showDashboard();
    showPortalNotification(`Welcome back, ${data.member.firstName}!`, 'success');
  } catch (err) {
    showPortalNotification(err.message || 'Login failed. Please try again.', 'error');
  } finally {
    btn.innerHTML = originalText;
    btn.disabled = false;
  }
}

function showAdminPanel() {
  const authSection = document.getElementById('authSection');
  const dashSection = document.getElementById('dashboardSection');
  const adminSection = document.getElementById('adminSection');
  const loginPanel = document.getElementById('adminLoginPanel');
  const dashboardPanel = document.getElementById('adminDashboardPanel');

  if (!adminSection) return;

  if (authSection) authSection.style.display = 'none';
  if (dashSection) dashSection.style.display = 'none';
  adminSection.style.display = 'block';

  document.querySelectorAll('.portal-nav-link').forEach(l => l.classList.remove('active'));
  document.getElementById('navToAdmin')?.classList.add('active');

  if (localStorage.getItem('ppau_admin_logged_in') === 'true') {
    loginPanel?.classList.remove('active');
    dashboardPanel?.classList.add('active');
    loadAdminDashboard();
  } else {
    loginPanel?.classList.add('active');
    dashboardPanel?.classList.remove('active');
  }
}

async function handleAdminLogin(e) {
  e.preventDefault();
  const email = document.getElementById('adminEmail').value.trim();
  const password = document.getElementById('adminPassword').value;

  if (!email || !password) {
    showPortalNotification('Please enter your admin credentials.', 'error');
    return;
  }

  const btn = e.target.querySelector('button[type="submit"]');
  const originalText = btn.innerHTML;
  btn.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="spin"><circle cx="12" cy="12" r="10"/></svg> Signing in...';
  btn.disabled = true;

  try {
    const data = await apiCall('/api/admin/login', 'POST', { email, password });
    localStorage.setItem('ppau_admin_logged_in', 'true');
    localStorage.setItem('ppau_admin_token', data.token);
    showAdminPanel();
    showPortalNotification('Admin portal access granted.', 'success');
  } catch (err) {
    showPortalNotification(err.message || 'Admin login failed.', 'error');
  } finally {
    btn.innerHTML = originalText;
    btn.disabled = false;
  }
}

async function loadAdminDashboard() {
  const token = localStorage.getItem('ppau_admin_token');
  if (!token) return;

  try {
    const [registrations, payments] = await Promise.all([
      apiCall(`/api/admin/registrations?token=${token}`),
      apiCall(`/api/admin/payments?token=${token}`),
    ]);

    renderAdminRegistrations(registrations.registrations || []);
    renderAdminPayments(payments.payments || []);
  } catch (err) {
    showPortalNotification(err.message || 'Could not load admin review queue.', 'error');
  }
}

function renderAdminRegistrations(registrations) {
  const list = document.getElementById('adminRegistrationsList');
  if (!list) return;

  if (!registrations.length) {
    list.innerHTML = '<div class="admin-empty">No registrations pending review.</div>';
    return;
  }

  list.innerHTML = registrations.map(reg => {
    const statusLabel = reg.approvalStatus === 'approved' ? 'Approved' : reg.status === 'active' ? 'Active' : 'Pending';
    const action = reg.approvalStatus === 'approved'
      ? '<span class="admin-pill">Approved</span>'
      : `<button class="btn btn-primary btn-sm" onclick="approveRegistration('${reg.memberId}')">Approve</button>`;

    return `
      <div class="admin-item">
        <h5>${reg.firstName} ${reg.lastName}</h5>
        <p>${reg.email} • ${reg.practiceType || 'Member'} • ${reg.phone || ''}</p>
        <div class="admin-item-actions">
          <span class="admin-pill">${statusLabel}</span>
          ${action}
        </div>
      </div>
    `;
  }).join('');
}

function renderAdminPayments(payments) {
  const list = document.getElementById('adminPaymentsList');
  if (!list) return;

  if (!payments.length) {
    list.innerHTML = '<div class="admin-empty">No payments pending verification.</div>';
    return;
  }

  list.innerHTML = payments.map(payment => {
    const statusLabel = payment.status === 'verified' ? 'Verified' : payment.status === 'completed' ? 'Completed' : 'Pending';
    const action = payment.status === 'verified'
      ? '<span class="admin-pill">Verified</span>'
      : `<button class="btn btn-primary btn-sm" onclick="verifyPayment('${payment.paymentId}')">Verify</button>`;

    return `
      <div class="admin-item">
        <h5>${payment.memberId}</h5>
        <p>${payment.paymentMethod || 'Payment'} • UGX ${Number(payment.amount || 0).toLocaleString()} • ${payment.reference || 'No reference'}</p>
        <div class="admin-item-actions">
          <span class="admin-pill">${statusLabel}</span>
          ${action}
        </div>
      </div>
    `;
  }).join('');
}

async function approveRegistration(memberId) {
  const token = localStorage.getItem('ppau_admin_token');
  if (!token) return;

  try {
    await apiCall(`/api/admin/registrations/${memberId}/approve?token=${token}`, 'POST');
    showPortalNotification('Registration approved.', 'success');
    loadAdminDashboard();
  } catch (err) {
    showPortalNotification(err.message || 'Could not approve registration.', 'error');
  }
}

async function verifyPayment(paymentId) {
  const token = localStorage.getItem('ppau_admin_token');
  if (!token) return;

  try {
    await apiCall(`/api/admin/payments/${paymentId}/verify?token=${token}`, 'POST');
    showPortalNotification('Payment verified and member activated.', 'success');
    loadAdminDashboard();
  } catch (err) {
    showPortalNotification(err.message || 'Could not verify payment.', 'error');
  }
}

function logoutAdmin() {
  localStorage.removeItem('ppau_admin_logged_in');
  localStorage.removeItem('ppau_admin_token');
  showPanel('login');
  showPortalNotification('Admin session closed.', 'info');
}

// Show dashboard
function showDashboard() {
  const authSection = document.getElementById('authSection');
  const dashSection = document.getElementById('dashboardSection');
  const adminSection = document.getElementById('adminSection');

  if (!authSection || !dashSection) return;

  authSection.style.display = 'none';
  dashSection.style.display = 'block';
  if (adminSection) adminSection.style.display = 'none';

  // Update nav
  document.querySelectorAll('.portal-nav-link').forEach(l => l.classList.remove('active'));
  document.getElementById('navToRegister').style.display = 'none';
  document.getElementById('navToLogin').textContent = 'Dashboard';
  document.getElementById('navToLogin').classList.add('active');
  document.getElementById('navToLogin').href = '#dashboard';
  document.getElementById('navToPayments').style.display = 'inline-flex';

  // Set user data from localStorage
  const name = localStorage.getItem('ppau_user_name') || 'Member';
  const fullname = localStorage.getItem('ppau_user_fullname') || 'Member';
  const memberId = localStorage.getItem('ppau_member_id') || 'PPAU-2026-XXXX';

  const welcomeName = document.getElementById('dashWelcomeName');
  const dashName = document.getElementById('dashName');
  const dashMemberId = document.getElementById('dashMemberId');

  if (welcomeName) welcomeName.textContent = name;
  if (dashName) dashName.textContent = fullname;
  if (dashMemberId) dashMemberId.textContent = memberId;

  // Fetch latest data from API
  fetchMemberData();
  loadMemberElections();
}

// Fetch member data from API
async function fetchMemberData() {
  const token = localStorage.getItem('ppau_token');
  if (!token) return;

  try {
    const data = await apiCall(`/api/member?token=${token}`);

    if (data.member) {
      const m = data.member;
      const welcomeName = document.getElementById('dashWelcomeName');
      const dashName = document.getElementById('dashName');

      if (welcomeName) welcomeName.textContent = m.firstName;
      if (dashName) dashName.textContent = `${m.firstName} ${m.lastName}`;

      // Update savings display
      const savingsEl = document.getElementById('dashSavings');
      if (savingsEl) {
        const total = m.totalSavings || 0;
        savingsEl.textContent = `UGX ${total.toLocaleString()}`;
      }

      // Update shares display
      const sharesEl = document.querySelector('.dash-card.blue-card .dash-card-value');
      if (sharesEl && m.totalShares !== undefined) {
        sharesEl.textContent = `${m.totalShares} Shares`;
      }

      // Update status badge
      const statusEl = document.querySelector('.member-status');
      if (statusEl) {
        statusEl.textContent = m.status === 'active' ? 'Active Member' : 'Pending Verification';
        statusEl.className = `member-status ${m.status === 'active' ? 'active-status' : ''}`;
      }
    }
  } catch (err) {
    // Silently fail - dashboard still shows cached data
    console.log('Could not fetch latest member data:', err.message);
  }
}

// Logout
function logout() {
  localStorage.removeItem('ppau_logged_in');
  localStorage.removeItem('ppau_token');
  localStorage.removeItem('ppau_user_name');
  localStorage.removeItem('ppau_user_fullname');
  localStorage.removeItem('ppau_member_id');
  localStorage.removeItem('ppau_user_email');
  localStorage.removeItem('ppau_admin_logged_in');
  localStorage.removeItem('ppau_admin_token');

  const authSection = document.getElementById('authSection');
  const dashSection = document.getElementById('dashboardSection');
  const adminSection = document.getElementById('adminSection');

  if (dashSection) dashSection.style.display = 'none';
  if (adminSection) adminSection.style.display = 'none';
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

function nextFormStep() {
  if (currentStep >= totalSteps) return;

  const currentStepEl = document.querySelector(`.form-step[data-step="${currentStep}"]`);
  if (!currentStepEl) {
    console.error('Could not find form step', currentStep);
    return;
  }

  const requiredInputs = currentStepEl.querySelectorAll('[required]');
  let valid = true;
  let firstEmpty = null;
  const emptyFields = [];

  requiredInputs.forEach(input => {
    const val = input.tagName === 'SELECT' ? input.value : input.value.trim();
    if (!val) {
      valid = false;
      emptyFields.push(input.id || input.name || 'unknown');
      input.style.borderColor = '#dc2626';
      input.style.animation = 'shake 0.4s ease';
      setTimeout(() => { input.style.borderColor = ''; input.style.animation = ''; }, 2500);
      if (!firstEmpty) firstEmpty = input;
    }
  });

  if (!valid) {
    console.log('Validation failed. Empty fields:', emptyFields);
    showPortalNotification('Please fill in all required fields (marked with *).', 'error');
    if (firstEmpty) firstEmpty.scrollIntoView({ behavior: 'smooth', block: 'center' });
    return;
  }

  if (currentStep === 2) {
    const pw = document.getElementById('regPassword');
    const cpw = document.getElementById('regConfirmPassword');
    if (pw && cpw && pw.value !== cpw.value) {
      showPortalNotification('Passwords do not match.', 'error');
      cpw.style.borderColor = '#dc2626';
      cpw.style.animation = 'shake 0.4s ease';
      return;
    }
  }

  currentStep++;
  console.log('Advancing to step', currentStep);
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
  const nextStepEl = document.querySelector(`.form-step[data-step="${currentStep}"]`);
  if (nextStepEl) {
    nextStepEl.classList.add('active');
  } else {
    console.error('Could not find step element for step', currentStep);
  }

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
async function handleRegister(e) {
  e.preventDefault();

  const btn = document.getElementById('submitRegistration');
  const originalText = btn.innerHTML;
  btn.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="spin"><circle cx="12" cy="12" r="10"/></svg> Creating Account...';
  btn.disabled = true;

  try {
    // Collect all form data
    const formData = {
      firstName: document.getElementById('regFirstName').value,
      lastName: document.getElementById('regLastName').value,
      email: document.getElementById('regEmail').value,
      phone: document.getElementById('regPhone').value,
      gender: document.getElementById('regGender').value,
      dateOfBirth: document.getElementById('regDob').value,
      nin: document.getElementById('regNin').value,
      licenseNumber: document.getElementById('regPharmacyLicense').value,
      practiceType: document.getElementById('regPracticeType').value,
      employer: document.getElementById('regEmployer').value,
      location: document.getElementById('regLocation').value,
      salaryRange: document.getElementById('regSalary').value,
      memberType: document.getElementById('regMemberType').value,
      password: document.getElementById('regPassword').value,
      nextOfKin: document.getElementById('regNextOfKin').value,
      nextOfKinPhone: document.getElementById('regNextOfKinPhone').value,
      monthlyContribution: document.getElementById('regMonthlyContribution').value,
    };

    const data = await apiCall('/api/register', 'POST', formData);

    // Store user data
    localStorage.setItem('ppau_logged_in', 'true');
    localStorage.setItem('ppau_token', data.token);
    localStorage.setItem('ppau_user_name', formData.firstName);
    localStorage.setItem('ppau_user_fullname', `${formData.firstName} ${formData.lastName}`);
    localStorage.setItem('ppau_member_id', data.memberId);
    localStorage.setItem('ppau_user_email', formData.email);

    // Track registration event
    if (typeof gtag === 'function') {
      gtag('event', 'sign_up', { method: 'portal' });
    }

    // Show payment panel
    showPanel('payment');
    showPortalNotification(`Registration successful! Your Member ID is ${data.memberId}. Please complete payment to activate your account.`, 'success');
  } catch (err) {
    showPortalNotification(err.message || 'Registration failed. Please try again.', 'error');
  } finally {
    btn.innerHTML = originalText;
    btn.disabled = false;
  }
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
async function confirmPayment() {
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

  try {
    const memberId = localStorage.getItem('ppau_member_id');

    const data = await apiCall('/api/payment/confirm', 'POST', {
      memberId,
      paymentMethod: method,
      amount: 150000,
      reference: `${methodNames[method]} - Registration Payment`,
    });

    // Track payment event
    if (typeof gtag === 'function') {
      gtag('event', 'payment', {
        method: methodNames[method],
        amount: 150000,
        currency: 'UGX',
      });
    }

    btn.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg> Payment Confirmed!';
    btn.style.background = '#16a34a';

    showPortalNotification(`Payment via ${methodNames[method]} submitted! Our team will verify within 24-48 hours.`, 'success');

    setTimeout(() => {
      showDashboard();
    }, 3000);
  } catch (err) {
    showPortalNotification(err.message || 'Payment submission failed.', 'error');
  } finally {
    if (btn.style.background !== '#16a34a') {
      btn.innerHTML = originalText;
      btn.disabled = false;
    }
  }
}

// Card payment processing via Flutterwave
async function processCardPayment() {
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
  btn.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="spin"><circle cx="12" cy="12" r="10"/></svg> Initializing Payment...';
  btn.disabled = true;

  try {
    const memberId = localStorage.getItem('ppau_member_id');
    const email = localStorage.getItem('ppau_user_email') || '';

    const data = await apiCall('/api/payment/flutterwave/initialize', 'POST', {
      memberId,
      email,
      amount: 150000,
      currency: 'UGX',
      firstName: localStorage.getItem('ppau_user_name') || '',
      lastName: localStorage.getItem('ppau_user_fullname')?.split(' ').slice(1).join(' ') || '',
    });

    if (data.checkout_url) {
      // Track payment attempt
      if (typeof gtag === 'function') {
        gtag('event', 'begin_checkout', {
          currency: 'UGX',
          value: 150000,
        });
      }
      // Redirect to Flutterwave checkout
      window.location.href = data.checkout_url;
    } else {
      showPortalNotification('Failed to initialize card payment. Please try mobile money or bank transfer.', 'error');
      btn.innerHTML = originalText;
      btn.disabled = false;
    }
  } catch (err) {
    showPortalNotification(err.message || 'Card payment is not available yet. Please use bank transfer, Airtel Money, or MoMo Pay.', 'error');
    btn.innerHTML = originalText;
    btn.disabled = false;
  }
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


// ==================================================================
// VOICES OF FINANCIAL LITERACY — TESTIMONIAL SLIDER
// ==================================================================
(function () {
  const SLIDE_DURATION = 6000; // ms each slide stays visible
  const TRANSITION_MS  = 450;  // must match CSS transition duration

  const track    = document.getElementById('vsTrack');
  const prevBtn  = document.getElementById('vsPrev');
  const nextBtn  = document.getElementById('vsNext');
  const dotsWrap = document.getElementById('vsDots');
  const numEl    = document.getElementById('vsCurrentNum');
  const bar      = document.getElementById('vsProgressBar');

  if (!track) return; // not on this page

  const slides = Array.from(track.querySelectorAll('.vs-slide'));
  const dots   = dotsWrap ? Array.from(dotsWrap.querySelectorAll('.vs-dot')) : [];
  const total  = slides.length;

  let current   = 0;
  let timer     = null;
  let progTimer = null;
  let progStart = null;
  let isAnimating = false;

  /* ── initial state ── */
  slides[0].classList.add('vs-active');

  /* ── progress bar ── */
  function startProgress() {
    if (bar) {
      bar.style.transition = 'none';
      bar.style.width = '0%';
      // force reflow so the reset takes effect before we animate
      void bar.offsetWidth;
      bar.style.transition = `width ${SLIDE_DURATION}ms linear`;
      bar.style.width = '100%';
    }
  }

  function resetProgress() {
    if (bar) {
      bar.style.transition = 'none';
      bar.style.width = '0%';
    }
  }

  /* ── go to slide ── */
  function goTo(index, direction /* 'next' | 'prev' */) {
    if (isAnimating || index === current) return;
    isAnimating = true;

    const outSlide = slides[current];
    const inSlide  = slides[index];

    /* prepare incoming slide off-screen */
    inSlide.style.transition = 'none';
    inSlide.classList.remove('vs-active', 'vs-from-left');
    if (direction === 'prev') {
      inSlide.classList.add('vs-from-left');
    }
    // show it (but invisible via opacity:0 + translateX)
    inSlide.style.display = 'flex';
    void inSlide.offsetWidth; // reflow

    /* animate outgoing slide out */
    outSlide.style.transition = `opacity ${TRANSITION_MS}ms cubic-bezier(0.4,0,0.2,1),
                                  transform ${TRANSITION_MS}ms cubic-bezier(0.4,0,0.2,1)`;
    outSlide.style.opacity   = '0';
    outSlide.style.transform = direction === 'prev' ? 'translateX(60px)' : 'translateX(-60px)';

    /* animate incoming slide in */
    inSlide.style.transition = `opacity ${TRANSITION_MS}ms cubic-bezier(0.4,0,0.2,1),
                                 transform ${TRANSITION_MS}ms cubic-bezier(0.4,0,0.2,1)`;
    inSlide.classList.add('vs-active');

    setTimeout(() => {
      /* clean up outgoing */
      outSlide.classList.remove('vs-active', 'vs-from-left');
      outSlide.style.display   = '';
      outSlide.style.opacity   = '';
      outSlide.style.transform = '';
      outSlide.style.transition = '';

      /* clean up incoming */
      inSlide.classList.remove('vs-from-left');
      inSlide.style.transition = '';

      current = index;
      updateDots();
      updateCounter();
      isAnimating = false;

      resetProgress();
      startProgress();
      scheduleNext();
    }, TRANSITION_MS + 20);
  }

  /* ── auto-advance ── */
  function scheduleNext() {
    clearTimeout(timer);
    timer = setTimeout(() => goTo(nextIndex(), 'next'), SLIDE_DURATION);
  }

  function nextIndex() { return (current + 1) % total; }
  function prevIndex() { return (current - 1 + total) % total; }

  /* ── dots + counter ── */
  function updateDots() {
    dots.forEach((d, i) => {
      d.classList.toggle('active', i === current);
      d.setAttribute('aria-selected', i === current ? 'true' : 'false');
    });
  }

  function updateCounter() {
    if (numEl) numEl.textContent = current + 1;
  }

  /* ── event listeners ── */
  if (nextBtn) nextBtn.addEventListener('click', () => {
    clearTimeout(timer);
    goTo(nextIndex(), 'next');
  });

  if (prevBtn) prevBtn.addEventListener('click', () => {
    clearTimeout(timer);
    goTo(prevIndex(), 'prev');
  });

  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => {
      if (i === current) return;
      clearTimeout(timer);
      goTo(i, i > current ? 'next' : 'prev');
    });
  });

  /* Pause on hover */
  const slider = document.getElementById('voicesSlider');
  if (slider) {
    slider.addEventListener('mouseenter', () => {
      clearTimeout(timer);
      resetProgress();
    });
    slider.addEventListener('mouseleave', () => {
      startProgress();
      scheduleNext();
    });
  }

  /* Touch / swipe support */
  let touchStartX = 0;
  track.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchend', e => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) {
      clearTimeout(timer);
      goTo(diff > 0 ? nextIndex() : prevIndex(), diff > 0 ? 'next' : 'prev');
    }
  }, { passive: true });

  /* Keyboard support when focused */
  if (slider) {
    slider.setAttribute('tabindex', '0');
    slider.addEventListener('keydown', e => {
      if (e.key === 'ArrowRight') { clearTimeout(timer); goTo(nextIndex(), 'next'); }
      if (e.key === 'ArrowLeft')  { clearTimeout(timer); goTo(prevIndex(), 'prev'); }
    });
  }

  /* ── kick off ── */
  updateCounter();
  startProgress();
  scheduleNext();
})();

// ==================================================================
// ADMIN PORTAL (standalone admin.html)
// ==================================================================

let allMembers = [];
let allRegistrations = [];
let allPayments = [];
let currentAdminTab = 'registrations';

function initAdminPortal() {
  const loginSection = document.getElementById('adminLoginSection');
  if (!loginSection) return;

  if (localStorage.getItem('ppau_admin_logged_in') === 'true') {
    showAdminDashboard();
  }
}

async function handleAdminPortalLogin(e) {
  e.preventDefault();
  const email = document.getElementById('adminLoginEmail').value.trim();
  const password = document.getElementById('adminLoginPassword').value;

  if (!email || !password) {
    showAdminToast('Please enter your credentials.', 'error');
    return;
  }

  const btn = e.target.querySelector('button[type="submit"]');
  const originalText = btn.innerHTML;
  btn.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="spin"><circle cx="12" cy="12" r="10"/></svg> Signing in...';
  btn.disabled = true;

  try {
    const data = await apiCall('/api/admin/login', 'POST', { email, password });
    localStorage.setItem('ppau_admin_logged_in', 'true');
    localStorage.setItem('ppau_admin_token', data.token);
    localStorage.setItem('ppau_admin_email', email);
    showAdminDashboard();
    showAdminToast('Admin access granted.', 'success');
  } catch (err) {
    showAdminToast(err.message || 'Login failed.', 'error');
  } finally {
    btn.innerHTML = originalText;
    btn.disabled = false;
  }
}

function showAdminDashboard() {
  const loginSection = document.getElementById('adminLoginSection');
  const dashSection = document.getElementById('adminDashboardSection');

  if (loginSection) loginSection.style.display = 'none';
  if (dashSection) dashSection.style.display = 'block';

  const email = localStorage.getItem('ppau_admin_email') || 'admin@ppausacco.org';
  const badge = document.getElementById('adminEmailBadge');
  if (badge) badge.textContent = email;

  loadAdminData();
}

function adminLogout() {
  localStorage.removeItem('ppau_admin_logged_in');
  localStorage.removeItem('ppau_admin_token');
  localStorage.removeItem('ppau_admin_email');

  const loginSection = document.getElementById('adminLoginSection');
  const dashSection = document.getElementById('adminDashboardSection');

  if (dashSection) dashSection.style.display = 'none';
  if (loginSection) loginSection.style.display = '';
}

async function loadAdminData() {
  const token = localStorage.getItem('ppau_admin_token');
  if (!token) return;

  try {
    const [statsRes, membersRes, regRes, payRes] = await Promise.all([
      apiCall(`/api/admin/stats?token=${token}`),
      apiCall(`/api/admin/members?token=${token}`),
      apiCall(`/api/admin/registrations?token=${token}`),
      apiCall(`/api/admin/payments?token=${token}`),
    ]);

    const stats = statsRes.stats || {};
    allMembers = membersRes.members || [];
    allRegistrations = regRes.registrations || [];
    allPayments = payRes.payments || [];

    // Update stats
    document.getElementById('statTotalMembers').textContent = stats.totalMembers || allMembers.length;
    document.getElementById('statPendingApproval').textContent = stats.pendingApproval || 0;
    document.getElementById('statPendingPayment').textContent = stats.pendingPayments || stats.pendingPayment || 0;
    document.getElementById('statActiveMembers').textContent = stats.activeMembers || 0;

    // Update tab counts
    document.getElementById('tabRegCount').textContent = allRegistrations.length;
    document.getElementById('tabPayCount').textContent = allPayments.length;
    document.getElementById('tabMemCount').textContent = allMembers.length;

    renderRegistrationsTable(allRegistrations);
    renderPaymentsTable(allPayments);
    renderAllMembersTable(allMembers);
    loadAdminNotifications();

    if (currentAdminTab === 'elections') {
      loadAdminElections();
    }
  } catch (err) {
    showAdminToast(err.message || 'Could not load admin data.', 'error');
  }
}

function switchAdminTab(tab) {
  currentAdminTab = tab;
  document.querySelectorAll('.admin-tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.admin-tab-content').forEach(c => c.classList.remove('active'));
  document.querySelector(`.admin-tab[data-tab="${tab}"]`)?.classList.add('active');

  if (tab === 'registrations') document.getElementById('adminTabRegistrations')?.classList.add('active');
  if (tab === 'payments') document.getElementById('adminTabPayments')?.classList.add('active');
  if (tab === 'allmembers') document.getElementById('adminTabAllMembers')?.classList.add('active');
  if (tab === 'notifications') document.getElementById('adminTabNotifications')?.classList.add('active');
  if (tab === 'elections') document.getElementById('adminTabElections')?.classList.add('active');
}

function handleAdminSearch() {
  const query = document.getElementById('adminSearchInput').value.toLowerCase().trim();
  const filtered = allMembers.filter(m =>
    (m.firstName || '').toLowerCase().includes(query) ||
    (m.lastName || '').toLowerCase().includes(query) ||
    (m.email || '').toLowerCase().includes(query) ||
    (m.memberId || '').toLowerCase().includes(query) ||
    (m.phone || '').includes(query)
  );

  if (currentAdminTab === 'registrations') {
    renderRegistrationsTable(allRegistrations.filter(r =>
      (r.firstName || '').toLowerCase().includes(query) ||
      (r.lastName || '').toLowerCase().includes(query) ||
      (r.email || '').toLowerCase().includes(query) ||
      (r.memberId || '').toLowerCase().includes(query)
    ));
  } else if (currentAdminTab === 'payments') {
    renderPaymentsTable(allPayments.filter(p =>
      (p.memberId || '').toLowerCase().includes(query) ||
      (p.paymentId || '').toLowerCase().includes(query) ||
      (p.reference || '').toLowerCase().includes(query)
    ));
  } else {
    renderAllMembersTable(filtered);
  }
}

function handleAdminFilter() {
  const status = document.getElementById('adminStatusFilter').value;
  let filtered;

  if (status === 'all') {
    filtered = allMembers;
  } else if (status === 'rejected') {
    filtered = allMembers.filter(m => m.status === 'rejected' || m.approvalStatus === 'rejected');
  } else {
    filtered = allMembers.filter(m => m.status === status);
  }

  renderAllMembersTable(filtered);
}

function renderRegistrationsTable(registrations) {
  const tbody = document.getElementById('adminRegTableBody');
  if (!tbody) return;

  if (!registrations.length) {
    tbody.innerHTML = '<tr><td colspan="6" class="admin-empty-cell">No registrations found.</td></tr>';
    return;
  }

  tbody.innerHTML = registrations.map(reg => {
    const name = `${reg.firstName || ''} ${reg.lastName || ''}`.trim();
    const statusClass = reg.approvalStatus === 'approved' ? 'status-active' :
                        reg.approvalStatus === 'rejected' ? 'status-rejected' :
                        reg.status === 'active' ? 'status-active' : 'status-pending';
    const statusText = reg.approvalStatus === 'approved' ? 'Approved' :
                       reg.approvalStatus === 'rejected' ? 'Rejected' :
                       reg.status === 'active' ? 'Active' :
                       reg.status === 'pending_verification' ? 'Pending Verification' :
                       'Pending Payment';
    const date = reg.joinedAt ? new Date(reg.joinedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '—';

    const actions = reg.approvalStatus === 'approved'
      ? '<span class="admin-status-pill approved">Approved</span>'
      : reg.approvalStatus === 'rejected'
      ? '<span class="admin-status-pill rejected">Rejected</span>'
      : `<button class="btn btn-primary btn-xs" onclick="adminApproveMember('${reg.memberId}')">Approve</button>
         <button class="btn btn-danger btn-xs" onclick="adminRejectMember('${reg.memberId}')">Reject</button>`;

    return `<tr>
      <td><strong>${name}</strong><br/><small style="color:var(--gray-500)">${reg.memberId || ''}</small></td>
      <td>${reg.email || ''}</td>
      <td>${reg.practiceType || '—'}</td>
      <td><span class="admin-status-pill ${statusClass}">${statusText}</span></td>
      <td>${date}</td>
      <td class="admin-actions-cell">${actions}</td>
    </tr>`;
  }).join('');
}

function renderPaymentsTable(payments) {
  const tbody = document.getElementById('adminPayTableBody');
  if (!tbody) return;

  if (!payments.length) {
    tbody.innerHTML = '<tr><td colspan="7" class="admin-empty-cell">No payments found.</td></tr>';
    return;
  }

  tbody.innerHTML = payments.map(p => {
    const statusClass = p.status === 'verified' || p.status === 'completed' ? 'status-active' : 'status-pending';
    const statusText = p.status === 'verified' ? 'Verified' : p.status === 'completed' ? 'Completed' : 'Pending Verification';
    const method = (p.paymentMethod || '').replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
    const amount = Number(p.amount || 0).toLocaleString('en-UG', { style: 'currency', currency: 'UGX' });
    const date = p.createdAt ? new Date(p.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '—';

    const action = p.status === 'verified' || p.status === 'completed'
      ? '<span class="admin-status-pill approved">Verified</span>'
      : `<button class="btn btn-primary btn-xs" onclick="adminVerifyPayment('${p.paymentId}')">Verify</button>`;

    return `<tr>
      <td><small style="font-family:monospace">${p.paymentId || ''}</small></td>
      <td>${p.memberId || ''}</td>
      <td>${method}</td>
      <td><strong>${amount}</strong></td>
      <td>${p.reference || '—'}</td>
      <td><span class="admin-status-pill ${statusClass}">${statusText}</span></td>
      <td class="admin-actions-cell">${action}</td>
    </tr>`;
  }).join('');
}

function renderAllMembersTable(members) {
  const tbody = document.getElementById('adminAllMembersTableBody');
  if (!tbody) return;

  if (!members.length) {
    tbody.innerHTML = '<tr><td colspan="7" class="admin-empty-cell">No members found.</td></tr>';
    return;
  }

  tbody.innerHTML = members.map(m => {
    const name = `${m.firstName || ''} ${m.lastName || ''}`.trim();
    const statusClass = m.status === 'active' ? 'status-active' :
                        m.status === 'rejected' || m.approvalStatus === 'rejected' ? 'status-rejected' :
                        m.status === 'pending_verification' ? 'status-pending' :
                        'status-pending';
    const statusText = m.status === 'active' ? 'Active' :
                       m.status === 'rejected' || m.approvalStatus === 'rejected' ? 'Rejected' :
                       m.status === 'pending_verification' ? 'Pending Verification' :
                       m.status === 'pending_payment' ? 'Pending Payment' :
                       m.status;

    return `<tr>
      <td><small style="font-family:monospace">${m.memberId || ''}</small></td>
      <td><strong>${name}</strong></td>
      <td>${m.email || ''}</td>
      <td>${m.phone || ''}</td>
      <td>${m.practiceType || '—'}</td>
      <td><span class="admin-status-pill ${statusClass}">${statusText}</span></td>
      <td class="admin-actions-cell">
        <button class="btn btn-outline-dark btn-xs" onclick="openMemberDetail('${m.memberId}')">View</button>
      </td>
    </tr>`;
  }).join('');
}

async function adminApproveMember(memberId) {
  const token = localStorage.getItem('ppau_admin_token');
  if (!token) return;

  try {
    await apiCall(`/api/admin/registrations/${memberId}/approve?token=${token}`, 'POST');
    showAdminToast('Registration approved successfully.', 'success');
    loadAdminData();
  } catch (err) {
    showAdminToast(err.message || 'Could not approve registration.', 'error');
  }
}

async function adminRejectMember(memberId) {
  const token = localStorage.getItem('ppau_admin_token');
  if (!token) return;

  if (!confirm('Are you sure you want to reject this registration?')) return;

  try {
    await apiCall(`/api/admin/registrations/${memberId}/reject?token=${token}`, 'POST');
    showAdminToast('Registration rejected.', 'success');
    loadAdminData();
  } catch (err) {
    showAdminToast(err.message || 'Could not reject registration.', 'error');
  }
}

async function adminVerifyPayment(paymentId) {
  const token = localStorage.getItem('ppau_admin_token');
  if (!token) return;

  try {
    await apiCall(`/api/admin/payments/${paymentId}/verify?token=${token}`, 'POST');
    showAdminToast('Payment verified and member activated.', 'success');
    loadAdminData();
  } catch (err) {
    showAdminToast(err.message || 'Could not verify payment.', 'error');
  }
}

async function openMemberDetail(memberId) {
  const token = localStorage.getItem('ppau_admin_token');
  if (!token) return;

  const modal = document.getElementById('memberDetailModal');
  const body = document.getElementById('modalMemberBody');
  const footer = document.getElementById('modalMemberFooter');
  const title = document.getElementById('modalMemberName');

  modal.style.display = 'flex';
  body.innerHTML = '<p>Loading member details...</p>';
  footer.innerHTML = '';

  try {
    const data = await apiCall(`/api/admin/members/${memberId}?token=${token}`);
    const m = data.member;
    const payments = data.payments || [];

    title.textContent = `${m.firstName || ''} ${m.lastName || ''}`.trim() || m.memberId;

    const statusClass = m.status === 'active' ? 'status-active' :
                        m.status === 'rejected' ? 'status-rejected' : 'status-pending';

    body.innerHTML = `
      <div class="modal-member-grid">
        <div class="modal-detail-group">
          <h4>Personal Information</h4>
          <div class="modal-detail-row"><span>Member ID:</span><strong>${m.memberId || ''}</strong></div>
          <div class="modal-detail-row"><span>Full Name:</span><strong>${m.firstName || ''} ${m.lastName || ''}</strong></div>
          <div class="modal-detail-row"><span>Email:</span><span>${m.email || ''}</span></div>
          <div class="modal-detail-row"><span>Phone:</span><span>${m.phone || ''}</span></div>
          <div class="modal-detail-row"><span>Gender:</span><span>${m.gender || ''}</span></div>
          <div class="modal-detail-row"><span>Date of Birth:</span><span>${m.dateOfBirth || ''}</span></div>
          <div class="modal-detail-row"><span>NIN/AHP Reg No:</span><span>${m.nin || ''}</span></div>
        </div>
        <div class="modal-detail-group">
          <h4>Professional Details</h4>
          <div class="modal-detail-row"><span>PPAU Reg No:</span><span>${m.licenseNumber || ''}</span></div>
          <div class="modal-detail-row"><span>Practice Type:</span><span>${m.practiceType || ''}</span></div>
          <div class="modal-detail-row"><span>Employer:</span><span>${m.employer || '—'}</span></div>
          <div class="modal-detail-row"><span>Location:</span><span>${m.location || ''}</span></div>
          <div class="modal-detail-row"><span>Salary Range:</span><span>${m.salaryRange || '—'}</span></div>
          <div class="modal-detail-row"><span>Member Type:</span><span>${m.memberType || 'ordinary'}</span></div>
        </div>
        <div class="modal-detail-group">
          <h4>Account Status</h4>
          <div class="modal-detail-row"><span>Status:</span><span class="admin-status-pill ${statusClass}">${m.status || ''}</span></div>
          <div class="modal-detail-row"><span>Approval:</span><span>${m.approvalStatus || 'pending'}</span></div>
          <div class="modal-detail-row"><span>Total Savings:</span><strong>UGX ${(m.totalSavings || 0).toLocaleString()}</strong></div>
          <div class="modal-detail-row"><span>Total Shares:</span><strong>${m.totalShares || 0}</strong></div>
          <div class="modal-detail-row"><span>Monthly Contribution:</span><span>UGX ${(m.monthlyContribution || 0).toLocaleString()}</span></div>
          <div class="modal-detail-row"><span>Joined:</span><span>${m.joinedAt ? new Date(m.joinedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : '—'}</span></div>
        </div>
        <div class="modal-detail-group">
          <h4>Next of Kin</h4>
          <div class="modal-detail-row"><span>Name:</span><span>${m.nextOfKin || '—'}</span></div>
          <div class="modal-detail-row"><span>Phone:</span><span>${m.nextOfKinPhone || '—'}</span></div>
        </div>
      </div>
      ${payments.length ? `
        <div class="modal-payments-section">
          <h4>Payment History</h4>
          <table class="admin-table modal-payments-table">
            <thead>
              <tr><th>Date</th><th>Method</th><th>Amount</th><th>Reference</th><th>Status</th></tr>
            </thead>
            <tbody>
              ${payments.map(p => {
                const pStatus = p.status === 'verified' || p.status === 'completed' ? 'status-active' : 'status-pending';
                const pMethod = (p.paymentMethod || '').replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
                const pAmount = Number(p.amount || 0).toLocaleString('en-UG', { style: 'currency', currency: 'UGX' });
                const pDate = p.createdAt ? new Date(p.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '—';
                return `<tr><td>${pDate}</td><td>${pMethod}</td><td>${pAmount}</td><td>${p.reference || '—'}</td><td><span class="admin-status-pill ${pStatus}">${p.status}</span></td></tr>`;
              }).join('')}
            </tbody>
          </table>
        </div>
      ` : ''}
    `;

    if (m.status !== 'active' && m.approvalStatus !== 'rejected') {
      footer.innerHTML = `
        <button class="btn btn-primary" onclick="adminApproveMember('${m.memberId}'); closeMemberModal();">Approve</button>
        <button class="btn btn-danger" onclick="adminRejectMember('${m.memberId}'); closeMemberModal();">Reject</button>
        <button class="btn btn-outline-dark" onclick="closeMemberModal()">Close</button>
      `;
    } else {
      footer.innerHTML = `<button class="btn btn-outline-dark" onclick="closeMemberModal()">Close</button>`;
    }
  } catch (err) {
    body.innerHTML = `<p style="color:#dc2626">${err.message || 'Could not load member details.'}</p>`;
    footer.innerHTML = `<button class="btn btn-outline-dark" onclick="closeMemberModal()">Close</button>`;
  }
}

function closeMemberModal(e) {
  if (e && e.target !== e.currentTarget) return;
  document.getElementById('memberDetailModal').style.display = 'none';
}

function showAdminToast(message, type = 'info') {
  const toast = document.getElementById('adminToast');
  const msg = document.getElementById('adminToastMessage');
  if (!toast || !msg) return;

  msg.textContent = message;
  toast.className = 'admin-toast show';
  if (type === 'error') toast.classList.add('toast-error');
  else if (type === 'success') toast.classList.add('toast-success');
  else toast.classList.add('toast-info');

  setTimeout(() => {
    toast.className = 'admin-toast';
  }, 3500);
}

// ==================================================================
// NOTIFICATION SYSTEM (homepage)
// ==================================================================

let allNotifications = [];
let currentNotifFilter = 'all';

async function loadHomepageNotifications() {
  const bell = document.getElementById('notifBell');
  if (!bell) return;

  try {
    const data = await apiCall('/api/notifications');
    allNotifications = data.notifications || [];

    if (allNotifications.length > 0) {
      bell.style.display = 'flex';
      const badge = document.getElementById('notifBellBadge');
      if (badge) {
        badge.textContent = allNotifications.length;
        badge.style.display = 'flex';
      }

      renderNotifPanel(allNotifications);
      renderNotifPopup(allNotifications.slice(0, 3));

      const hasSeenPopup = localStorage.getItem('ppau_notif_popup_seen');
      if (!hasSeenPopup) {
        setTimeout(() => {
          document.getElementById('notifPopupOverlay').style.display = 'flex';
        }, 3000);
      }
    }
  } catch (err) {
    // Silently fail — notifications are non-critical
  }
}

function renderNotifPanel(notifications) {
  const body = document.getElementById('notifPanelBody');
  if (!body) return;

  if (!notifications.length) {
    body.innerHTML = `
      <div class="notif-empty">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
        <p>No notifications in this category</p>
      </div>`;
    return;
  }

  body.innerHTML = notifications.map(n => {
    const categoryLabel = n.category === 'announcement' ? 'Announcement' : n.category.charAt(0).toUpperCase() + n.category.slice(1);
    const date = n.createdAt ? new Date(n.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '';
    const linkHtml = n.link ? `<a href="${n.link}" target="_blank" class="notif-item-link">Read more →</a>` : '';

    return `
      <div class="notif-item">
        <div class="notif-item-header">
          <span class="notif-category-badge ${n.category}">${categoryLabel}</span>
        </div>
        <div class="notif-item-title">${n.title}</div>
        <div class="notif-item-message">${n.message}</div>
        <div class="notif-item-meta">
          <span>${date}</span>
          ${linkHtml}
        </div>
      </div>`;
  }).join('');
}

function renderNotifPopup(notifications) {
  const body = document.getElementById('notifPopupBody');
  if (!body) return;

  if (!notifications.length) {
    body.innerHTML = '<p style="text-align:center;color:var(--gray-500);padding:20px">No new updates at this time.</p>';
    return;
  }

  body.innerHTML = notifications.map(n => {
    const categoryLabel = n.category === 'announcement' ? 'Announcement' : n.category.charAt(0).toUpperCase() + n.category.slice(1);
    return `
      <div class="notif-popup-item">
        <div class="notif-item-header">
          <span class="notif-category-badge ${n.category}">${categoryLabel}</span>
        </div>
        <div class="notif-item-title">${n.title}</div>
        <div class="notif-item-message">${n.message}</div>
      </div>`;
  }).join('');
}

function filterNotifications(category, btn) {
  currentNotifFilter = category;
  document.querySelectorAll('.notif-tab').forEach(t => t.classList.remove('active'));
  if (btn) btn.classList.add('active');

  const filtered = category === 'all' ? allNotifications : allNotifications.filter(n => n.category === category);
  renderNotifPanel(filtered);
}

function openNotificationPanel() {
  document.getElementById('notifPanelOverlay').style.display = 'flex';
}

function closeNotificationPanel(e) {
  if (e && e.target !== e.currentTarget) return;
  document.getElementById('notifPanelOverlay').style.display = 'none';
}

function closeNotifPopup(e) {
  if (e && e.target !== e.currentTarget) return;
  document.getElementById('notifPopupOverlay').style.display = 'none';
  localStorage.setItem('ppau_notif_popup_seen', 'true');
}

// Initialize notifications on homepage
if (document.getElementById('notifBell')) {
  loadHomepageNotifications();
}

// Initialize leadership elections on homepage
if (document.getElementById('electionsList')) {
  loadElections();
}

// ==================================================================
// ADMIN NOTIFICATION MANAGEMENT
// ==================================================================

let adminNotifications = [];

async function loadAdminNotifications() {
  const token = localStorage.getItem('ppau_admin_token');
  if (!token) return;

  try {
    const data = await apiCall(`/api/admin/notifications?token=${token}`);
    adminNotifications = data.notifications || [];
    document.getElementById('tabNotifCount').textContent = adminNotifications.length;
    renderAdminNotificationsTable(adminNotifications);
  } catch (err) {
    showAdminToast(err.message || 'Could not load notifications.', 'error');
  }
}

function renderAdminNotificationsTable(notifications) {
  const tbody = document.getElementById('adminNotifTableBody');
  if (!tbody) return;

  if (!notifications.length) {
    tbody.innerHTML = '<tr><td colspan="6" class="admin-empty-cell">No notifications created yet.</td></tr>';
    return;
  }

  tbody.innerHTML = notifications.map(n => {
    const categoryLabel = n.category === 'announcement' ? 'Announcement' : n.category.charAt(0).toUpperCase() + n.category.slice(1);
    const date = n.createdAt ? new Date(n.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '—';
    const statusClass = n.active ? 'status-active' : 'status-rejected';
    const statusText = n.active ? 'Active' : 'Hidden';
    const toggleText = n.active ? 'Hide' : 'Show';

    return `<tr>
      <td><strong>${n.title}</strong></td>
      <td><span class="notif-category-badge ${n.category}">${categoryLabel}</span></td>
      <td style="max-width:250px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${n.message}</td>
      <td><span class="admin-status-pill ${statusClass}">${statusText}</span></td>
      <td>${date}</td>
      <td class="admin-actions-cell">
        <button class="btn btn-outline-dark btn-xs" onclick="adminToggleNotification('${n.id}')">${toggleText}</button>
        <button class="btn btn-danger btn-xs" onclick="adminDeleteNotification('${n.id}')">Delete</button>
      </td>
    </tr>`;
  }).join('');
}

async function handleCreateNotification(e) {
  e.preventDefault();
  const token = localStorage.getItem('ppau_admin_token');
  if (!token) return;

  const title = document.getElementById('notifTitle').value.trim();
  const message = document.getElementById('notifMessage').value.trim();
  const category = document.getElementById('notifCategory').value;
  const link = document.getElementById('notifLink').value.trim();

  if (!title || !message || !category) {
    showAdminToast('Please fill in all required fields.', 'error');
    return;
  }

  const btn = e.target.querySelector('button[type="submit"]');
  const originalText = btn.innerHTML;
  btn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="spin"><circle cx="12" cy="12" r="10"/></svg> Publishing...';
  btn.disabled = true;

  try {
    await apiCall(`/api/admin/notifications?token=${token}`, 'POST', { title, message, category, link });
    showAdminToast('Notification published successfully.', 'success');
    document.getElementById('notifCreateForm').reset();
    loadAdminNotifications();
  } catch (err) {
    showAdminToast(err.message || 'Could not publish notification.', 'error');
  } finally {
    btn.innerHTML = originalText;
    btn.disabled = false;
  }
}

async function adminDeleteNotification(notifId) {
  const token = localStorage.getItem('ppau_admin_token');
  if (!token) return;

  if (!confirm('Are you sure you want to delete this notification?')) return;

  try {
    await apiCall(`/api/admin/notifications/${notifId}/delete?token=${token}`, 'POST');
    showAdminToast('Notification deleted.', 'success');
    loadAdminNotifications();
  } catch (err) {
    showAdminToast(err.message || 'Could not delete notification.', 'error');
  }
}

async function adminToggleNotification(notifId) {
  const token = localStorage.getItem('ppau_admin_token');
  if (!token) return;

  try {
    await apiCall(`/api/admin/notifications/${notifId}/toggle?token=${token}`, 'POST');
    showAdminToast('Notification status updated.', 'success');
    loadAdminNotifications();
  } catch (err) {
    showAdminToast(err.message || 'Could not update notification.', 'error');
  }
}

// ==================================================================
// LEADERSHIP ELECTIONS
// ==================================================================

const LEADERSHIP_POSITIONS = [
  { id: 'board-chairperson', positionId: 'board-chairperson', title: 'Board Chairperson' },
  { id: 'vice-chairperson', positionId: 'vice-chairperson', title: 'Vice Chairperson' },
  { id: 'secretary', positionId: 'secretary', title: 'Secretary' },
  { id: 'treasurer', positionId: 'treasurer', title: 'Treasurer' },
  { id: 'ceo', positionId: 'ceo', title: 'CEO / Manager' },
  { id: 'pr-manager', positionId: 'pr-manager', title: 'Public Relations Manager' },
  { id: 'financial-advisor', positionId: 'financial-advisor', title: 'SACCO Financial Advisor' },
];

async function fetchElections(token) {
  const listResult = await apiCall('/api/elections');
  const items = listResult.elections || [];
  const elections = [];

  for (const item of items) {
    let election = item;
    let voterStatus = item.voterStatus || null;

    if (token && item.status === 'open') {
      try {
        const detail = await apiCall(`/api/elections/${item.id}?token=${token}`);
        election = detail.election || item;
        voterStatus = detail.voterStatus || null;
      } catch (err) {
        // Keep the public view if the detail lookup fails
      }
    }

    elections.push({ ...election, voterStatus });
  }

  return elections;
}

function escapeElectionHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function electionStatusLabel(status) {
  if (status === 'open') return 'Open';
  if (status === 'closed') return 'Closed';
  return 'Draft';
}

function renderElectionCard(election) {
  const status = election.status || 'draft';
  const canVote = !!(election.voterStatus && election.voterStatus.canVote);
  const hasVoted = !!(election.voterStatus && election.voterStatus.hasVoted);
  const tally = election.tally || { candidates: [], totalVotes: 0 };
  const candidates = (election.candidates || []).slice().sort((a, b) => (b.votes || 0) - (a.votes || 0));
  const resultsVisible = status === 'closed' || hasVoted || !canVote;

  const candidatesHtml = candidates.length
    ? candidates.map(c => {
      const canVoteHere = status === 'open' && canVote && !hasVoted;
      const voteState = hasVoted && election.voterStatus && c.candidateId === election.voterStatus.candidateId
        ? '<span class="election-vote-state">✓ Your vote</span>'
        : status === 'closed'
          ? '<span class="election-vote-state">—</span>'
          : '<span class="election-vote-state">Voting open</span>';
      const voteBtn = canVoteHere
        ? `<button type="button" class="btn btn-primary btn-sm election-vote-btn" onclick="castElectionVote('${escapeElectionHtml(election.id)}', '${escapeElectionHtml(c.candidateId)}')">Vote</button>`
        : voteState;
      return `
        <div class="election-candidate">
          <div class="election-candidate-avatar">
            ${c.image
              ? `<img src="${escapeElectionHtml(c.image)}" alt="${escapeElectionHtml(c.name)}" loading="lazy" />`
              : `<span class="election-candidate-initials">${escapeElectionHtml((c.name || '').split(' ').map(w => w[0]).join('').slice(0, 2)).toUpperCase()}</span>`}
          </div>
          <h5>${escapeElectionHtml(c.name)}</h5>
          ${c.bio ? `<p>${escapeElectionHtml(c.bio)}</p>` : ''}
          <span class="election-vote-count">${c.votes || 0} vote(s)</span>
          ${voteBtn}
        </div>`;
    }).join('')
    : '<p class="election-empty">No candidates have been nominated yet.</p>';

  const resultsHtml = resultsVisible && tally.candidates && tally.candidates.length
    ? `
      <div class="election-results">
        <h5>Results</h5>
        ${tally.candidates.map(c => `
          <div class="election-result-row">
            <div class="election-result-info">
              <span class="election-result-name">${escapeElectionHtml(c.name)}</span>
              <span class="election-result-meta">${c.votes} vote(s)${c.percentage ? ` • ${c.percentage}%` : ''}</span>
            </div>
            <div class="election-result-bar">
              <div class="election-result-fill" style="width:${c.percentage || 0}%"></div>
            </div>
          </div>`).join('')}
        ${tally.totalVotes ? `<div class="election-result-total">${tally.totalVotes} total vote(s) cast</div>` : ''}
      </div>`
    : '';

  const opensLabel = election.startDate ? `Opens ${new Date(election.startDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}` : '';
  const closesLabel = election.endDate ? `Closes ${new Date(election.endDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}` : '';

  return `
    <div class="election-card" data-election-id="${escapeElectionHtml(election.id)}">
      <div class="election-card-header">
        <div>
          <span class="election-position">${escapeElectionHtml(election.position || '')}</span>
          <h4>${escapeElectionHtml(election.title || election.position || 'Leadership Election')}</h4>
          ${election.description ? `<p>${escapeElectionHtml(election.description)}</p>` : ''}
        </div>
        <span class="election-status ${status}">${electionStatusLabel(status)}</span>
      </div>
      <div class="election-card-meta">
        ${opensLabel ? `<span>${opensLabel}</span>` : ''}
        ${closesLabel ? `<span>${closesLabel}</span>` : ''}
        <span>${election.totalVotes || 0} vote(s) cast</span>
      </div>
      <div class="election-candidates">${candidatesHtml}</div>
      ${resultsHtml}
    </div>`;

}

function renderElections(containerId, elections) {
  const container = document.getElementById(containerId);
  if (!container) return;

  if (!elections || !elections.length) {
    container.innerHTML = `
      <div class="elections-empty">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
        <p>No leadership elections are currently open.</p>
        <p class="elections-empty-sub">Elections for PPAU SACCO leadership positions will be listed here as they are called.</p>
      </div>`;
    return;
  }

  container.innerHTML = elections.map(e => renderElectionCard(e)).join('');
}

async function loadElections() {
  const container = document.getElementById('electionsList');
  if (!container) return;

  const token = localStorage.getItem('ppau_token');
  try {
    const elections = await fetchElections(token);
    renderElections('electionsList', elections);
  } catch (err) {
    container.innerHTML = `<div class="elections-empty"><p>Unable to load elections right now. ${err?.message || ''}</p></div>`;
  }
}

async function loadMemberElections() {
  const container = document.getElementById('dashElectionsList');
  if (!container) return;

  const token = localStorage.getItem('ppau_token');
  try {
    const elections = await fetchElections(token);
    renderElections('dashElectionsList', elections);
  } catch (err) {
    container.innerHTML = `<div class="elections-empty"><p>Unable to load elections right now. ${err?.message || ''}</p></div>`;
  }
}

async function castElectionVote(electionId, candidateId) {
  const token = localStorage.getItem('ppau_token');
  if (!token) {
    showPortalNotification('Please sign in to vote in leadership elections.', 'error');
    return;
  }

  try {
    const res = await apiCall(`/api/elections/${electionId}/vote?token=${token}`, 'POST', { candidateId });
    showPortalNotification('Your vote was recorded successfully!', 'success');
    const elections = await fetchElections(token);
    renderElections('electionsList', elections);
    renderElections('dashElectionsList', elections);
  } catch (err) {
    showPortalNotification(err.message || 'Vote failed. Please try again.', 'error');
  }
}

// ===== ADMIN: LEADERSHIP ELECTIONS =====

async function loadAdminElections() {
  const token = localStorage.getItem('ppau_admin_token');
  const container = document.getElementById('adminElectionsList');
  if (!token || !container) return;

  try {
    const data = await apiCall(`/api/admin/elections?token=${token}`);
    const elections = data.elections || [];
    const countEl = document.getElementById('adminElecCount');
    if (countEl) countEl.textContent = elections.length;

    const select = document.getElementById('adminElectionCandidateSelect');
    if (select) {
      select.innerHTML = '<option value="" disabled selected>Select election</option>';
      for (const el of elections) {
        const opt = document.createElement('option');
        opt.value = el.id;
        opt.textContent = `${el.position ? `${el.position} — ` : ''}${el.title || 'Leadership Election'}`;
        select.appendChild(opt);
      }
    }

    renderAdminElections(elections);
  } catch (err) {
    container.innerHTML = `<div class="elections-empty"><p>Unable to load elections.</p></div>`;
  }
}

function renderAdminElections(elections) {
  const container = document.getElementById('adminElectionsList');
  if (!container) return;

  if (!elections || !elections.length) {
    container.innerHTML = `<div class="elections-empty"><p>No leadership elections have been created yet.</p></div>`;
    return;
  }

  container.innerHTML = elections.map(e => renderAdminElectionCard(e)).join('');
}

function renderAdminElectionCard(e) {
  const candidatesHtml = (e.candidates || []).map(c => `
    <div class="admin-item">
      <h5>${escapeElectionHtml(c.name)}</h5>
      <p>${c.votes || 0} vote(s)</p>
    </div>`).join('');

  const actions = e.status === 'open'
    ? `<button class="btn btn-outline-dark btn-sm" onclick="adminSetElectionStatus('${e.id}', 'closed')">Close Voting</button>`
    : `<button class="btn btn-primary btn-sm" onclick="adminSetElectionStatus('${e.id}', 'open')">Open Voting</button>`;
  actions += ` <button class="btn btn-danger btn-sm" onclick="adminDeleteElection('${e.id}')">Delete</button>`;

  return `
    <div class="admin-item" data-election-id="${e.id}">
      <h5>${escapeElectionHtml(e.position || '')} — ${escapeElectionHtml(e.title || '')}</h5>
      <p>Status: <span class="admin-pill">${e.status}</span> • Total votes: ${e.totalVotes || 0} • Candidates: ${(e.candidates || []).length}</p>
      <div class="admin-item-actions">${actions}</div>
      ${candidatesHtml}
    </div>`;
}

async function adminSetElectionStatus(electionId, status) {
  const token = localStorage.getItem('ppau_admin_token');
  if (!token) return;

  try {
    await apiCall(`/api/admin/elections/${electionId}/close?token=${token}`, 'POST', { status });
    showAdminToast('Election status updated.', 'success');
    loadAdminElections();
  } catch (err) {
    showAdminToast(err.message || 'Could not update election.', 'error');
  }
}

async function adminDeleteElection(electionId) {
  const token = localStorage.getItem('ppau_admin_token');
  if (!token) return;

  try {
    await apiCall(`/api/admin/elections/${electionId}/delete?token=${token}`, 'POST');
    showAdminToast('Election deleted.', 'success');
    loadAdminElections();
  } catch (err) {
    showAdminToast(err.message || 'Could not delete election.', 'error');
  }
}

async function adminCreateElection(e) {
  if (e && e.preventDefault) e.preventDefault();

  const positionId = document.getElementById('adminElectionPosition')?.value || '';
  const title = document.getElementById('adminElectionTitle')?.value.trim();
  const description = document.getElementById('adminElectionDescription')?.value.trim();
  const status = document.getElementById('adminElectionStatus')?.value || 'draft';
  const startDate = document.getElementById('adminElectionStartDate')?.value;
  const endDate = document.getElementById('adminElectionEndDate')?.value;
  const candidateName = document.getElementById('adminElectionCandidateName')?.value.trim();
  const candidateImage = document.getElementById('adminElectionCandidateImage')?.value.trim();
  const candidateBio = document.getElementById('adminElectionCandidateBio')?.value.trim();

  const body = {
    positionId,
    title,
    description,
    status,
    startDate: startDate ? new Date(startDate).toISOString() : null,
    endDate: endDate ? new Date(endDate).toISOString() : null,
    candidateName,
    candidateImage,
    candidateBio,
  };

  try {
    const res = await apiCall('/api/admin/elections', 'POST', body);
    showAdminToast('Election created successfully.', 'success');
    const form = document.getElementById('adminElectionForm');
    if (form) form.reset();
    loadAdminElections();
  } catch (err) {
    showAdminToast(err.message || 'Could not create election.', 'error');
  }
}

async function adminAddCandidate(e) {
  if (e && e.preventDefault) e.preventDefault();

  const electionId = document.getElementById('adminElectionCandidateSelect')?.value;
  const name = document.getElementById('adminCandidateName')?.value.trim();
  const image = document.getElementById('adminCandidateImage')?.value.trim();
  const bio = document.getElementById('adminCandidateBio')?.value.trim();

  if (!electionId || !name) {
    showAdminToast('Please select an election and enter a candidate name.', 'error');
    return;
  }

  try {
    const res = await apiCall(`/api/admin/elections/${electionId}/candidates`, 'POST', { name, image, bio });
    showAdminToast('Candidate added.', 'success');
    const form = document.getElementById('adminCandidateForm');
    if (form) form.reset();
    loadAdminElections();
  } catch (err) {
    showAdminToast(err.message || 'Could not add candidate.', 'error');
  }
}
