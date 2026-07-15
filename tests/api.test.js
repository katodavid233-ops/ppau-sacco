const assert = require('assert');

const baseUrl = process.env.API_BASE || 'http://127.0.0.1:8787';

async function request(path, options = {}) {
  const response = await fetch(`${baseUrl}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  const text = await response.text();
  let body = null;
  try {
    body = text ? JSON.parse(text) : null;
  } catch (error) {
    body = text;
  }
  return { response, body };
}

async function main() {
  const suffix = `${Date.now()}-${Math.floor(Math.random() * 10000)}`;
  const registerResult = await request('/api/membership/register', {
    method: 'POST',
    body: JSON.stringify({
      firstName: 'Test',
      lastName: 'Member',
      email: `membership-test+${suffix}@example.com`,
      phone: '+256700000000',
      password: 'Test12345!',
      licenseNumber: `PPAU/REG/2026/${suffix}`,
      practiceType: 'community',
    }),
  });

  assert.strictEqual(registerResult.response.status, 201, 'Registration should succeed');
  assert.ok(registerResult.body.memberId, 'Registration should return a memberId');
  assert.ok(registerResult.body.token, 'Registration should return a token');

  const memberResult = await request(`/api/membership/member?token=${registerResult.body.token}`);
  assert.strictEqual(memberResult.response.status, 200, 'Member lookup should work');
  assert.strictEqual(memberResult.body.member?.memberId, registerResult.body.memberId);

  const paymentResult = await request('/api/membership/payment', {
    method: 'POST',
    body: JSON.stringify({
      memberId: registerResult.body.memberId,
      paymentMethod: 'bank',
      amount: 150000,
      reference: 'test-payment',
    }),
  });

  assert.strictEqual(paymentResult.response.status, 201, 'Payment confirmation should succeed');
  assert.ok(paymentResult.body.paymentId, 'Payment confirmation should return a paymentId');

  console.log('API registration and payment flow verified successfully.');
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
