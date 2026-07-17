// PPAU SACCO API Worker
// Handles: Registration, Payment, Login, Member Dashboard

export default {
  async fetch(request, env) {
    const allowedOrigins = ['https://ppau-sacco.com', 'https://ppau-sacco.pages.dev'];
    const origin = request.headers.get('Origin') || '';
    const corsOrigin = allowedOrigins.includes(origin) ? origin : '*';
    const corsHeaders = {
      'Access-Control-Allow-Origin': corsOrigin,
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Max-Age': '86400',
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders });
    }

    const url = new URL(request.url);
    const path = url.pathname;
    const normalizedPath = normalizeApiPath(path);

    try {
      // Route requests
      if (normalizedPath === '/api/register') {
        if (request.method === 'POST') {
          return await handleRegister(request, env, corsHeaders);
        }
        return jsonResponse({ error: 'Method not allowed', expected: 'POST' }, 405, corsHeaders);
      }
      if (normalizedPath === '/api/login') {
        if (request.method === 'POST') {
          return await handleLogin(request, env, corsHeaders);
        }
        return jsonResponse({ error: 'Method not allowed', expected: 'POST' }, 405, corsHeaders);
      }
      if (normalizedPath === '/api/admin/login') {
        if (request.method === 'POST') {
          return await handleAdminLogin(request, env, corsHeaders);
        }
        return jsonResponse({ error: 'Method not allowed', expected: 'POST' }, 405, corsHeaders);
      }
      if (normalizedPath === '/api/admin/registrations') {
        if (request.method === 'GET') {
          return await handleAdminRegistrations(request, env, corsHeaders);
        }
        return jsonResponse({ error: 'Method not allowed', expected: 'GET' }, 405, corsHeaders);
      }
      if (normalizedPath.startsWith('/api/admin/registrations/') && normalizedPath.endsWith('/approve')) {
        if (request.method === 'POST') {
          return await handleApproveRegistration(request, env, corsHeaders);
        }
        return jsonResponse({ error: 'Method not allowed', expected: 'POST' }, 405, corsHeaders);
      }
      if (normalizedPath === '/api/admin/stats') {
        if (request.method === 'GET') {
          return await handleAdminStats(request, env, corsHeaders);
        }
        return jsonResponse({ error: 'Method not allowed', expected: 'GET' }, 405, corsHeaders);
      }
      if (normalizedPath === '/api/admin/members') {
        if (request.method === 'GET') {
          return await handleAdminMembers(request, env, corsHeaders);
        }
        return jsonResponse({ error: 'Method not allowed', expected: 'GET' }, 405, corsHeaders);
      }
      if (normalizedPath.startsWith('/api/admin/members/') && !normalizedPath.includes('/reject') && !normalizedPath.includes('/approve')) {
        if (request.method === 'GET') {
          return await handleAdminMemberDetail(request, env, corsHeaders);
        }
        return jsonResponse({ error: 'Method not allowed', expected: 'GET' }, 405, corsHeaders);
      }
      if (normalizedPath.startsWith('/api/admin/registrations/') && normalizedPath.endsWith('/reject')) {
        if (request.method === 'POST') {
          return await handleRejectRegistration(request, env, corsHeaders);
        }
        return jsonResponse({ error: 'Method not allowed', expected: 'POST' }, 405, corsHeaders);
      }
      if (normalizedPath === '/api/admin/payments') {
        if (request.method === 'GET') {
          return await handleAdminPayments(request, env, corsHeaders);
        }
        return jsonResponse({ error: 'Method not allowed', expected: 'GET' }, 405, corsHeaders);
      }
      if (normalizedPath.startsWith('/api/admin/payments/') && normalizedPath.endsWith('/verify')) {
        if (request.method === 'POST') {
          return await handleVerifyPayment(request, env, corsHeaders);
        }
        return jsonResponse({ error: 'Method not allowed', expected: 'POST' }, 405, corsHeaders);
      }
      if (normalizedPath === '/api/payment/confirm') {
        if (request.method === 'POST') {
          return await handlePaymentConfirm(request, env, corsHeaders);
        }
        return jsonResponse({ error: 'Method not allowed', expected: 'POST' }, 405, corsHeaders);
      }
      if (normalizedPath === '/api/payment/flutterwave/initialize') {
        if (request.method === 'POST') {
          return await handleFlutterwaveInit(request, env, corsHeaders);
        }
        return jsonResponse({ error: 'Method not allowed', expected: 'POST' }, 405, corsHeaders);
      }
      if (normalizedPath === '/api/payment/flutterwave/webhook') {
        if (request.method === 'POST') {
          return await handleFlutterwaveWebhook(request, env, corsHeaders);
        }
        return jsonResponse({ error: 'Method not allowed', expected: 'POST' }, 405, corsHeaders);
      }
      if (normalizedPath === '/api/member') {
        if (request.method === 'GET') {
          return await handleGetMember(request, env, corsHeaders);
        }
        return jsonResponse({ error: 'Method not allowed', expected: 'GET' }, 405, corsHeaders);
      }
      if (normalizedPath === '/api/notifications') {
        if (request.method === 'GET') {
          return await handlePublicNotifications(request, env, corsHeaders);
        }
        return jsonResponse({ error: 'Method not allowed', expected: 'GET' }, 405, corsHeaders);
      }
      if (normalizedPath === '/api/admin/notifications') {
        if (request.method === 'GET') {
          return await handleAdminNotifications(request, env, corsHeaders);
        }
        if (request.method === 'POST') {
          return await handleCreateNotification(request, env, corsHeaders);
        }
        return jsonResponse({ error: 'Method not allowed', expected: 'GET or POST' }, 405, corsHeaders);
      }
      if (normalizedPath.startsWith('/api/admin/notifications/') && normalizedPath.endsWith('/delete')) {
        if (request.method === 'POST') {
          return await handleDeleteNotification(request, env, corsHeaders);
        }
        return jsonResponse({ error: 'Method not allowed', expected: 'POST' }, 405, corsHeaders);
      }
      if (normalizedPath.startsWith('/api/admin/notifications/') && normalizedPath.endsWith('/toggle')) {
        if (request.method === 'POST') {
          return await handleToggleNotification(request, env, corsHeaders);
        }
        return jsonResponse({ error: 'Method not allowed', expected: 'POST' }, 405, corsHeaders);
      }
      if (path === '/' || path === '') {
        return jsonResponse({
          status: 'ok',
          service: 'PPAU SACCO Membership API',
          message: 'Use /api/membership/health or the registration/payment routes.',
          timestamp: new Date().toISOString(),
        }, 200, corsHeaders);
      }

      if (normalizedPath === '/api/health') {
        return jsonResponse({ status: 'ok', timestamp: new Date().toISOString(), routes: ['register', 'login', 'payment', 'member'] }, 200, corsHeaders);
      }

      return jsonResponse({ error: 'Not found', path }, 404, corsHeaders);
    } catch (err) {
      return jsonResponse({ error: 'Internal server error', message: err.message }, 500, corsHeaders);
    }
  }
};

