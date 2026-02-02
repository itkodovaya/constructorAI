import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Mail, Shield, ShieldCheck, ShieldAlert, Plus, MoreHorizontal, UserPlus, X, Check, Clock } from 'lucide-react';
import { api } from '../services/api';
import { LoadingState } from './LoadingState';
import { EmptyState } from './EmptyState';

interface Collaborator {
  userId: string;
  email: string;
  name: string;
  role: 'owner' | 'editor' | 'viewer';
  invitedAt: Date;
  joinedAt?: Date;
}

interface Invitation {
  id: string;
  email: string;
  role: 'owner' | 'editor' | 'viewer';
  createdAt: Date;
  expiresAt: Date;
  accepted: boolean;
}

interface TeamManagementProps {
  projectId: string;
  currentUserRole?: 'owner' | 'editor' | 'viewer';
}

export const TeamManagement: React.FC<TeamManagementProps> = ({ projectId, currentUserRole = 'owner' }) => {
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<'editor' | 'viewer'>('editor');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadCollaborators();
    loadInvitations();
  }, [projectId]);

  const loadCollaborators = async () => {
    try {
      const response = await api.getCollaborators(projectId);
      setCollaborators(response.collaborators || []);
    } catch (error) {
      console.error('Failed to load collaborators:', error);
    }
  };

  const loadInvitations = async () => {
    try {
      // В реальности здесь был бы отдельный эндпоинт для получения приглашений
      // Пока используем заглушку
      setInvitations([]);
    } catch (error) {
      console.error('Failed to load invitations:', error);
    }
  };

  const handleInvite = async () => {
    if (!inviteEmail || !inviteEmail.includes('@')) {
      alert('Введите корректный email');
      return;
    }

    setLoading(true);
    try {
      await api.inviteCollaborator(projectId, inviteEmail, inviteRole);
      setShowInviteModal(false);
      setInviteEmail('');
      setInviteRole('editor');
      loadInvitations();
      alert('Приглашение отправлено!');
    } catch (error: any) {
      alert(error.response?.data?.error || 'Ошибка при отправке приглашения');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveCollaborator = async (userId: string) => {
    if (!confirm('Вы уверены, что хотите удалить этого участника?')) return;

    try {
      await api.removeCollaborator(projectId, userId);
      loadCollaborators();
    } catch (error: any) {
      alert(error.response?.data?.error || 'Ошибка при удалении участника');
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'owner':
        return <ShieldCheck className="w-4 h-4 text-indigo-600" />;
      case 'editor':
        return <Shield className="w-4 h-4 text-blue-500" />;
      default:
        return <ShieldAlert className="w-4 h-4 text-slate-300" />;
    }
  };

  const getRoleName = (role: string) => {
    switch (role) {
      case 'owner':
        return 'Владелец';
      case 'editor':
        return 'Редактор';
      default:
        return 'Зритель';
    }
  };

  const canInvite = currentUserRole === 'owner';
  const canRemove = currentUserRole === 'owner';

  if (loading) {
    return <LoadingState message="Загрузка участников команды..." />;
  }

  return (
    <div className="space-y-4 sm:space-y-6 lg:space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Участники команды</h2>
          <p className="text-sm sm:text-base text-slate-500 font-medium">Управляйте доступом и ролями ваших коллег</p>
        </div>
        {canInvite && (
          <button
            onClick={() => setShowInviteModal(true)}
            className="px-4 sm:px-6 py-2.5 sm:py-3 bg-slate-900 text-white rounded-xl sm:rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-slate-800 transition-all shadow-xl shadow-slate-200"
          >
            <UserPlus className="w-4 h-4 sm:w-5 sm:h-5" /> Пригласить
          </button>
        )}
      </div>

      {/* Активные участники */}
      <div className="bg-white rounded-[24px] sm:rounded-[32px] lg:rounded-[40px] border border-slate-100 shadow-sm overflow-hidden">
        <div className="px-4 sm:px-6 lg:px-10 py-4 sm:py-6 bg-slate-50/50 border-b border-slate-50">
          <h3 className="text-[10px] sm:text-xs font-black text-slate-400 uppercase tracking-widest">Активные участники</h3>
        </div>
        <div className="divide-y divide-slate-50">
          {collaborators.map((member) => (
            <div
              key={member.userId}
              className="px-4 sm:px-6 lg:px-10 py-4 sm:py-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 group hover:bg-slate-50/30 transition-colors"
            >
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg sm:rounded-xl flex items-center justify-center text-white font-black text-base sm:text-lg shrink-0">
                  {member.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="text-xs sm:text-sm font-bold text-slate-800">{member.name}</div>
                  <div className="text-[10px] sm:text-xs text-slate-400">{member.email}</div>
                </div>
              </div>
              <div className="flex items-center gap-3 sm:gap-6 w-full sm:w-auto justify-between sm:justify-end">
                <div className="flex items-center gap-2">
                  {getRoleIcon(member.role)}
                  <span className="text-[10px] sm:text-xs font-bold text-slate-700">{getRoleName(member.role)}</span>
                </div>
                {canRemove && member.role !== 'owner' && (
                  <button
                    onClick={() => handleRemoveCollaborator(member.userId)}
                    className="px-3 sm:px-4 py-1.5 sm:py-2 text-[10px] sm:text-xs font-bold text-red-600 hover:bg-red-50 rounded-lg sm:rounded-xl transition-all opacity-100 sm:opacity-0 sm:group-hover:opacity-100"
                  >
                    Удалить
                  </button>
                )}
              </div>
            </div>
          ))}
          {collaborators.length === 0 && (
            <div className="px-4 sm:px-6 lg:px-10 py-8 sm:py-12">
              <EmptyState
                iconType="default"
                title="Нет участников команды"
                description="Пригласите коллег для совместной работы над проектом."
                action={canInvite ? {
                  label: "Пригласить участника",
                  onClick: () => setShowInviteModal(true),
                  variant: 'primary'
                } : undefined}
              />
            </div>
          )}
        </div>
      </div>

      {/* Приглашения */}
      {invitations.length > 0 && (
        <div className="bg-white rounded-[24px] sm:rounded-[32px] lg:rounded-[40px] border border-slate-100 shadow-sm overflow-hidden">
          <div className="px-4 sm:px-6 lg:px-10 py-4 sm:py-6 bg-slate-50/50 border-b border-slate-50">
            <h3 className="text-[10px] sm:text-xs font-black text-slate-400 uppercase tracking-widest">Ожидающие приглашения</h3>
          </div>
          <div className="divide-y divide-slate-50">
            {invitations.map((invitation) => (
              <div key={invitation.id} className="px-4 sm:px-6 lg:px-10 py-4 sm:py-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
                <div className="flex items-center gap-4">
                  <Clock className="w-5 h-5 text-slate-400" />
                  <div>
                    <div className="text-sm font-bold text-slate-800">{invitation.email}</div>
                    <div className="text-xs text-slate-400">
                      {getRoleName(invitation.role)} • Истекает {new Date(invitation.expiresAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {getRoleIcon(invitation.role)}
                  <span className="text-xs font-bold text-slate-700">{getRoleName(invitation.role)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Модальное окно приглашения */}
      <AnimatePresence>
        {showInviteModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 sm:p-6 lg:p-8"
            onClick={() => setShowInviteModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-[24px] sm:rounded-[32px] lg:rounded-[40px] p-4 sm:p-6 lg:p-8 max-w-md w-full shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <h3 className="text-lg sm:text-xl font-black text-slate-900">Пригласить участника</h3>
                <button
                  onClick={() => setShowInviteModal(false)}
                  className="p-1.5 sm:p-2 hover:bg-slate-100 rounded-lg sm:rounded-xl transition-all"
                >
                  <X className="w-4 h-4 sm:w-5 sm:h-5 text-slate-400" />
                </button>
              </div>

              <div className="space-y-3 sm:space-y-4">
                <div>
                  <label className="text-xs sm:text-sm font-bold text-slate-700 mb-2 block">Email</label>
                  <input
                    type="email"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    placeholder="user@example.com"
                    className="w-full p-3 sm:p-4 bg-slate-50 border-none rounded-xl sm:rounded-2xl text-xs sm:text-sm font-medium focus:ring-2 ring-blue-500/20"
                  />
                </div>

                <div>
                  <label className="text-xs sm:text-sm font-bold text-slate-700 mb-2 block">Роль</label>
                  <select
                    value={inviteRole}
                    onChange={(e) => setInviteRole(e.target.value as 'editor' | 'viewer')}
                    className="w-full p-3 sm:p-4 bg-slate-50 border-none rounded-xl sm:rounded-2xl text-xs sm:text-sm font-medium focus:ring-2 ring-blue-500/20"
                  >
                    <option value="editor">Редактор - может редактировать проект</option>
                    <option value="viewer">Зритель - может только просматривать</option>
                  </select>
                </div>

                <button
                  onClick={handleInvite}
                  disabled={loading || !inviteEmail}
                  className="w-full py-3 sm:py-4 bg-slate-900 text-white rounded-xl sm:rounded-2xl font-bold text-xs sm:text-sm hover:bg-slate-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Отправка...
                    </>
                  ) : (
                    <>
                      <Mail className="w-4 h-4 sm:w-5 sm:h-5" />
                      Отправить приглашение
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
