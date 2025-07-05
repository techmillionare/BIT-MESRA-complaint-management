import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import axios from 'axios';
import { toast } from 'react-toastify';
import api from '../utils/api';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalComplaints: 0,
    pendingComplaints: 0,
    resolvedComplaints: 0,
    totalFeedback: 0,
    averageRating: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
  try {
    const [complaintsRes, feedbackRes] = await Promise.all([
      api.get('/complaints/admin/all'), // ✅ use your configured api instance
      api.get('/feedback')              // ✅ includes Authorization header
    ]);

    const totalComplaints = complaintsRes.data.count;
    const pendingComplaints = complaintsRes.data.data.filter(
      c => c.status === 'Pending'
    ).length;
    const resolvedComplaints = complaintsRes.data.data.filter(
      c => c.status === 'Resolved'
    ).length;

    const totalFeedback = feedbackRes.data.count;
    const averageRating = feedbackRes.data.count > 0
      ? feedbackRes.data.data.reduce((sum, f) => sum + f.rating, 0) / feedbackRes.data.count
      : 0;

    setStats({
      totalComplaints,
      pendingComplaints,
      resolvedComplaints,
      totalFeedback,
      averageRating: parseFloat(averageRating.toFixed(1))
    });
  } catch (error) {
    toast.error('Failed to fetch dashboard data');
    console.error("Dashboard fetch error:", error?.response?.data || error.message);
  } finally {
    setLoading(false);
  }
};

    
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Admin Dashboard | BIT Mesra Complaint System</title>
      </Helmet>
      
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-8">Admin Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-500">Total Complaints</h3>
            <p className="text-3xl font-bold text-gray-800 mt-2">{stats.totalComplaints}</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-500">Pending Complaints</h3>
            <p className="text-3xl font-bold text-yellow-600 mt-2">{stats.pendingComplaints}</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-500">Resolved Complaints</h3>
            <p className="text-3xl font-bold text-green-600 mt-2">{stats.resolvedComplaints}</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-500">Avg. Feedback Rating</h3>
            <p className="text-3xl font-bold text-blue-600 mt-2">
              {stats.averageRating}/5
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-800 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <a
                href="/view-complaints"
                className="block px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-md text-gray-700 transition"
              >
                View All Complaints
              </a>
              <a
                href="/view-complaints?hostelNo=1"
                className="block px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-md text-gray-700 transition"
              >
                View Hostel 1 Complaints
              </a>
              <a
                href="/view-complaints?type=College"
                className="block px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-md text-gray-700 transition"
              >
                View College Complaints
              </a>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-800 mb-4">Recent Feedback</h3>
            {stats.totalFeedback === 0 ? (
              <p className="text-gray-500">No feedback submitted yet</p>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="text-yellow-400 text-xl">★★★★★</div>
                  <div className="ml-3">
                    <p className="text-sm text-gray-600">"The complaint was resolved very quickly. Excellent service!"</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="text-yellow-400 text-xl">★★★☆☆</div>
                  <div className="ml-3">
                    <p className="text-sm text-gray-600">"It took some time but the issue was finally resolved."</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;