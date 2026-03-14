import React, { useState } from 'react';
import { X, User, School, Book, CheckCircle, LogOut, Edit2, Save, GraduationCap } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../../stores/authStore';
import { cn } from '@/lib/utils';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose }) => {
  const { t } = useTranslation();
  const { user, isLoggedIn, isVerified, login, logout, updateProfile, verifyIdentity } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState(user);

  if (!isOpen) return null;

  const handleSave = () => {
    updateProfile(editForm);
    setIsEditing(false);
  };

  const handleLogin = () => {
    login();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-md mx-4 rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-6">
          <div className="flex justify-between items-start mb-6">
            <h2 className="text-xl font-bold text-gray-900">{t('profile.title')}</h2>
            <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full transition-colors">
              <X size={20} className="text-gray-500" />
            </button>
          </div>

          {!isLoggedIn ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <User size={32} className="text-gray-400" />
              </div>
              <p className="text-gray-600 mb-6">{t('profile.notLoggedIn')}</p>
              <button
                onClick={handleLogin}
                className="w-full bg-orange-500 text-white font-bold py-3 rounded-xl hover:bg-orange-600 transition-colors"
              >
                {t('profile.loginBtn')}
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <img src={user.avatar} alt={user.name} className="w-20 h-20 rounded-full bg-gray-50 border-2 border-orange-100" />
                  {isVerified && (
                    <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 shadow-sm">
                      <CheckCircle size={20} className="text-green-500 fill-green-50" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  {isEditing ? (
                    <input
                      type="text"
                      value={editForm.name}
                      onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                      className="w-full text-lg font-bold border-b border-orange-200 focus:outline-none focus:border-orange-500"
                    />
                  ) : (
                    <h3 className="text-lg font-bold text-gray-900 truncate">{user.name}</h3>
                  )}
                  <p className="text-sm text-gray-500 truncate">{user.email}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <div className="p-2 bg-white rounded-lg shadow-sm">
                    <School size={18} className="text-orange-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{t('profile.school')}</p>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editForm.school}
                        onChange={(e) => setEditForm({ ...editForm, school: e.target.value })}
                        className="w-full text-sm font-medium border-b border-orange-100 focus:outline-none focus:border-orange-500 bg-transparent"
                      />
                    ) : (
                      <p className="text-sm font-medium text-gray-700">{user.school}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <div className="p-2 bg-white rounded-lg shadow-sm">
                    <Book size={18} className="text-orange-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{t('profile.major')}</p>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editForm.major}
                        onChange={(e) => setEditForm({ ...editForm, major: e.target.value })}
                        className="w-full text-sm font-medium border-b border-orange-100 focus:outline-none focus:border-orange-500 bg-transparent"
                      />
                    ) : (
                      <p className="text-sm font-medium text-gray-700">{user.major}</p>
                    )}
                  </div>
                </div>

                {isVerified && (
                  <div className="flex items-center gap-3 p-3 bg-green-50 border border-green-100 rounded-xl">
                    <CheckCircle size={18} className="text-green-500" />
                    <span className="text-xs font-bold text-green-700">{t('profile.verified')}</span>
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-2 pt-2">
                {!isVerified && !isEditing && (
                  <button
                    onClick={verifyIdentity}
                    className="flex items-center justify-center gap-2 w-full bg-green-600 text-white font-bold py-3 rounded-xl hover:bg-green-700 transition-colors shadow-sm"
                  >
                    <GraduationCap size={18} />
                    {t('profile.verifyBtn')}
                  </button>
                )}

                <div className="flex gap-2">
                  {isEditing ? (
                    <button
                      onClick={handleSave}
                      className="flex-1 flex items-center justify-center gap-2 bg-orange-500 text-white font-bold py-3 rounded-xl hover:bg-orange-600 transition-colors"
                    >
                      <Save size={18} />
                      {t('profile.saveBtn')}
                    </button>
                  ) : (
                    <button
                      onClick={() => { setEditForm(user); setIsEditing(true); }}
                      className="flex-1 flex items-center justify-center gap-2 bg-white text-gray-700 font-bold py-3 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors"
                    >
                      <Edit2 size={18} />
                      {t('profile.editBtn')}
                    </button>
                  )}
                  
                  <button
                    onClick={() => { logout(); onClose(); }}
                    className="px-4 flex items-center justify-center text-red-500 font-bold hover:bg-red-50 rounded-xl transition-colors"
                    title={t('profile.logoutBtn')}
                  >
                    <LogOut size={18} />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