// ===== HELPERS =====

function jsonResponse(data, status = 200, headers = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', ...headers },
  });
}

function normalizeApiPath(pathname) {
  const aliasMap = {
    '/api/membership/register': '/api/register',
    '/api/membership/login': '/api/login',
    '/api/membership/payment': '/api/payment/confirm',
    '/api/membership/payment/flutterwave/initialize': '/api/payment/flutterwave/initialize',
    '/api/membership/payment/flutterwave/webhook': '/api/payment/flutterwave/webhook',
    '/api/membership/member': '/api/member',
    '/api/membership/health': '/api/health',
  };

  return aliasMap[pathname] || pathname;
}

function generateMemberId() {
  const year = new Date().getFullYear();
  const num = String(Math.floor(Math.random() * 9000) + 1000);
  return `PPAU-${year}-${num}`;
}

function generateToken() {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, b => b.toString(16).padStart(2, '0')).join('');
}

function hashPassword(password) {
  return crypto.subtle.digest('SHA-256', new TextEncoder().encode(password))
    .then(buf => Array.from(new Uint8Array(buf), b => b.toString(16).padStart(2, '0')).join(''));
}

function getAdminCredentials(env) {
  return {
    email: env.ADMIN_EMAIL || 'admin@ppausacco.org',
    password: env.ADMIN_PASSWORD || 'Admin@2026!',
  };
}

async function ensureAdmin(request, env, corsHeaders) {
  const url = new URL(request.url);
  const token = url.searchParams.get('token');
  if (!token) {
    return { error: jsonResponse({ error: 'Admin token required' }, 401, corsHeaders) };
  }

  const adminEmail = await env.MEMBERS_KV.get(`admin_token:${token}`);
  if (!adminEmail) {
    return { error: jsonResponse({ error: 'Unauthorized admin access' }, 401, corsHeaders) };
  }

  return { adminEmail };
}

