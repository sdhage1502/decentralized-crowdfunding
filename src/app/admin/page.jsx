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

const AdminPage = () => {
  const [user, setUser] = useState(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authChecked, setAuthChecked] = useState(false);
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
  }, []);

  const handleLogin = async () => {
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
      toast.error('Login failed');
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    setUser(null);
    setShowLoginModal(true);
  };

  if (!authChecked) {
    return <p className="text-center mt-10">Checking authentication...</p>;
  }

  return (
    <div className="p-6 min-h-screen  bg-white bg-[linear-gradient(to_right,#80808033_1px,transparent_1px),linear-gradient(to_bottom,#80808033_1px,transparent_1px)] bg-[size:70px_70px]">
      {showLoginModal && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-md">
            <h2 className="text-xl font-bold mb-4 text-blue-600 text-center">Admin Login</h2>
            <input
              type="email"
              placeholder="Admin email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border p-2 rounded mb-3"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border p-2 rounded mb-4"
            />
            <button
              onClick={handleLogin}
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
            >
              Login
            </button>
          </div>
        </div>
      )}

      {user && (
        <>
          <button
            onClick={handleLogout}
            className="mb-4 text-sm text-red-600 underline float-right"
          >
            Logout
          </button>
          <AdminCampaignManager />
        </>
      )}
    </div>
  );
};

export default AdminPage;
