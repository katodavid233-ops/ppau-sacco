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

  const adminLoginResult = await request('/api/admin/login', {
    method: 'POST',
    body: JSON.stringify({
      email: 'admin@ppausacco.org',
      password: 'Admin@2026!',
    }),
  });

  assert.strictEqual(adminLoginResult.response.status, 200, 'Admin login should succeed');
  assert.ok(adminLoginResult.body.token, 'Admin login should return a token');

  const adminRegistrationsResult = await request(`/api/admin/registrations?token=${adminLoginResult.body.token}`);
  assert.strictEqual(adminRegistrationsResult.response.status, 200, 'Admin registration review endpoint should work');

  const adminApproveResult = await request(`/api/admin/registrations/${registerResult.body.memberId}/approve?token=${adminLoginResult.body.token}`, {
    method: 'POST',
  });
  assert.strictEqual(adminApproveResult.response.status, 200, 'Admin member approval should succeed');

  const adminPaymentsResult = await request(`/api/admin/payments?token=${adminLoginResult.body.token}`);
  assert.strictEqual(adminPaymentsResult.response.status, 200, 'Admin payment review endpoint should work');

  const adminVerifyResult = await request(`/api/admin/payments/${paymentResult.body.paymentId}/verify?token=${adminLoginResult.body.token}`, {
    method: 'POST',
  });
  assert.strictEqual(adminVerifyResult.response.status, 200, 'Admin payment verification should succeed');

  const adminElectionsResult = await request(`/api/admin/elections?token=${adminLoginResult.body.token}`);
  assert.strictEqual(adminElectionsResult.response.status, 200, 'Admin election list endpoint should work');

  const electionCreateResult = await request('/api/admin/elections', {
    method: 'POST',
    body: JSON.stringify({
      positionId: 'treasurer',
      title: 'Treasurer Election Test',
      description: 'Member vote for the Treasurer position',
      status: 'open',
      startDate: new Date(Date.now() - 86400000).toISOString(),
      endDate: new Date(Date.now() + (86400000 * 30)).toISOString(),
      candidateName: 'Test Candidate',
      candidateImage: '',
      candidateBio: 'Test bio',
    }),
  });

  assert.strictEqual(electionCreateResult.response.status, 201, 'Election creation should succeed');
  const electionId = electionCreateResult.body.election?.id;
  const candidateId = electionCreateResult.body.election?.candidates?.[0]?.candidateId;
  assert.ok(electionId, 'Election creation should return an electionId');
  assert.ok(candidateId, 'Election creation should return a candidateId');

  const electionVoteResult = await request(`/api/elections/${electionId}/vote?token=${registerResult.body.token}`, {
    method: 'POST',
    body: JSON.stringify({ candidateId }),
  });

  assert.strictEqual(electionVoteResult.response.status, 200, 'Member election vote should succeed');

  const electionDetailResult = await request(`/api/elections/${electionId}?token=${registerResult.body.token}`);
  assert.strictEqual(electionDetailResult.response.status, 200, 'Election detail lookup should work');
  assert.strictEqual(electionDetailResult.body.voterStatus?.hasVoted, true, 'Member should have voted in the election');
  assert.strictEqual(electionDetailResult.body.tally?.totalVotes, 1, 'Election tally should count cast votes');

  const duplicateElectionVoteResult = await request(`/api/elections/${electionId}/vote?token=${registerResult.body.token}`, {
    method: 'POST',
    body: JSON.stringify({ candidateId }),
  });

  assert.strictEqual(duplicateElectionVoteResult.response.status, 409, 'Duplicate election votes should be rejected');

  const adminDeleteElectionResult = await request(`/api/admin/elections/${electionId}/delete?token=${adminLoginResult.body.token}`, {
    method: 'POST',
  });

  assert.strictEqual(adminDeleteElectionResult.response.status, 200, 'Admin election delete should succeed');

  console.log('API registration, admin approval, payment verification, and election flow verified successfully.');
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