// ===== REGISTRATION =====

async function handleRegister(request, env, corsHeaders) {
  const body = await request.json();

  // Validate required fields
  const required = ['firstName', 'lastName', 'email', 'phone', 'password', 'licenseNumber', 'practiceType'];
  for (const field of required) {
    if (!body[field]) {
      return jsonResponse({ error: `Missing required field: ${field}` }, 400, corsHeaders);
    }
  }

  // Check if email already registered
  const existingEmail = await env.MEMBERS_KV.get(`email:${body.email}`);
  if (existingEmail) {
    return jsonResponse({ error: 'An account with this email already exists' }, 409, corsHeaders);
  }

  // Check if license number already registered
  const existingLicense = await env.MEMBERS_KV.get(`license:${body.licenseNumber}`);
  if (existingLicense) {
    return jsonResponse({ error: 'An account with this license number already exists' }, 409, corsHeaders);
  }

  // Generate member ID and hash password
  const memberId = generateMemberId();
  const passwordHash = await hashPassword(body.password);
  const token = generateToken();
  const createdAt = new Date().toISOString();

  // Create member record
  const member = {
    memberId,
    firstName: body.firstName,
    lastName: body.lastName,
    email: body.email,
    phone: body.phone,
    gender: body.gender || '',
    dateOfBirth: body.dateOfBirth || '',
    nin: body.nin || '',
    licenseNumber: body.licenseNumber,
    practiceType: body.practiceType,
    employer: body.employer || '',
    location: body.location || '',
    salaryRange: body.salaryRange || '',
    memberType: body.memberType || 'ordinary',
    nextOfKin: body.nextOfKin || '',
    nextOfKinPhone: body.nextOfKinPhone || '',
    monthlyContribution: body.monthlyContribution || '100000',
    passwordHash,
    status: 'pending_payment',
    role: 'member',
    totalSavings: 0,
    totalShares: 0,
    totalLoans: 0,
    joinedAt: createdAt,
    lastLogin: null,
  };

  // Store in KV
  await env.MEMBERS_KV.put(`member:${memberId}`, JSON.stringify(member));
  await env.MEMBERS_KV.put(`email:${body.email}`, memberId);
  await env.MEMBERS_KV.put(`license:${body.licenseNumber}`, memberId);
  await env.MEMBERS_KV.put(`token:${token}`, memberId, { expirationTtl: 86400 * 30 }); // 30 days

  return jsonResponse({
    success: true,
    message: 'Registration successful. Please complete payment to activate your account.',
    memberId,
    token,
    member: {
      memberId,
      firstName: member.firstName,
      lastName: member.lastName,
      email: member.email,
      status: member.status,
    }
  }, 201, corsHeaders);
}

// ===== LOGIN =====

async function handleLogin(request, env, corsHeaders) {
  const body = await request.json();
  const { identifier, password } = body;

  if (!identifier || !password) {
    return jsonResponse({ error: 'Email/Member ID and password are required' }, 400, corsHeaders);
  }

  // Find member by email, member ID, or license
  let memberId = null;
  memberId = await env.MEMBERS_KV.get(`email:${identifier}`) || await env.MEMBERS_KV.get(`license:${identifier}`);
  if (!identifier.startsWith('PPAU-') && !memberId) {
    return jsonResponse({ error: 'Account not found' }, 404, corsHeaders);
  }
  if (identifier.startsWith('PPAU-')) {
    const exists = await env.MEMBERS_KV.get(`member:${identifier}`);
    if (exists) memberId = identifier;
  }

  if (!memberId) {
    return jsonResponse({ error: 'Invalid credentials' }, 401, corsHeaders);
  }

  const memberData = await env.MEMBERS_KV.get(`member:${memberId}`);
  if (!memberData) {
    return jsonResponse({ error: 'Account not found' }, 404, corsHeaders);
  }

  const member = JSON.parse(memberData);
  const passwordHash = await hashPassword(password);

  if (member.passwordHash !== passwordHash) {
    return jsonResponse({ error: 'Invalid password' }, 401, corsHeaders);
  }

  // Update last login
  member.lastLogin = new Date().toISOString();
  await env.MEMBERS_KV.put(`member:${memberId}`, JSON.stringify(member));

  // Generate session token
  const token = generateToken();
  await env.MEMBERS_KV.put(`token:${token}`, memberId, { expirationTtl: 86400 * 30 });

  return jsonResponse({
    success: true,
    token,
    member: {
      memberId: member.memberId,
      firstName: member.firstName,
      lastName: member.lastName,
      email: member.email,
      status: member.status,
      totalSavings: member.totalSavings,
      totalShares: member.totalShares,
    }
  }, 200, corsHeaders);
}

