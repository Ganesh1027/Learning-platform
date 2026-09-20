async function testCompiler() {
  console.log('🧪 Testing Backend Compiler Engine & Strict Output Validation...\n');

  try {
    // 1. Test Incorrect Code (just print() as in user's screenshot)
    const badPythonRes = await fetch('http://localhost:5000/api/practice/run-code', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        code: 'def reverseString(str):\n    # Write your solution here\n    print()',
        language: 'python',
        problemId: 'prob_3'
      })
    }).then(r => r.json());

    console.log('[Test 1] Python print() Code Execution:');
    console.log('  All Passed:', badPythonRes.allPassed, '(Expected: false)');
    console.log('  Test 1 Result:', badPythonRes.results[0].passed ? 'FAIL' : 'PASS (Failed as expected)');
    console.log('  Received Output:', badPythonRes.results[0].actual);

    // 2. Test Correct Solution in Python
    const goodPythonRes = await fetch('http://localhost:5000/api/practice/run-code', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        code: 'def reverseString(str):\n    return str[::-1]',
        language: 'python',
        problemId: 'prob_3'
      })
    }).then(r => r.json());

    console.log('\n[Test 2] Python Correct Solution (return str[::-1]):');
    console.log('  All Passed:', goodPythonRes.allPassed, '(Expected: true)');
    console.log('  Test 1 Result:', goodPythonRes.results[0].passed ? 'PASS' : 'FAIL');
    console.log('  Actual Output:', goodPythonRes.results[0].actual);

    // 3. Test Correct Solution in JavaScript
    const goodJSRes = await fetch('http://localhost:5000/api/practice/run-code', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        code: 'function reverseString(str) {\n  return str.split("").reverse().join("");\n}',
        language: 'javascript',
        problemId: 'prob_3'
      })
    }).then(r => r.json());

    console.log('\n[Test 3] JavaScript Correct Solution (str.split("").reverse().join("")):');
    console.log('  All Passed:', goodJSRes.allPassed, '(Expected: true)');
    console.log('  Test 1 Result:', goodJSRes.results[0].passed ? 'PASS' : 'FAIL');
    console.log('  Actual Output:', goodJSRes.results[0].actual);

    // 4. Test Custom Function Name (def fizzBuzz(n) with camelCase)
    const customFnPythonRes = await fetch('http://localhost:5000/api/practice/run-code', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        code: 'def fizzBuzz(n):\n    return ["1","2","Fizz","4","Buzz"]',
        language: 'python',
        problemId: 'prob_5',
        fnName: 'fizzbuzz_classic'
      })
    }).then(r => r.json());

    console.log('\n[Test 4] Python Custom Function Name (def fizzBuzz(n)):');
    console.log('  All Passed:', customFnPythonRes.allPassed, '(Expected: true)');
    console.log('  Test 1 Result:', customFnPythonRes.results[0].passed ? 'PASS' : 'FAIL');
    console.log('  Actual Output:', customFnPythonRes.results[0].actual);

    if (!badPythonRes.allPassed && goodPythonRes.allPassed && goodJSRes.allPassed && customFnPythonRes.allPassed) {
      console.log('\n🎉 COMPILER VERIFICATION TEST PASSED WITH 100% ACCURACY!');
    } else {
      console.log('\n❌ COMPILER VERIFICATION TEST FAILED');
    }

  } catch (err) {
    console.error('Compiler test error:', err);
  }
}

testCompiler();
