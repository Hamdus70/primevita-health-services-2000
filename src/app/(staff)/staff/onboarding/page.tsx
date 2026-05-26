
'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function NurseOnboardingPage() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    age: '',
    phone: '',
    department: '',
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const calculateProgress = () => {
      const fields = [formData.fullName, formData.email, formData.age, formData.phone, formData.department];
      const filled = fields.filter(f => f !== '').length;
      return Math.round((filled / fields.length) * 100);
  };
  
  const progress = calculateProgress();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/staff/onboarding', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        router.push('/staff/dashboard');
      } else {
        const errorData = await response.json();
        alert(errorData.error || 'Registration failed');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-4">Complete Your Profile</h1>
      <div className="mb-4">
          <p>Profile {progress}% complete</p>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div className="bg-[#10837f] h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
          </div>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input className="w-full p-2 border rounded" required placeholder="Full Name" onChange={(e) => setFormData({...formData, fullName: e.target.value})} />
        <input className="w-full p-2 border rounded" required type="email" placeholder="Email" onChange={(e) => setFormData({...formData, email: e.target.value})} />
        <input className="w-full p-2 border rounded" required type="number" placeholder="Age" onChange={(e) => setFormData({...formData, age: e.target.value})} />
        <input className="w-full p-2 border rounded" type="tel" placeholder="Phone Number" onChange={(e) => setFormData({...formData, phone: e.target.value})} />
        <input className="w-full p-2 border rounded" placeholder="Department" onChange={(e) => setFormData({...formData, department: e.target.value})} />
        <button type="submit" disabled={loading} className="w-full p-2 bg-[#10837f] text-white rounded">
          {loading ? 'Saving...' : 'Complete Profile'}
        </button>
      </form>
    </div>
  );
}
