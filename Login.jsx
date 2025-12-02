import React, { useState } from 'react';
import { supabase } from './supabaseClient';
import { Lock } from 'lucide-react';

export default function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

      if (error) throw error;
      onLogin(data.user); // Notify parent app of success
    } catch (err) {
      setError('Access Denied: Invalid Credentials');
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-slate-100">
      <form onSubmit={handleLogin} className="bg-white p-8 rounded-xl shadow-lg w-96">
        <div className="flex justify-center mb-6 text-blue-600">
          <Lock size={48} />
        </div>
        <h2 className="text-2xl font-bold text-center mb-6 text-slate-800">Admin Access</h2>
        {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}
        <input 
          type="email" 
          placeholder="Admin Email" 
          className="w-full p-3 mb-4 border border-slate-200 rounded-lg"
          onChange={(e) => setEmail(e.target.value)} 
        />
        <input 
          type="password" 
          placeholder="Password" 
          className="w-full p-3 mb-6 border border-slate-200 rounded-lg"
          onChange={(e) => setPassword(e.target.value)} 
        />
        <button className="w-full bg-blue-600 text-white p-3 rounded-lg font-bold hover:bg-blue-700">
          Sign In
        </button>
      </form>
    </div>
  );
}