// ===== ADMIN LOGIN =====

async function handleAdminLogin(request, env, corsHeaders) {
  const body = await request.json();
  const { email, password } = body;
  const admin = getAdminCredentials(env);

  if (!email || !password) {
    return jsonResponse({ error: 'Admin email and password are required' }, 400, corsHeaders);
  }

  if (email !== admin.email || password !== admin.password) {
    return jsonResponse({ error: 'Invalid admin credentials' }, 401, corsHeaders);
  }

  const token = generateToken();
  await env.MEMBERS_KV.put(`admin_token:${token}`, admin.email, { expirationTtl: 86400 * 8 });

  return jsonResponse({ success: true, token, admin: { email: admin.email } }, 200, corsHeaders);
}

async function handleAdminRegistrations(request, env, corsHeaders) {
  const adminAuth = await ensureAdmin(request, env, corsHeaders);
  if (adminAuth.error) return adminAuth.error;

  const listResult = await env.MEMBERS_KV.list({ prefix: 'member:' });
  const registrations = [];

  for (const item of listResult.keys) {
    const memberData = await env.MEMBERS_KV.get(item.name);
    if (!memberData) continue;

    const member = JSON.parse(memberData);
    if (member.role !== 'member') continue;

    if (member.status === 'pending_payment' || member.status === 'approved_pending_payment' || member.status === 'pending_verification' || member.status === 'active') {
      registrations.push({
        memberId: member.memberId,
        firstName: member.firstName,
        lastName: member.lastName,
        email: member.email,
        phone: member.phone,
        practiceType: member.practiceType,
        status: member.status,
        approvalStatus: member.approvalStatus || 'pending',
        joinedAt: member.joinedAt,
        nin: member.nin,
        licenseNumber: member.licenseNumber,
      });
    }
  }

  return jsonResponse({ success: true, registrations }, 200, corsHeaders);
}

async function handleApproveRegistration(request, env, corsHeaders) {
  const adminAuth = await ensureAdmin(request, env, corsHeaders);
  if (adminAuth.error) return adminAuth.error;

  const url = new URL(request.url);
  const segments = url.pathname.split('/').filter(Boolean);
  const memberId = segments[segments.length - 2];

  const memberData = await env.MEMBERS_KV.get(`member:${memberId}`);
  if (!memberData) {
    return jsonResponse({ error: 'Member not found' }, 404, corsHeaders);
  }

  const member = JSON.parse(memberData);
  member.approvalStatus = 'approved';
  member.status = member.status === 'active' ? 'active' : 'approved_pending_payment';
  await env.MEMBERS_KV.put(`member:${member.memberId}`, JSON.stringify(member));

  return jsonResponse({ success: true, message: 'Registration approved', memberId: member.memberId }, 200, corsHeaders);
}

async function handleRejectRegistration(request, env, corsHeaders) {
  const adminAuth = await ensureAdmin(request, env, corsHeaders);
  if (adminAuth.error) return adminAuth.error;

  const url = new URL(request.url);
  const segments = url.pathname.split('/').filter(Boolean);
  const memberId = segments[segments.length - 2];

  const memberData = await env.MEMBERS_KV.get(`member:${memberId}`);
  if (!memberData) {
    return jsonResponse({ error: 'Member not found' }, 404, corsHeaders);
  }

  const member = JSON.parse(memberData);
  member.approvalStatus = 'rejected';
  member.status = 'rejected';
  member.rejectedAt = new Date().toISOString();
  member.rejectedBy = adminAuth.adminEmail;
  await env.MEMBERS_KV.put(`member:${member.memberId}`, JSON.stringify(member));

  return jsonResponse({ success: true, message: 'Registration rejected', memberId: member.memberId }, 200, corsHeaders);
}

