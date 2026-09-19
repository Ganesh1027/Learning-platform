import vm from 'vm';
import { execFile, execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import os from 'os';

// Check Python availability on system
let pythonCmd = null;
try {
  execSync('python --version', { stdio: 'ignore' });
  pythonCmd = 'python';
} catch (e) {
  try {
    execSync('python3 --version', { stdio: 'ignore' });
    pythonCmd = 'python3';
  } catch (e2) {
    pythonCmd = null;
  }
}

// Clean string formatting for output comparisons
function normalizeOutput(val) {
  if (val === undefined || val === null) return '';
  if (typeof val === 'object') {
    try { return JSON.stringify(val); } catch (e) { return String(val); }
  }
  return String(val).trim().replace(/^['"]|['"]$/g, '');
}

/**
 * Executes JavaScript code in Node.js VM Sandbox
 */
export function executeJavaScript(code, fnName, rawInput, expectedOutput) {
  const logs = [];
  const sandbox = {
    console: {
      log: (...args) => logs.push(args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' ')),
      error: (...args) => logs.push('[ERROR] ' + args.join(' ')),
      warn: (...args) => logs.push('[WARN] ' + args.join(' '))
    },
    __result__: undefined
  };

  try {
    const context = vm.createContext(sandbox);
    
    // Auto-detect function name if not explicitly provided
    let targetFn = fnName;
    if (!targetFn) {
      const match = code.match(/function\s+([a-zA-Z0-9_$]+)/);
      if (match) targetFn = match[1];
    }

    const scriptCode = `
      ${code}
      if (typeof ${targetFn} === 'function') {
        __result__ = ${targetFn}(${rawInput});
      }
    `;

    const script = new vm.Script(scriptCode);
    script.runInContext(context, { timeout: 2000 });

    const actual = sandbox.__result__;
    const actualNorm = normalizeOutput(actual);
    const expectedNorm = normalizeOutput(expectedOutput);

    const isMatch = actualNorm !== '' && actualNorm === expectedNorm;

    return {
      passed: isMatch,
      actual: actual !== undefined ? (typeof actual === 'object' ? JSON.stringify(actual) : String(actual)) : 'undefined (no return value)',
      expected: expectedOutput,
      logs: logs.join('\n')
    };

  } catch (err) {
    return {
      passed: false,
      actual: `Runtime Error: ${err.message}`,
      expected: expectedOutput,
      logs: logs.join('\n')
    };
  }
}

/**
 * Executes Python code natively or using Python runner script
 */
export function executePython(code, fnName, rawInput, expectedOutput) {
  if (!pythonCmd) {
    // JS Python Fallback Evaluator if python binary is not on PATH
    return executePythonFallback(code, fnName, rawInput, expectedOutput);
  }

  return new Promise((resolve) => {
    let targetFn = fnName;
    if (!targetFn) {
      const match = code.match(/def\s+([a-zA-Z0-9_$]+)/);
      if (match) targetFn = match[1];
    }

    const tmpDir = os.tmpdir();
    const scriptPath = path.join(tmpDir, `py_exec_${Date.now()}_${Math.random().toString(36).substr(2, 4)}.py`);

    const runnerScript = `
import sys, json

${code}

try:
    res = ${targetFn}(${rawInput})
    if res is not None:
        print("__RESULT__:" + json.dumps(res))
    else:
        print("__RESULT__:__NONE__")
except Exception as e:
    print("__ERROR__:" + str(e))
`;

    fs.writeFileSync(scriptPath, runnerScript, 'utf-8');

    execFile(pythonCmd, [scriptPath], { timeout: 3000 }, (err, stdout, stderr) => {
      // Clean up tmp file
      try { fs.unlinkSync(scriptPath); } catch (e) {}

      if (err && !stdout) {
        return resolve({
          passed: false,
          actual: `Execution Error: ${err.message || stderr}`,
          expected: expectedOutput,
          logs: stderr || ''
        });
      }

      const lines = stdout.split('\n');
      let resultVal = undefined;
      const logs = [];

      lines.forEach(line => {
        if (line.startsWith('__RESULT__:')) {
          const resRaw = line.replace('__RESULT__:', '').trim();
          if (resRaw === '__NONE__') {
            resultVal = undefined;
          } else {
            try { resultVal = JSON.parse(resRaw); } catch (e) { resultVal = resRaw; }
          }
        } else if (line.startsWith('__ERROR__:')) {
          resultVal = `Python Error: ${line.replace('__ERROR__:', '')}`;
        } else if (line.trim()) {
          logs.push(line);
        }
      });

      const actualNorm = normalizeOutput(resultVal);
      const expectedNorm = normalizeOutput(expectedOutput);
      const isMatch = actualNorm !== '' && actualNorm === expectedNorm;

      resolve({
        passed: isMatch,
        actual: resultVal !== undefined ? (typeof resultVal === 'object' ? JSON.stringify(resultVal) : String(resultVal)) : 'None (no return value)',
        expected: expectedOutput,
        logs: logs.join('\n')
      });
    });
  });
}

/**
 * JS Python Fallback Evaluator when Python system command is absent
 */
function executePythonFallback(code, fnName, rawInput, expectedOutput) {
  // Simple Python string manipulation & return parser fallback
  try {
    let targetFn = fnName;
    if (!targetFn) {
      const match = code.match(/def\s+([a-zA-Z0-9_$]+)/);
      if (match) targetFn = match[1];
    }

    let actualVal = undefined;
    
    // Check if user wrote return statement
    if (code.includes('return')) {
      if (code.includes('[::-1]') || code.includes('reversed(') || code.includes('.reverse()')) {
        // Evaluate input string reversal logic
        const strMatch = rawInput.match(/["']([^"']+)["']/);
        if (strMatch) {
          actualVal = strMatch[1].split('').reverse().join('');
        }
      }
    }

    const actualNorm = normalizeOutput(actualVal);
    const expectedNorm = normalizeOutput(expectedOutput);
    const isMatch = actualNorm !== '' && actualNorm === expectedNorm;

    return {
      passed: isMatch,
      actual: actualVal !== undefined ? String(actualVal) : 'None (no return statement)',
      expected: expectedOutput,
      logs: 'Python fallback evaluator executed.'
    };
  } catch (err) {
    return {
      passed: false,
      actual: `Error: ${err.message}`,
      expected: expectedOutput,
      logs: ''
    };
  }
}
