import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  CreditCard, BarChart3, Users, Mail, MessageCircle, 
  CheckCircle, X, Plus, Settings, Zap 
} from 'lucide-react';

interface Integration {
  id: string;
  name: string;
  category: 'payment' | 'analytics' | 'crm' | 'email' | 'chat';
  icon: React.ReactNode;
  description: string;
  connected: boolean;
  config?: any;
}

const availableIntegrations: Integration[] = [
  // Payment Gateways
  {
    id: 'stripe',
    name: 'Stripe',
    category: 'payment',
    icon: <CreditCard className="w-6 h-6" />,
    description: 'Accept payments online',
    connected: false,
  },
  {
    id: 'paypal',
    name: 'PayPal',
    category: 'payment',
    icon: <CreditCard className="w-6 h-6" />,
    description: 'PayPal payment processing',
    connected: false,
  },
  {
    id: 'yookassa',
    name: 'YooKassa',
    category: 'payment',
    icon: <CreditCard className="w-6 h-6" />,
    description: 'Russian payment gateway',
    connected: false,
  },
  // Analytics
  {
    id: 'google-analytics',
    name: 'Google Analytics',
    category: 'analytics',
    icon: <BarChart3 className="w-6 h-6" />,
    description: 'Track website traffic',
    connected: false,
  },
  {
    id: 'yandex-metrika',
    name: 'Yandex.Metrika',
    category: 'analytics',
    icon: <BarChart3 className="w-6 h-6" />,
    description: 'Russian analytics platform',
    connected: false,
  },
  {
    id: 'mixpanel',
    name: 'Mixpanel',
    category: 'analytics',
    icon: <BarChart3 className="w-6 h-6" />,
    description: 'Product analytics',
    connected: false,
  },
  // CRM
  {
    id: 'salesforce',
    name: 'Salesforce',
    category: 'crm',
    icon: <Users className="w-6 h-6" />,
    description: 'Customer relationship management',
    connected: false,
  },
  {
    id: 'hubspot',
    name: 'HubSpot',
    category: 'crm',
    icon: <Users className="w-6 h-6" />,
    description: 'Marketing and sales platform',
    connected: false,
  },
  {
    id: 'amocrm',
    name: 'amoCRM',
    category: 'crm',
    icon: <Users className="w-6 h-6" />,
    description: 'Russian CRM system',
    connected: false,
  },
  // Email Marketing
  {
    id: 'mailchimp',
    name: 'Mailchimp',
    category: 'email',
    icon: <Mail className="w-6 h-6" />,
    description: 'Email marketing platform',
    connected: false,
  },
  {
    id: 'sendgrid',
    name: 'SendGrid',
    category: 'email',
    icon: <Mail className="w-6 h-6" />,
    description: 'Transactional emails',
    connected: false,
  },
  {
    id: 'unisender',
    name: 'Unisender',
    category: 'email',
    icon: <Mail className="w-6 h-6" />,
    description: 'Russian email service',
    connected: false,
  },
  // Live Chat
  {
    id: 'intercom',
    name: 'Intercom',
    category: 'chat',
    icon: <MessageCircle className="w-6 h-6" />,
    description: 'Customer messaging platform',
    connected: false,
  },
  {
    id: 'drift',
    name: 'Drift',
    category: 'chat',
    icon: <MessageCircle className="w-6 h-6" />,
    description: 'Conversational marketing',
    connected: false,
  },
  {
    id: 'jivosite',
    name: 'JivoSite',
    category: 'chat',
    icon: <MessageCircle className="w-6 h-6" />,
    description: 'Russian live chat',
    connected: false,
  },
];

interface IntegrationManagerProps {
  projectId?: string;
  onIntegrationChange?: (integration: Integration) => void;
}