async function handleAdminStats(request, env, corsHeaders) {
  const adminAuth = await ensureAdmin(request, env, corsHeaders);
  if (adminAuth.error) return adminAuth.error;

  const memberList = await env.MEMBERS_KV.list({ prefix: 'member:' });
  const paymentList = await env.MEMBERS_KV.list({ prefix: 'payment:' });

  let totalMembers = 0;
  let pendingApproval = 0;
  let pendingPayment = 0;
  let activeMembers = 0;
  let totalSavings = 0;
  let totalShares = 0;

  for (const key of memberList.keys) {
    const data = await env.MEMBERS_KV.get(key.name);
    if (!data) continue;
    const member = JSON.parse(data);
    if (member.role !== 'member') continue;
    totalMembers++;
    if (member.status === 'active') activeMembers++;
    if (member.approvalStatus === 'pending' || !member.approvalStatus) pendingApproval++;
    if (member.status === 'pending_payment' || member.status === 'pending_verification') pendingPayment++;
    totalSavings += Number(member.totalSavings || 0);
    totalShares += Number(member.totalShares || 0);
  }

  let totalPayments = 0;
  let pendingPayments = 0;
  let verifiedPayments = 0;

  for (const key of paymentList.keys) {
    const data = await env.MEMBERS_KV.get(key.name);
    if (!data) continue;
    const payment = JSON.parse(data);
    totalPayments++;
    if (payment.status === 'pending_verification') pendingPayments++;
    if (payment.status === 'verified' || payment.status === 'completed') verifiedPayments++;
  }

  return jsonResponse({
    success: true,
    stats: {
      totalMembers,
      pendingApproval,
      pendingPayment,
      activeMembers,
      totalSavings,
      totalShares,
      totalPayments,
      pendingPayments,
      verifiedPayments,
    }
  }, 200, corsHeaders);
}

async function handleAdminMembers(request, env, corsHeaders) {
  const adminAuth = await ensureAdmin(request, env, corsHeaders);
  if (adminAuth.error) return adminAuth.error;

  const memberList = await env.MEMBERS_KV.list({ prefix: 'member:' });
  const members = [];

  for (const key of memberList.keys) {
    const data = await env.MEMBERS_KV.get(key.name);
    if (!data) continue;
    const member = JSON.parse(data);
    if (member.role !== 'member') continue;
    members.push({
      memberId: member.memberId,
      firstName: member.firstName,
      lastName: member.lastName,
      email: member.email,
      phone: member.phone,
      gender: member.gender,
      practiceType: member.practiceType,
      employer: member.employer,
      location: member.location,
      memberType: member.memberType,
      status: member.status,
      approvalStatus: member.approvalStatus || 'pending',
      totalSavings: member.totalSavings || 0,
      totalShares: member.totalShares || 0,
      joinedAt: member.joinedAt,
      lastLogin: member.lastLogin,
      rejectedAt: member.rejectedAt,
      rejectedBy: member.rejectedBy,
      nin: member.nin,
      licenseNumber: member.licenseNumber,
      salaryRange: member.salaryRange,
      nextOfKin: member.nextOfKin,
      nextOfKinPhone: member.nextOfKinPhone,
      monthlyContribution: member.monthlyContribution,
    });
  }

  return jsonResponse({ success: true, members }, 200, corsHeaders);
}

async function handleAdminMemberDetail(request, env, corsHeaders) {
  const adminAuth = await ensureAdmin(request, env, corsHeaders);
  if (adminAuth.error) return adminAuth.error;

  const url = new URL(request.url);
  const segments = url.pathname.split('/').filter(Boolean);
  const memberId = segments[segments.length - 1];

  const memberData = await env.MEMBERS_KV.get(`member:${memberId}`);
  if (!memberData) {
    return jsonResponse({ error: 'Member not found' }, 404, corsHeaders);
  }

  const member = JSON.parse(memberData);
  delete member.passwordHash;

  // Get payment history
  const paymentsKey = `payments:${memberId}`;
  const paymentIdsRaw = await env.MEMBERS_KV.get(paymentsKey);
  let payments = [];
  if (paymentIdsRaw) {
    const paymentIds = JSON.parse(paymentIdsRaw);
    payments = await Promise.all(
      paymentIds.map(async (id) => {
        const pData = await env.MEMBERS_KV.get(`payment:${id}`);
        return pData ? JSON.parse(pData) : null;
      })
    );
    payments = payments.filter(Boolean);
  }

  return jsonResponse({ success: true, member, payments }, 200, corsHeaders);
}

