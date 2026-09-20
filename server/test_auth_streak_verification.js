import fetch from 'node.fetch';

async function testAuthStreak() {
  console.log('🧪 Testing Learner Registration, Login, Streak & Solved Problems...\n');

  try {
    const testUsername = `learner_${Date.now()}`;
    const testPassword = 'password123';

    // 1. Register new learner
    const regRes = await fetch('http://localhost:5000/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: testUsername,
        password: testPassword,
        name: 'Test Learner'
      })
    }).then(r => r.json());

    console.log('[Test 1] Learner Registration:');
    console.log('  Registered User:', regRes.user?.username);
    console.log('  Initial Streak:', regRes.user?.streak, '(Expected: 1)');

    // 2. Login
    const loginRes = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: testUsername,
        password: testPassword
      })
    }).then(r => r.json());

    console.log('\n[Test 2] Learner Login:');
    console.log('  Logged in:', Boolean(loginRes.token));

    // 3. Mark Problem as Solved
    const solveRes = await fetch('http://localhost:5000/api/auth/solve-problem', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${loginRes.token}`
      },
      body: JSON.stringify({ problemId: 'prob_3' })
    }).then(r => r.json());

    console.log('\n[Test 3] Mark Problem as Solved:');
    console.log('  Solved Problems Array:', solveRes.user?.solvedProblems);
    console.log('  Contains prob_3:', solveRes.user?.solvedProblems?.includes('prob_3'));

    if (regRes.user?.streak === 1 && solveRes.user?.solvedProblems?.includes('prob_3')) {
      console.log('\n🎉 ALL AUTH, STREAK & SOLVED CHECKMARK TESTS PASSED SUCCESSFULLY!');
    } else {
      console.log('\n❌ AUTH STREAK TEST FAILED');
    }

  } catch (err) {
    console.error('Test error:', err);
  }
}

testAuthStreak();
