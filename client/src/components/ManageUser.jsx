
import React, { useEffect, useState } from 'react';
import { apiUrl } from '../contant';
import { useAdmin } from '../contexts/AdminContext.jsx';

const ManageUser = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(false);
  const { isAdmin } = useAdmin();

  const adminHeaders = () => {
    const token = localStorage.getItem('adminToken');
    return token ? { 'x-admin-token': token } : {};
  };

  const fetchPartners = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${apiUrl}/auth/partners`, { headers: { ...adminHeaders() } });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to load partners');
      setPartners(data.partners || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) fetchPartners();
  }, [isAdmin]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    // Validate matching passwords
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    // Validate gmail and extract username/email
    const lowercaseInput = (formData.username || '').trim().toLowerCase();
    const gmailRegex = /^[a-zA-Z0-9_.+-]+@gmail\.com$/;
    if (!gmailRegex.test(lowercaseInput)) {
      setError('Username must be a valid @gmail.com address');
      return;
    }

    const namePart = lowercaseInput.split('@')[0];
    const email = lowercaseInput;

    try {
      const response = await fetch(`${apiUrl}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: namePart,
          email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('User created successfully!');
        setFormData({
          username: '',
          password: '',
          confirmPassword: '',
        });
        fetchPartners();
      } else {
        setError(data.message || 'Something went wrong');
      }
    } catch (err) {
      setError('Failed to connect to the server');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="w-full max-w-5xl mx-auto p-8 space-y-6 bg-white rounded-lg shadow-md mt-8">
        <h2 className="text-3xl font-bold text-gray-800">Manage User</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700"
            >
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 mt-1 text-gray-800 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 mt-1 text-gray-800 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-700"
            >
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 mt-1 text-gray-800 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          {message && <p className="text-sm text-green-600">{message}</p>}
          <div>
            <button
              type="submit"
              className="w-full px-4 py-2 font-semibold text-white bg-teal-500 rounded-md hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
            >
              Create User
            </button>
          </div>
        </form>

        <div className="mt-10">
          <h3 className="text-2xl font-semibold text-gray-800 mb-4">
            Existing Partners ({partners.length})
          </h3>
          {loading ? (
            <p>Loading...</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {partners.map((p) => (
                <div key={p._id} className="border rounded-lg p-4 shadow-sm bg-gray-50">
                  <h4 className="text-xl font-semibold text-gray-900">{p.username}</h4>
                  <p className="text-gray-700">{p.email}</p>
                  <p className="text-gray-700 mt-1">Password: ********</p>
                  <div className="flex gap-3 mt-4">
                    <button
                      onClick={async () => {
                        const newUsername = prompt('Edit username', p.username);
                        if (!newUsername) return;
                        try {
                          const res = await fetch(`${apiUrl}/auth/partners/${p._id}`, {
                            method: 'PUT',
                            headers: { 'Content-Type': 'application/json', ...adminHeaders() },
                            body: JSON.stringify({ username: newUsername })
                          });
                          const data = await res.json();
                          if (!res.ok) throw new Error(data.message || 'Update failed');
                          fetchPartners();
                        } catch (e) {
                          setError(e.message);
                        }
                      }}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md"
                    >
                      Edit
                    </button>
                    <button
                      onClick={async () => {
                        const newPassword = prompt('Enter new password for this partner');
                        if (!newPassword) return;
                        try {
                          const res = await fetch(`${apiUrl}/auth/partners/${p._id}`, {
                            method: 'PUT',
                            headers: { 'Content-Type': 'application/json', ...adminHeaders() },
                            body: JSON.stringify({ password: newPassword })
                          });
                          const data = await res.json();
                          if (!res.ok) throw new Error(data.message || 'Password update failed');
                          setMessage('Password updated');
                        } catch (e) {
                          setError(e.message);
                        }
                      }}
                      className="px-4 py-2 bg-amber-600 text-white rounded-md"
                    >
                      Change Password
                    </button>
                    <button
                      onClick={async () => {
                        if (!confirm('Delete this partner?')) return;
                        try {
                          const res = await fetch(`${apiUrl}/auth/partners/${p._id}`, {
                            method: 'DELETE',
                            headers: { ...adminHeaders() }
                          });
                          const data = await res.json();
                          if (!res.ok) throw new Error(data.message || 'Delete failed');
                          fetchPartners();
                        } catch (e) {
                          setError(e.message);
                        }
                      }}
                      className="px-4 py-2 bg-red-600 text-white rounded-md"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageUser;