async function handleAdminPayments(request, env, corsHeaders) {
  const adminAuth = await ensureAdmin(request, env, corsHeaders);
  if (adminAuth.error) return adminAuth.error;

  const listResult = await env.MEMBERS_KV.list({ prefix: 'payment:' });
  const payments = [];

  for (const item of listResult.keys) {
    const paymentData = await env.MEMBERS_KV.get(item.name);
    if (!paymentData) continue;
    payments.push(JSON.parse(paymentData));
  }

  return jsonResponse({ success: true, payments }, 200, corsHeaders);
}

async function handleVerifyPayment(request, env, corsHeaders) {
  const adminAuth = await ensureAdmin(request, env, corsHeaders);
  if (adminAuth.error) return adminAuth.error;

  const url = new URL(request.url);
  const segments = url.pathname.split('/').filter(Boolean);
  const paymentId = segments[segments.length - 2];

  const paymentData = await env.MEMBERS_KV.get(`payment:${paymentId}`);
  if (!paymentData) {
    return jsonResponse({ error: 'Payment not found' }, 404, corsHeaders);
  }

  const payment = JSON.parse(paymentData);
  payment.status = 'verified';
  payment.verifiedAt = new Date().toISOString();
  payment.verifiedBy = adminAuth.adminEmail;
  await env.MEMBERS_KV.put(`payment:${payment.paymentId}`, JSON.stringify(payment));

  const memberData = await env.MEMBERS_KV.get(`member:${payment.memberId}`);
  if (memberData) {
    const member = JSON.parse(memberData);
    member.approvalStatus = member.approvalStatus || 'approved';
    member.status = 'active';
    member.totalShares = Math.max(member.totalShares || 0, 10);
    member.totalSavings = Number(member.totalSavings || 0) + Number(payment.amount || 0);
    await env.MEMBERS_KV.put(`member:${member.memberId}`, JSON.stringify(member));
  }

  return jsonResponse({ success: true, message: 'Payment verified', paymentId }, 200, corsHeaders);
}

// ===== PAYMENT CONFIRMATION (Bank / Airtel / MoMo) =====

async function handlePaymentConfirm(request, env, corsHeaders) {
  const body = await request.json();
  const { memberId, paymentMethod, amount, reference, proofFileName } = body;

  if (!memberId || !paymentMethod || !amount) {
    return jsonResponse({ error: 'Member ID, payment method, and amount are required' }, 400, corsHeaders);
  }

  const memberData = await env.MEMBERS_KV.get(`member:${memberId}`);
  if (!memberData) {
    return jsonResponse({ error: 'Member not found' }, 404, corsHeaders);
  }

  const member = JSON.parse(memberData);

  // Create payment record
  const paymentId = `PAY-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;
  const payment = {
    paymentId,
    memberId,
    paymentMethod,
    amount: Number(amount),
    reference: reference || '',
    proofFileName: proofFileName || '',
    status: 'pending_verification',
    createdAt: new Date().toISOString(),
    verifiedAt: null,
    verifiedBy: null,
  };

  await env.MEMBERS_KV.put(`payment:${paymentId}`, JSON.stringify(payment));

  // Add to member's payment history
  const paymentsKey = `payments:${memberId}`;
  const existingPayments = await env.MEMBERS_KV.get(paymentsKey);
  const paymentIds = existingPayments ? JSON.parse(existingPayments) : [];
  paymentIds.push(paymentId);
  await env.MEMBERS_KV.put(paymentsKey, JSON.stringify(paymentIds));

  // If payment is for membership fee + shares (UGX 150,000), update member status
  if (Number(amount) >= 150000 && member.status === 'pending_payment') {
    member.status = 'pending_verification';
    member.totalShares = 10;
    await env.MEMBERS_KV.put(`member:${memberId}`, JSON.stringify(member));
  }

  return jsonResponse({
    success: true,
    message: 'Payment confirmation submitted. It will be verified within 24-48 hours.',
    paymentId,
    status: 'pending_verification',
  }, 201, corsHeaders);
}

// ===== FLUTTERWAVE CARD PAYMENT =====

async function handleFlutterwaveInit(request, env, corsHeaders) {
  const body = await request.json();
  const { memberId, email, amount, currency, firstName, lastName, phone } = body;

  if (!memberId || !email || !amount) {
    return jsonResponse({ error: 'Member ID, email, and amount are required' }, 400, corsHeaders);
  }

  const secretKey = env.FLUTTERWAVE_SECRET_KEY;
  if (!secretKey) {
    return jsonResponse({ error: 'Flutterwave is not configured yet' }, 503, corsHeaders);
  }

  const tx_ref = `PPAU-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;

  // Initialize Flutterwave payment
  const flutterwaveResponse = await fetch('https://api.flutterwave.com/v3/payments', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${secretKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      tx_ref,
      amount: Number(amount),
      currency: currency || 'UGX',
      redirect_url: `https://ppau-sacco.com/portal.html#payment-result`,
      meta: { memberId },
      customer: {
        email,
        name: `${firstName || ''} ${lastName || ''}`.trim(),
        phone_number: phone || '',
      },
      customizations: {
        title: 'PPAU SACCO Payment',
        description: `Registration payment for member ${memberId}`,
      },
    }),
  });

  const flutterwaveData = await flutterwaveResponse.json();

  if (flutterwaveData.status !== 'success') {
    return jsonResponse({
      error: 'Payment initialization failed',
      message: flutterwaveData.message || 'Unknown error',
    }, 400, corsHeaders);
  }

  // Store transaction reference
  await env.MEMBERS_KV.put(`tx:${tx_ref}`, JSON.stringify({
    memberId,
    amount: Number(amount),
    currency: currency || 'UGX',
    status: 'initialized',
    createdAt: new Date().toISOString(),
  }), { expirationTtl: 86400 }); // 24 hours

  return jsonResponse({
    success: true,
    tx_ref,
    checkout_url: flutterwaveData.data?.link,
  }, 200, corsHeaders);
}

