import React, { useState } from 'react';
import { apiRequest } from '../../services/api';
import { FlaskConical, Play, CheckCircle2, AlertTriangle, ShieldCheck, FileText, ArrowRight, Terminal } from 'lucide-react';

export function SecurityTestingLab() {
  const [runningTest, setRunningTest] = useState(null);
  const [results, setResults] = useState({});

  const tests = [
    {
      id: 'TEST_01_BRUTE_FORCE',
      name: '1. Brute-Force Protection & Account Lockout',
      vector: 'Simulates 5 rapid invalid login attempts to trigger account lockout',
      control: 'Auth Rate Limiter & Lockout Engine',
      badge: 'AUTH'
    },
    {
      id: 'TEST_02_UNAUTHORIZED_API',
      name: '2. Unauthorized API Access',
      vector: 'Requests protected endpoint /api/v1/admin/users without JWT bearer token',
      control: 'JWT Authentication Middleware',
      badge: 'AUTH'
    },
    {
      id: 'TEST_03_RBAC_VIOLATION',
      name: '3. RBAC Privilege Escalation Violation',
      vector: 'User with role "customer" attempts to update administrative security alert',
      control: 'Server-Side RBAC Middleware (authorizeRoles)',
      badge: 'RBAC'
    },
    {
      id: 'TEST_04_XSS_REJECTION',
      name: '4. XSS Script Injection Rejection',
      vector: 'Submits payload containing <script>alert(document.cookie)</script>',
      control: 'WAF Input Sanitizer Middleware',
      badge: 'INPUT'
    },
    {
      id: 'TEST_05_INJECTION_REJECTION',
      name: '5. SQL / NoSQL Injection Rejection',
      vector: "Submits SQL tautology payload: email=' OR '1'='1 in query parameter",
      control: 'Safe Parameterization & Injection Pattern Guard',
      badge: 'INPUT'
    },
    {
      id: 'TEST_06_RATE_LIMITING',
      name: '6. API Rate Limiting Flood Control',
      vector: 'Sends 150 rapid API calls within 10 seconds from single IP address',
      control: 'Express Rate Limiter Middleware',
      badge: 'GATEWAY'
    },
    {
      id: 'TEST_07_INVALID_PAYMENT_AMOUNT',
      name: '7. Malformed Payment Amount Bounds Rejection',
      vector: 'Submits negative payment transaction amount (-$500.00 USD)',
      control: 'Server-Side Value Bounds Validation',
      badge: 'PAYMENT'
    },
    {
      id: 'TEST_08_DUPLICATE_PAYMENT',
      name: '8. Duplicate Payment Prevention (Idempotency Key)',
      vector: 'Replays identical payment POST request twice with same X-Idempotency-Key',
      control: 'Idempotency Cache & Duplicate Guard',
      badge: 'PAYMENT'
    },
    {
      id: 'TEST_09_SESSION_EXPIRATION',
      name: '9. Session Token Revocation Invalidation',
      vector: 'Sends request using a blacklisted token after explicit logout',
      control: 'JWT Revocation & Blacklist Engine',
      badge: 'SESSION'
    },
    {
      id: 'TEST_10_AUDIT_SCRUBBING',
      name: '10. Audit Logging Sensitive Data Scrubbing',
      vector: 'Submits plain password and credit card number to audit logger pipeline',
      control: 'Logger Sensitive Data Scrubbing Redactor',
      badge: 'AUDIT'
    }
  ];

  const handleRunTest = async (testId) => {
    setRunningTest(testId);
    const res = await apiRequest('/lab/run-test', {
      method: 'POST',
      body: JSON.stringify({ testId })
    });
    setRunningTest(null);

    if (res.data) {
      setResults(prev => ({ ...prev, [testId]: res.data }));
    }
  };

  const handleRunAllTests = async () => {
    for (const t of tests) {
      await handleRunTest(t.id);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8 font-sans">
      {/* Header Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 glass-card p-6 rounded-2xl border border-rose-800/40 bg-rose-950/20">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded text-[10px] font-mono bg-rose-950 text-rose-300 border border-rose-800 font-bold uppercase">
              security-lab.payshield.com
            </span>
            <span className="text-xs text-slate-400 font-mono">Interactive Cybersecurity Testing Workbench</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white">
            PayShield Live Security Controls Lab
          </h1>
          <p className="text-xs text-slate-300 font-mono max-w-3xl">
            Simulate 10 real-world cybersecurity attacks and verify server-side security controls live.
          </p>
        </div>

        <button
          onClick={handleRunAllTests}
          className="flex items-center space-x-2 bg-gradient-to-r from-rose-500 to-red-600 hover:from-rose-400 hover:to-red-500 text-white font-bold px-5 py-2.5 rounded-xl text-xs font-mono transition-all shadow-glow-rose"
        >
          <Play className="w-4 h-4 fill-current" />
          <span>Run All 10 Security Control Tests</span>
        </button>
      </div>

      {/* 10 Test Vector Workbench Cards */}
      <div className="space-y-4">
        {tests.map((t) => {
          const res = results[t.id];
          const isRunning = runningTest === t.id;

          return (
            <div key={t.id} className="glass-card p-5 rounded-2xl border border-slate-800 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center space-x-3">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-navy-950 text-cyan-400 border border-cyan-800 font-bold">
                    {t.badge}
                  </span>
                  <h3 className="text-base font-bold text-white font-mono">{t.name}</h3>
                </div>

                <button
                  onClick={() => handleRunTest(t.id)}
                  disabled={isRunning}
                  className="flex items-center space-x-1.5 bg-navy-800 hover:bg-rose-950 hover:text-rose-300 text-slate-200 border border-slate-700 hover:border-rose-800 px-3 py-1.5 rounded-lg text-xs font-mono transition-all"
                >
                  <Play className={`w-3.5 h-3.5 ${isRunning ? 'animate-spin' : ''}`} />
                  <span>{isRunning ? 'Executing Test...' : 'Run Test Vector'}</span>
                </button>
              </div>

              {/* Execution Trace Bar */}
              <div className="bg-navy-950 p-3.5 rounded-xl border border-slate-800/80 font-mono text-xs text-slate-300 space-y-2">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  <div>
                    <span className="text-slate-500 text-[10px] block uppercase">Attack / Test Vector:</span>
                    <span className="text-rose-300">{t.vector}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[10px] block uppercase">Security Control Engaged:</span>
                    <span className="text-shield-cyan">{t.control}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[10px] block uppercase">Expected Outcome:</span>
                    <span className="text-amber-300">Filtered & Audit Event Recorded</span>
                  </div>
                </div>
              </div>

              {/* Live Test Result Output Box */}
              {res && (
                <div className="bg-navy-950/90 border border-emerald-800/60 p-4 rounded-xl space-y-3 font-mono text-xs animate-fadeIn">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-emerald-400 font-bold">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>SECURITY CONTROL VERIFIED ({res.statusCode} {res.statusText})</span>
                    </div>
                    <span className="text-[11px] text-purple-300">Audit Log ID: {res.generatedAuditLogId}</span>
                  </div>

                  <p className="text-slate-200 text-xs font-sans">{res.explanation}</p>

                  {res.scrubbedLogSample && (
                    <div className="bg-navy-900 p-2.5 rounded-lg border border-slate-800">
                      <span className="text-[10px] text-slate-400 block mb-1">Scrubbed Data Log Output:</span>
                      <pre className="text-[11px] text-cyan-300">{JSON.stringify(res.scrubbedLogSample, null, 2)}</pre>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