export const IntegrationManager: React.FC<IntegrationManagerProps> = ({
  projectId,
  onIntegrationChange,
}) => {
  const [integrations, setIntegrations] = useState<Integration[]>(availableIntegrations);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [configuring, setConfiguring] = useState<string | null>(null);
  const [config, setConfig] = useState<any>({});

  const categories = ['all', 'payment', 'analytics', 'crm', 'email', 'chat'];

  const filteredIntegrations = selectedCategory === 'all'
    ? integrations
    : integrations.filter(i => i.category === selectedCategory);

  const handleConnect = async (integration: Integration) => {
    if (integration.connected) {
      // Disconnect
      setIntegrations(prev => prev.map(i => 
        i.id === integration.id ? { ...i, connected: false, config: undefined } : i
      ));
      onIntegrationChange?.({ ...integration, connected: false, config: undefined });
    } else {
      // Show configuration
      setConfiguring(integration.id);
      setConfig({});
    }
  };

  const handleSaveConfig = (integrationId: string) => {
    setIntegrations(prev => prev.map(i => 
      i.id === integrationId ? { ...i, connected: true, config } : i
    ));
    const updated = integrations.find(i => i.id === integrationId);
    if (updated) {
      onIntegrationChange?.({ ...updated, connected: true, config });
    }
    setConfiguring(null);
    setConfig({});
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'payment': return 'from-green-50 to-emerald-50 border-green-100';
      case 'analytics': return 'from-blue-50 to-indigo-50 border-blue-100';
      case 'crm': return 'from-purple-50 to-pink-50 border-purple-100';
      case 'email': return 'from-orange-50 to-amber-50 border-orange-100';
      case 'chat': return 'from-cyan-50 to-teal-50 border-cyan-100';
      default: return 'from-slate-50 to-gray-50 border-slate-100';
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-slate-900">Integrations</h2>
          <p className="text-sm text-slate-500">Connect your favorite services</p>
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-xl font-bold transition-all ${
              selectedCategory === cat
                ? 'bg-indigo-600 text-white'
                : 'bg-white border-2 border-slate-200 text-slate-700 hover:border-indigo-300'
            }`}
          >
            {cat === 'all' ? 'All' : cat.charAt(0).toUpperCase() + cat.slice(1)}
          </button>
        ))}
      </div>

      {/* Integrations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredIntegrations.map((integration) => (
          <motion.div
            key={integration.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`bg-gradient-to-br ${getCategoryColor(integration.category)} rounded-2xl p-6 border-2 ${
              integration.connected ? 'ring-2 ring-indigo-500' : ''
            }`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  integration.connected ? 'bg-indigo-600 text-white' : 'bg-white text-slate-600'
                }`}>
                  {integration.icon}
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">{integration.name}</h3>
                  <p className="text-xs text-slate-600">{integration.description}</p>
                </div>
              </div>
              {integration.connected && (
                <CheckCircle className="w-6 h-6 text-indigo-600" />
              )}
            </div>

            {configuring === integration.id ? (
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">API Key</label>
                  <input
                    type="text"
                    value={config.apiKey || ''}
                    onChange={(e) => setConfig({ ...config, apiKey: e.target.value })}
                    placeholder="Enter API key"
                    className="w-full px-3 py-2 bg-white border-2 border-slate-200 rounded-xl text-sm focus:border-indigo-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">API Secret</label>
                  <input
                    type="password"
                    value={config.apiSecret || ''}
                    onChange={(e) => setConfig({ ...config, apiSecret: e.target.value })}
                    placeholder="Enter API secret"
                    className="w-full px-3 py-2 bg-white border-2 border-slate-200 rounded-xl text-sm focus:border-indigo-500 focus:outline-none"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleSaveConfig(integration.id)}
                    className="flex-1 py-2 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all text-sm"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => {
                      setConfiguring(null);
                      setConfig({});
                    }}
                    className="px-4 py-2 bg-white border-2 border-slate-200 rounded-xl font-bold hover:border-slate-300 transition-all text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => handleConnect(integration)}
                className={`w-full py-3 rounded-xl font-bold transition-all ${
                  integration.connected
                    ? 'bg-white border-2 border-indigo-300 text-indigo-600 hover:bg-indigo-50'
                    : 'bg-indigo-600 text-white hover:bg-indigo-700'
                } flex items-center justify-center gap-2`}
              >
                {integration.connected ? (
                  <>
                    <X className="w-4 h-4" />
                    Disconnect
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    Connect
                  </>
                )}
              </button>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
};