// ===== FLUTTERWAVE WEBHOOK =====

async function handleFlutterwaveWebhook(request, env, corsHeaders) {
  const body = await request.json();
  const secretHash = env.FLUTTERWAVE_ENCRYPTION_KEY;

  // Verify webhook signature (Flutterwave sends it in header)
  const signature = request.headers.get('verif-hash');
  // In production, verify: if (signature !== secretHash) return 401;

  const { event, data } = body;

  if (event === 'charge.completed' && data?.status === 'successful') {
    const tx_ref = data.tx_ref;
    const txData = await env.MEMBERS_KV.get(`tx:${tx_ref}`);

    if (txData) {
      const tx = JSON.parse(txData);

      // Create payment record
      const paymentId = `PAY-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;
      const payment = {
        paymentId,
        memberId: tx.memberId,
        paymentMethod: 'flutterwave_card',
        amount: tx.amount,
        reference: tx_ref,
        flutterwaveId: data.id,
        status: 'completed',
        createdAt: new Date().toISOString(),
        verifiedAt: new Date().toISOString(),
        verifiedBy: 'flutterwave_webhook',
      };

      await env.MEMBERS_KV.put(`payment:${paymentId}`, JSON.stringify(payment));

      // Update member status and savings
      const memberData = await env.MEMBERS_KV.get(`member:${tx.memberId}`);
      if (memberData) {
        const member = JSON.parse(memberData);

        if (member.status === 'pending_payment' || member.status === 'pending_verification') {
          member.status = 'active';
          member.totalShares = 10;
        }
        member.totalSavings += tx.amount;
        await env.MEMBERS_KV.put(`member:${tx.memberId}`, JSON.stringify(member));
      }

      // Add to payment history
      const paymentsKey = `payments:${tx.memberId}`;
      const existingPayments = await env.MEMBERS_KV.get(paymentsKey);
      const paymentIds = existingPayments ? JSON.parse(existingPayments) : [];
      paymentIds.push(paymentId);
      await env.MEMBERS_KV.put(paymentsKey, JSON.stringify(paymentIds));

      // Update transaction
      tx.status = 'completed';
      await env.MEMBERS_KV.put(`tx:${tx_ref}`, JSON.stringify(tx), { expirationTtl: 86400 });
    }
  }

  return jsonResponse({ status: 'ok' }, 200, corsHeaders);
}

// ===== GET MEMBER =====

async function handleGetMember(request, env, corsHeaders) {
  const url = new URL(request.url);
  const token = url.searchParams.get('token');

  if (!token) {
    return jsonResponse({ error: 'Token required' }, 400, corsHeaders);
  }

  const memberId = await env.MEMBERS_KV.get(`token:${token}`);
  if (!memberId) {
    return jsonResponse({ error: 'Invalid or expired token' }, 401, corsHeaders);
  }

  const memberData = await env.MEMBERS_KV.get(`member:${memberId}`);
  if (!memberData) {
    return jsonResponse({ error: 'Member not found' }, 404, corsHeaders);
  }

  const member = JSON.parse(memberData);
  delete member.passwordHash; // Don't send password hash

  // Get payment history
  const paymentsKey = `payments:${memberId}`;
  const paymentIdsRaw = await env.MEMBERS_KV.get(paymentsKey);
  let payments = [];
  if (paymentIdsRaw) {
    const paymentIds = JSON.parse(paymentIdsRaw);
    payments = await Promise.all(
      paymentIds.map(async (id) => {
        const pData = await env.MEMBERS_KV.get(`payment:${id}`);
        return pData ? JSON.parse(pData) : null;
      })
    );
    payments = payments.filter(Boolean).slice(-20); // Last 20 payments
  }

  return jsonResponse({
    success: true,
    member,
    payments,
  }, 200, corsHeaders);
}

// ===== NOTIFICATIONS =====

async function handlePublicNotifications(request, env, corsHeaders) {
  const listResult = await env.MEMBERS_KV.list({ prefix: 'notification:' });
  const notifications = [];

  for (const key of listResult.keys) {
    const data = await env.MEMBERS_KV.get(key.name);
    if (!data) continue;
    const notif = JSON.parse(data);
    if (notif.active) {
      notifications.push({
        id: notif.id,
        title: notif.title,
        message: notif.message,
        category: notif.category,
        link: notif.link || '',
        createdAt: notif.createdAt,
      });
    }
  }

  notifications.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  return jsonResponse({ success: true, notifications }, 200, corsHeaders);
}

async function handleAdminNotifications(request, env, corsHeaders) {
  const adminAuth = await ensureAdmin(request, env, corsHeaders);
  if (adminAuth.error) return adminAuth.error;

  const listResult = await env.MEMBERS_KV.list({ prefix: 'notification:' });
  const notifications = [];

  for (const key of listResult.keys) {
    const data = await env.MEMBERS_KV.get(key.name);
    if (!data) continue;
    notifications.push(JSON.parse(data));
  }

  notifications.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  return jsonResponse({ success: true, notifications }, 200, corsHeaders);
}

async function handleCreateNotification(request, env, corsHeaders) {
  const adminAuth = await ensureAdmin(request, env, corsHeaders);
  if (adminAuth.error) return adminAuth.error;

  const body = await request.json();
  const { title, message, category, link } = body;

  if (!title || !message || !category) {
    return jsonResponse({ error: 'Title, message, and category are required' }, 400, corsHeaders);
  }

  const validCategories = ['news', 'announcement', 'blog'];
  if (!validCategories.includes(category)) {
    return jsonResponse({ error: 'Category must be news, announcement, or blog' }, 400, corsHeaders);
  }

  const id = `NOTIF-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;
  const notification = {
    id,
    title,
    message,
    category,
    link: link || '',
    active: true,
    createdBy: adminAuth.adminEmail,
    createdAt: new Date().toISOString(),
  };

  await env.MEMBERS_KV.put(`notification:${id}`, JSON.stringify(notification));

  return jsonResponse({ success: true, notification }, 201, corsHeaders);
}

async function handleDeleteNotification(request, env, corsHeaders) {
  const adminAuth = await ensureAdmin(request, env, corsHeaders);
  if (adminAuth.error) return adminAuth.error;

  const url = new URL(request.url);
  const segments = url.pathname.split('/').filter(Boolean);
  const notifId = segments[segments.length - 2];

  const notifData = await env.MEMBERS_KV.get(`notification:${notifId}`);
  if (!notifData) {
    return jsonResponse({ error: 'Notification not found' }, 404, corsHeaders);
  }

  await env.MEMBERS_KV.delete(`notification:${notifId}`);

  return jsonResponse({ success: true, message: 'Notification deleted' }, 200, corsHeaders);
}

async function handleToggleNotification(request, env, corsHeaders) {
  const adminAuth = await ensureAdmin(request, env, corsHeaders);
  if (adminAuth.error) return adminAuth.error;

  const url = new URL(request.url);
  const segments = url.pathname.split('/').filter(Boolean);
  const notifId = segments[segments.length - 2];

  const notifData = await env.MEMBERS_KV.get(`notification:${notifId}`);
  if (!notifData) {
    return jsonResponse({ error: 'Notification not found' }, 404, corsHeaders);
  }

  const notif = JSON.parse(notifData);
  notif.active = !notif.active;
  await env.MEMBERS_KV.put(`notification:${notifId}`, JSON.stringify(notif));

  return jsonResponse({ success: true, notification: notif }, 200, corsHeaders);
}
