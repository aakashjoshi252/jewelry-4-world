'use client';

import { useRouter } from 'next/navigation';
import { useQuery, useMutation } from '@apollo/client';
import { LOGOUT_MUTATION } from '../../../graphql/mutations';
import { ME_QUERY } from '../../../graphql/queries';
import { User } from 'lucide-react';

export default function ProfilePage() {
  const router = useRouter();
  const { data, loading, error } = useQuery(ME_QUERY);
  const [logout] = useMutation(LOGOUT_MUTATION);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <p className="text-gray-600 text-lg">Loading your profile...</p>
      </div>
    );
  }

  if (error || !data?.me) {
    router.push('/auth/login');
    return null;
  }

  const handleLogout = async () => {
    await logout();
    router.push('/auth/login');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md text-center transition-all duration-300">
        <div className="flex justify-center mb-4">
          <div className="bg-gray-200 p-4 rounded-full">
            <User className="w-10 h-10 text-gray-600" />
          </div>
        </div>

        <h1 className="text-3xl font-semibold text-gray-800 mb-2">Welcome, {data.me.username || 'User'}!</h1>
        <p className="text-gray-500 mb-4">Here are your profile details:</p>

        <div className="text-left space-y-2">
          <p className="text-gray-700">
            <span className="font-medium">Username:</span> {data.me.username}
          </p>
          <p className="text-gray-700">
            <span className="font-medium">Email:</span> {data.me.email}
          </p>
        </div>

        <button
          onClick={handleLogout}
          className="mt-6 w-full px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
