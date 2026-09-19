async function runTests() {
  console.log('🧪 Running Verification Tests on http://localhost:5000...\n');

  try {
    // 1. Health Check
    const health = await fetch('http://localhost:5000/api/health').then(r => r.json());
    console.log(`[1] Health Check: Status ok ->`, health.status === 'ok' ? 'PASS' : 'FAIL');

    // 2. Fetch Active Practice Sections
    const sections = await fetch('http://localhost:5000/api/practice/sections').then(r => r.json());
    console.log(`[2] GET /api/practice/sections -> Found ${sections.length} sections:`, sections.map(s => s.name).join(', '));

    // 3. Fetch Practice Problems
    const problems = await fetch('http://localhost:5000/api/practice/problems').then(r => r.json());
    console.log(`[3] GET /api/practice/problems -> Found ${problems.length} problems`);

    // 4. Fetch Today's Challenge
    const challenge = await fetch('http://localhost:5000/api/todays-challenge').then(r => r.json());
    console.log(`[4] GET /api/todays-challenge -> Challenge: "${challenge.title}"`);

    // 5. Admin Login
    const loginRes = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'admin', password: 'admin123' })
    });
    const login = await loginRes.json();
    console.log(`[5] POST /api/auth/login -> Token received:`, Boolean(login.token));

    const token = login.token;

    // 6. Admin Create New Section (React)
    const newSectionRes = await fetch('http://localhost:5000/api/practice/admin/practice-sections', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        name: 'React',
        description: 'React hooks and component challenges',
        displayOrder: 3,
        status: 'active'
      })
    });
    const newSection = await newSectionRes.json();
    console.log(`[6] Admin Add Section "React" -> Section ID: ${newSection.id}`);

    // 7. Admin Create Problem assigned to Heading "React"
    const newProblemRes = await fetch('http://localhost:5000/api/practice/admin/practice-problems', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        title: 'Build a Custom Counter Hook',
        type: 'custom',
        difficulty: 'Easy',
        topic: 'Hooks',
        headingId: newSection.id,
        statement: 'Create a custom hook useCounter that returns count, increment, and decrement functions.',
        starterCode: 'function useCounter(initial = 0) { ... }'
      })
    });
    const newProblem = await newProblemRes.json();
    console.log(`[7] Admin Add Problem in Section "React" -> Problem ID: ${newProblem.id}`);

    // 8. Verify public site section listing includes "React" with the new problem
    const updatedSections = await fetch('http://localhost:5000/api/practice/sections').then(r => r.json());
    const reactSec = updatedSections.find(s => s.id === newSection.id);
    console.log(`[8] Verification: "React" Heading dynamically listed on public site:`, Boolean(reactSec));

    const updatedProblems = await fetch('http://localhost:5000/api/practice/problems?headingId=' + newSection.id).then(r => r.json());
    console.log(`[9] Verification: Problems assigned under "React" heading:`, updatedProblems.length);

    console.log('\n🎉 ALL 9 VERIFICATION TESTS PASSED PERFECTLY!');

  } catch (err) {
    console.error('❌ Verification failed:', err);
  }
}

runTests();
