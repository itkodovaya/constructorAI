import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, Users, Eye, MousePointerClick, Clock, Globe, Download } from 'lucide-react';
import { Heatmap } from './Analytics/Heatmap';
import { SessionRecording } from './Analytics/SessionRecording';
import { FunnelAnalysis } from './Analytics/FunnelAnalysis';
import { CohortAnalysis } from './Analytics/CohortAnalysis';

interface AnalyticsData {
  visitors: {
    total: number;
    unique: number;
    returning: number;
  };
  pageViews: number;
  averageSessionDuration: number;
  bounceRate: number;
  topPages: Array<{ path: string; views: number }>;
  referrers: Array<{ source: string; visits: number }>;
  devices: {
    desktop: number;
    mobile: number;
    tablet: number;
  };
  countries: Array<{ country: string; visits: number }>;
}

interface SiteAnalyticsProps {
  projectId?: string;
  startDate?: Date;
  endDate?: Date;
}

export const SiteAnalytics: React.FC<SiteAnalyticsProps> = ({
  projectId,
  startDate,
  endDate,
}) => {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | 'all'>('30d');

  useEffect(() => {
    loadAnalytics();
  }, [projectId, timeRange]);

  const loadAnalytics = async () => {
    setLoading(true);
    try {
      // Mock data for now - replace with actual API call
      const mockData: AnalyticsData = {
        visitors: {
          total: 12543,
          unique: 8921,
          returning: 3622,
        },
        pageViews: 45678,
        averageSessionDuration: 245, // seconds
        bounceRate: 42.5,
        topPages: [
          { path: '/', views: 12345 },
          { path: '/about', views: 5678 },
          { path: '/products', views: 4321 },
          { path: '/contact', views: 2345 },
        ],
        referrers: [
          { source: 'Google', visits: 5432 },
          { source: 'Direct', visits: 4321 },
          { source: 'Social Media', visits: 2345 },
        ],
        devices: {
          desktop: 6543,
          mobile: 4321,
          tablet: 1679,
        },
        countries: [
          { country: 'United States', visits: 5432 },
          { country: 'Russia', visits: 4321 },
          { country: 'Germany', visits: 2345 },
        ],
      };
      setAnalytics(mockData);
    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !analytics) {
    return (
      <div className="p-6 flex items-center justify-center h-64">
        <div className="text-slate-500">Loading analytics...</div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
            <BarChart3 className="w-6 h-6 text-indigo-600" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-900">Site Analytics</h2>
            <p className="text-sm text-slate-500">Track your website performance</p>
          </div>
        </div>
        <div className="flex gap-2">
          {(['7d', '30d', '90d', 'all'] as const).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-4 py-2 rounded-xl font-bold transition-all ${
                timeRange === range
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white border-2 border-slate-200 text-slate-700 hover:border-indigo-300'
              }`}
            >
              {range === 'all' ? 'All Time' : range}
            </button>
          ))}
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-6 border-2 border-slate-100"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <TrendingUp className="w-5 h-5 text-green-500" />
          </div>
          <div className="text-3xl font-black text-slate-900 mb-1">
            {analytics.visitors.total.toLocaleString()}
          </div>
          <div className="text-sm text-slate-500">Total Visitors</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl p-6 border-2 border-slate-100"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <Eye className="w-6 h-6 text-purple-600" />
            </div>
            <TrendingUp className="w-5 h-5 text-green-500" />
          </div>
          <div className="text-3xl font-black text-slate-900 mb-1">
            {analytics.pageViews.toLocaleString()}
          </div>
          <div className="text-sm text-slate-500">Page Views</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl p-6 border-2 border-slate-100"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <Clock className="w-6 h-6 text-green-600" />
            </div>
            <TrendingUp className="w-5 h-5 text-green-500" />
          </div>
          <div className="text-3xl font-black text-slate-900 mb-1">
            {Math.floor(analytics.averageSessionDuration / 60)}m
          </div>
          <div className="text-sm text-slate-500">Avg. Session</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl p-6 border-2 border-slate-100"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
              <MousePointerClick className="w-6 h-6 text-red-600" />
            </div>
            <TrendingUp className="w-5 h-5 text-red-500 rotate-180" />
          </div>
          <div className="text-3xl font-black text-slate-900 mb-1">
            {analytics.bounceRate.toFixed(1)}%
          </div>
          <div className="text-sm text-slate-500">Bounce Rate</div>
        </motion.div>
      </div>

      {/* Top Pages */}
      <div className="bg-white rounded-2xl p-6 border-2 border-slate-100">
        <h3 className="text-lg font-bold text-slate-900 mb-4">Top Pages</h3>
        <div className="space-y-3">
          {analytics.topPages.map((page, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center text-indigo-600 font-bold text-sm">
                  {index + 1}
                </div>
                <span className="font-semibold text-slate-900">{page.path}</span>
              </div>
              <span className="font-bold text-slate-600">{page.views.toLocaleString()} views</span>
            </div>
          ))}
        </div>
      </div>

      {/* Devices & Countries */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 border-2 border-slate-100">
          <h3 className="text-lg font-bold text-slate-900 mb-4">Devices</h3>
          <div className="space-y-3">
            {Object.entries(analytics.devices).map(([device, count]) => (
              <div key={device} className="flex items-center justify-between">
                <span className="font-semibold text-slate-700 capitalize">{device}</span>
                <div className="flex items-center gap-3">
                  <div className="w-32 h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-indigo-600 rounded-full"
                      style={{
                        width: `${(count / analytics.visitors.total) * 100}%`,
                      }}
                    />
                  </div>
                  <span className="font-bold text-slate-900 w-16 text-right">
                    {count.toLocaleString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border-2 border-slate-100">
          <h3 className="text-lg font-bold text-slate-900 mb-4">Top Countries</h3>
          <div className="space-y-3">
            {analytics.countries.map((country, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <Globe className="w-5 h-5 text-slate-400" />
                  <span className="font-semibold text-slate-900">{country.country}</span>
                </div>
                <span className="font-bold text-slate-600">{country.visits.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

