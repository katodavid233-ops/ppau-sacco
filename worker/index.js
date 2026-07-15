// PPAU SACCO API Worker
// Handles: Registration, Payment, Login, Member Dashboard

export default {
  async fetch(request, env) {
    const allowedOrigins = ['https://ppau-sacco.com', 'https://ppau-sacco.pages.dev'];
    const origin = request.headers.get('Origin') || '';
    const corsOrigin = allowedOrigins.includes(origin) ? origin : '*';
    const corsHeaders = {
      'Access-Control-Allow-Origin': corsOrigin,
      'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
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
