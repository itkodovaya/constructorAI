import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { 
  Users, UserPlus, Shield, ShieldCheck, ShieldAlert,
  MoreVertical, Mail, Clock, Trash2, Edit2, Check, X,
  ExternalLink, Search, Filter, Lock, Unlock
} from 'lucide-react';
import { api } from '../services/api';

interface Collaborator {
  userId: string;
  name: string;
  email: string;
  role: 'owner' | 'admin' | 'editor' | 'commenter' | 'viewer';
  joinedAt: string;
}

interface RoleManagerProps {
  projectId: string;
  onClose: () => void;
}

export const RoleManager: React.FC<RoleManagerProps> = ({ projectId, onClose }) => {
  const { t } = useTranslation();
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
  const [loading, setLoading] = useState(true);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('editor');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchCollaborators();
  }, []);

  const fetchCollaborators = async () => {
    try {
      setLoading(true);
      // В реальности здесь был бы вызов api.getProjectCollaborators(projectId)
      // Для демо используем заглушку
      setTimeout(() => {
        setCollaborators([
          { userId: '1', name: 'Алексей Иванов', email: 'alex@example.com', role: 'owner', joinedAt: '2023-10-01' },
          { userId: '2', name: 'Мария Петрова', email: 'maria@example.com', role: 'admin', joinedAt: '2023-10-05' },
          { userId: '3', name: 'Джон Доу', email: 'john@example.com', role: 'editor', joinedAt: '2023-10-10' },
        ]);
        setLoading(false);
      }, 500);
    } catch (error) {
      console.error('Failed to fetch collaborators:', error);
    }
  };

  const handleInvite = async () => {
    if (!inviteEmail) return;
    try {
      // api.inviteCollaborator(projectId, inviteEmail, inviteRole)
      alert(`Приглашение отправлено на ${inviteEmail}`);
      setInviteEmail('');
    } catch (error) {
      console.error('Invite failed:', error);
    }
  };

  const updateRole = async (userId: string, newRole: any) => {
    try {
      // api.updateCollaboratorRole(projectId, userId, newRole)
      setCollaborators(prev => prev.map(c => c.userId === userId ? { ...c, role: newRole } : c));
    } catch (error) {
      console.error('Update role failed:', error);
    }
  };

  const removeCollaborator = async (userId: string) => {
    if (!confirm('Вы уверены, что хотите удалить этого участника?')) return;
    try {
      // api.removeCollaborator(projectId, userId)
      setCollaborators(prev => prev.filter(c => c.userId !== userId));
    } catch (error) {
      console.error('Remove collaborator failed:', error);
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'owner': return <ShieldCheck className="w-5 h-5 text-indigo-600" />;
      case 'admin': return <Shield className="w-5 h-5 text-blue-600" />;
      case 'editor': return <Edit2 className="w-5 h-5 text-emerald-600" />;
      case 'commenter': return <Clock className="w-5 h-5 text-amber-600" />;
      default: return <Users className="w-5 h-5 text-slate-400" />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="bg-white rounded-[32px] w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl"
      >
        {/* Header */}
        <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-200">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900">{t('roles.title', 'Участники и права')}</h2>
              <p className="text-slate-500 text-sm font-medium">{t('roles.subtitle', 'Управление доступом к вашему проекту')}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-3 hover:bg-slate-100 rounded-2xl transition-all">
            <X className="w-6 h-6 text-slate-400" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
          {/* Invite Section */}
          <div className="bg-indigo-50/50 rounded-3xl p-6 border border-indigo-100">
            <h3 className="text-sm font-black text-indigo-600 uppercase tracking-widest mb-4">{t('roles.invite', 'Пригласить участника')}</h3>
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-indigo-400" />
                <input
                  type="email"
                  placeholder="name@example.com"
                  className="w-full pl-12 pr-4 py-3 bg-white border-none rounded-2xl focus:ring-2 focus:ring-indigo-200 transition-all font-medium text-slate-900"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                />
              </div>
              <select
                className="bg-white border-none rounded-2xl px-4 py-3 font-bold text-slate-700 focus:ring-2 focus:ring-indigo-200 outline-none appearance-none"
                value={inviteRole}
                onChange={(e) => setInviteRole(e.target.value)}
              >
                <option value="admin">Администратор</option>
                <option value="editor">Редактор</option>
                <option value="commenter">Комментатор</option>
                <option value="viewer">Зритель</option>
              </select>
              <button
                onClick={handleInvite}
                disabled={!inviteEmail}
                className="bg-indigo-600 text-white px-8 py-3 rounded-2xl font-bold hover:bg-indigo-700 transition-all disabled:opacity-50 shadow-lg shadow-indigo-100"
              >
                {t('common.send', 'Отправить')}
              </button>
            </div>
          </div>

          {/* Collaborators List */}
          <div className="space-y-4">
            <div className="flex items-center justify-between px-2">
              <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest">{t('roles.list', 'Текущие участники')}</h3>
              <div className="flex items-center gap-2">
                <Search className="w-4 h-4 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Поиск..." 
                  className="bg-transparent border-none text-sm font-bold text-slate-600 focus:ring-0 w-32"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-3">
              <AnimatePresence>
                {collaborators.map((c) => (
                  <motion.div
                    key={c.userId}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="group flex items-center justify-between p-5 bg-white border border-slate-100 rounded-[24px] hover:border-indigo-100 transition-all"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center border border-slate-100">
                        <span className="text-lg font-black text-slate-400">{c.name[0]}</span>
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900">{c.name} {c.userId === '1' && <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full ml-2">ВЫ</span>}</h4>
                        <p className="text-xs text-slate-400 font-medium">{c.email}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-xl">
                        {getRoleIcon(c.role)}
                        <select
                          disabled={c.role === 'owner'}
                          className="bg-transparent border-none text-xs font-black text-slate-600 focus:ring-0 outline-none disabled:opacity-50"
                          value={c.role}
                          onChange={(e) => updateRole(c.userId, e.target.value)}
                        >
                          <option value="owner" disabled>Владелец</option>
                          <option value="admin">Админ</option>
                          <option value="editor">Редактор</option>
                          <option value="commenter">Комментатор</option>
                          <option value="viewer">Зритель</option>
                        </select>
                      </div>

                      {c.role !== 'owner' && (
                        <button 
                          onClick={() => removeCollaborator(c.userId)}
                          className="p-2 text-slate-300 hover:text-rose-500 transition-all opacity-0 group-hover:opacity-100"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>

          {/* Granular Permissions Info */}
          <div className="bg-slate-50 rounded-3xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <Lock className="w-5 h-5 text-slate-400" />
              <h4 className="font-bold text-slate-900 text-sm">О правах доступа</h4>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-xs space-y-2">
                <p className="text-slate-600"><strong>Админ:</strong> Может всё, кроме удаления владельца и самого проекта.</p>
                <p className="text-slate-600"><strong>Редактор:</strong> Может изменять контент, дизайн и ассеты.</p>
              </div>
              <div className="text-xs space-y-2">
                <p className="text-slate-600"><strong>Комментатор:</strong> Может смотреть и оставлять заметки.</p>
                <p className="text-slate-600"><strong>Зритель:</strong> Только просмотр без возможности изменений.</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

