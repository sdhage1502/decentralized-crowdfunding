'use client';
import { useEffect, useState } from 'react';
import { auth } from '../../firebase/config';
import {
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from 'firebase/auth';
import AdminCampaignManager from '../admin/AdminCampaignManager';
import toast from 'react-hot-toast';
import { Shield, Lock, Loader2, LogOut } from 'lucide-react';

const AdminPage = () => {
  const [user, setUser] = useState(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authChecked, setAuthChecked] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL;

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser && firebaseUser.email === ADMIN_EMAIL) {
        setUser(firebaseUser);
      } else {
        setShowLoginModal(true);
      }
      setAuthChecked(true);
    });

    return () => unsubscribe();
  }, [ADMIN_EMAIL]);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Email and password are required');
      return;
    }
    setIsLoggingIn(true);
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      if (result.user.email === ADMIN_EMAIL) {
        setUser(result.user);
        setShowLoginModal(false);
        toast.success('Login successful');
      } else {
        await signOut(auth);
        toast.error('Unauthorized email');
      }
    } catch (error) {
      console.error(error);
      toast.error('Login failed. Check credentials.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    setUser(null);
    setShowLoginModal(true);
    toast.success('Logged out successfully');
  };

  if (!authChecked) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-transparent">
        <div className="flex flex-col items-center space-y-3">
          <Loader2 className="w-8 h-8 text-accent animate-spin" />
          <p className="text-ink-2 text-xs font-semibold">Verifying session...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 min-h-screen bg-transparent">
      {showLoginModal && (
        <div className="fixed inset-0 bg-ink/20 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-paper-2-glass backdrop-blur border border-rule-strong p-8 rounded-2xl w-full max-w-sm shadow-xl space-y-6 animate-fadeIn">
            <div className="text-center space-y-2">
              <div className="mx-auto w-12 h-12 bg-accent-bg border border-rule-strong rounded-xl flex items-center justify-center text-accent shadow-sm">
                <Shield size={24} aria-hidden="true" />
              </div>
              <h2 className="text-xl font-extrabold text-ink tracking-tight">Admin Gate</h2>
              <p className="text-xs text-ink-2">Access restricted to authorized administrators</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label htmlFor="admin-email" className="block text-xs font-semibold text-ink-2 mb-1">Email</label>
                <input
                  id="admin-email"
                  type="email"
                  placeholder="admin@domain.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-2.5 bg-paper-glass backdrop-blur-md border border-rule-strong rounded-lg text-sm text-ink focus:outline-none focus:ring-1 focus:ring-accent"
                  required
                  aria-required="true"
                />
              </div>

              <div>
                <label htmlFor="admin-password" className="block text-xs font-semibold text-ink-2 mb-1">Password</label>
                <input
                  id="admin-password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-2.5 bg-paper-glass backdrop-blur-md border border-rule-strong rounded-lg text-sm text-ink focus:outline-none focus:ring-1 focus:ring-accent"
                  required
                  aria-required="true"
                />
              </div>

              <button
                type="submit"
                disabled={isLoggingIn}
                className="w-full bg-accent hover:bg-accent-hover text-white py-2.5 rounded-lg transition-colors text-sm font-semibold flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
              >
                {isLoggingIn ? (
                  <>
                    <Loader2 size={16} className="animate-spin" aria-hidden="true" />
                    Authenticating...
                  </>
                ) : (
                  <>
                    <Lock size={14} aria-hidden="true" />
                    Unlock Dashboard
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}

      {user && (
        <div className="space-y-6">
          <div className="flex justify-between items-center bg-paper-2-glass backdrop-blur border border-rule rounded-xl p-4 shadow-sm max-w-7xl mx-auto">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-accent-bg border border-rule-strong rounded-lg flex items-center justify-center text-accent">
                <Shield size={18} aria-hidden="true" />
              </div>
              <div>
                <p className="text-xs text-ink-2 font-semibold uppercase">Admin Active Session</p>
                <p className="text-sm font-bold text-ink leading-none mt-1">{user?.email}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs border border-red-200 bg-error-bg hover:bg-red-100 text-red-600 font-semibold rounded-lg transition-all"
            >
              <LogOut size={12} aria-hidden="true" />
              Log Out
            </button>
          </div>
          <AdminCampaignManager />
        </div>
      )}
    </div>
  );
};

export default AdminPage;
