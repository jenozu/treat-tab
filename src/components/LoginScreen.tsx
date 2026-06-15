import { useState, FormEvent } from 'react';
import { Store, Lock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function LoginScreen() {
  const { signIn, signUp } = useAuth();
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!email.trim() || !password) {
      setError('Please enter your email and password.');
      return;
    }
    setLoading(true);
    setError('');
    setSuccess('');

    const err = mode === 'signin'
      ? await signIn(email.trim(), password)
      : await signUp(email.trim(), password);

    setLoading(false);
    if (err) {
      setError(err);
    } else if (mode === 'signup') {
      setSuccess('Account created! Check your email to confirm, then sign in.');
      setMode('signin');
      setPassword('');
    }
  }

  function switchMode() {
    setMode(m => m === 'signin' ? 'signup' : 'signin');
    setError('');
    setSuccess('');
  }

  return (
    <div className="h-dvh bg-[#FFD8E8] flex items-center justify-center font-sans antialiased p-4">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center mb-8 select-none">
          <div className="p-3 bg-black border-4 border-black rounded-2xl shadow-[4px_4px_0px_#000000] mb-3">
            <Store className="w-8 h-8 text-[#9BE9FB]" />
          </div>
          <h1 className="font-black text-2xl tracking-tight text-black">Treat Tab</h1>
          <p className="text-xs font-bold text-black/50 uppercase tracking-wider mt-1">Mobile Register</p>
        </div>

        <div className="bg-white rounded-3xl border-4 border-black shadow-[6px_6px_0px_#000000] overflow-hidden">
          <div className="p-4 bg-black flex items-center gap-2">
            <Lock className="w-4 h-4 text-[#9BE9FB]" />
            <h2 className="font-extrabold text-sm text-white">
              {mode === 'signin' ? 'Sign In to Your Register' : 'Create Your Account'}
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="p-5 space-y-4">
            {error && (
              <div className="bg-rose-50 border-2 border-rose-300 text-rose-700 text-xs font-black px-3 py-2.5 rounded-xl">
                {error}
              </div>
            )}
            {success && (
              <div className="bg-[#9BE9FB] border-2 border-black text-black text-xs font-black px-3 py-2.5 rounded-xl">
                {success}
              </div>
            )}

            <div className="space-y-1">
              <label className="text-[11px] font-black uppercase text-black pl-1">Email Address</label>
              <input
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                className="w-full bg-white border-2 border-black rounded-lg px-3 py-3 text-xs focus:ring-1 focus:ring-black font-semibold shadow-[2.5px_2.5px_0px_#000000]"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-black uppercase text-black pl-1">Password</label>
              <input
                type="password"
                autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
                placeholder="••••••••"
                className="w-full bg-white border-2 border-black rounded-lg px-3 py-3 text-xs focus:ring-1 focus:ring-black font-semibold shadow-[2.5px_2.5px_0px_#000000]"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white hover:bg-[#9BE9FB] hover:text-black py-3.5 rounded-xl font-black text-sm border-2 border-black shadow-[3px_3px_0px_#000000] hover:shadow-[1px_1px_0px_#000000] duration-150 transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? 'Please wait...' : mode === 'signin' ? 'Sign In' : 'Create Account'}
            </button>

            <button
              type="button"
              onClick={switchMode}
              className="w-full text-center text-[11px] font-black text-black/50 hover:text-black underline cursor-pointer transition-colors"
            >
              {mode === 'signin' ? "No account yet? Create one" : 'Already have an account? Sign in'}
            </button>
          </form>
        </div>

        <p className="text-center text-[10px] font-semibold text-black/35 mt-5 select-none">
          Treat Tab is a private register — authorized users only.
        </p>
      </div>
    </div>
  );
}
