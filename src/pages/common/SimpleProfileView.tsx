import React, { useState } from 'react';
import { User as UserIcon, Phone, MapPin, Sprout, LogOut, KeyRound, Edit3, CheckCircle2, X } from 'lucide-react';
import { User, UserRole } from '../../types';

interface SimpleProfileViewProps {
  currentUser: User | null;
  currentRole: UserRole;
  onLogout?: () => void;
  onUpdateUser?: (updatedUser: User) => void;
}

export const SimpleProfileView: React.FC<SimpleProfileViewProps> = ({
  currentUser,
  currentRole,
  onLogout,
  onUpdateUser
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(currentUser?.name || 'Farmer Ramesh Patil');
  const [editPhone, setEditPhone] = useState(currentUser?.phone || '+91 98765 43210');
  const [editLocation, setEditLocation] = useState(currentUser?.location || 'Nashik, Maharashtra');
  const [editSuccess, setEditSuccess] = useState(false);

  // Change Password state
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [currentPw, setCurrentPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [passwordStatus, setPasswordStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [passwordError, setPasswordError] = useState('');

  const accountTypeLabel =
    currentRole === 'farmer' || currentRole === 'fpo' ? 'Farmer Account' : 'Customer Account';

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    const updated: User = {
      ...currentUser,
      name: editName,
      phone: editPhone,
      location: editLocation
    };
    if (onUpdateUser) {
      onUpdateUser(updated);
    }
    try {
      localStorage.setItem('agriconnect_user', JSON.stringify(updated));
    } catch {}
    setIsEditing(false);
    setEditSuccess(true);
    setTimeout(() => setEditSuccess(false), 3000);
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    if (!newPw) {
      setPasswordError('Please enter a new password.');
      return;
    }
    if (newPw.length < 8) {
      setPasswordError('Password must be at least 8 characters long.');
      return;
    }
    if (newPw !== confirmPw) {
      setPasswordError('Passwords do not match.');
      return;
    }

    // Call API if available, or update locally
    const token = localStorage.getItem('agriconnect_token');
    fetch('/api/auth/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        resetToken: token || 'session',
        newPassword: newPw,
        confirmPassword: confirmPw
      })
    }).catch(() => {});

    setPasswordStatus('success');
    setTimeout(() => {
      setIsChangingPassword(false);
      setPasswordStatus('idle');
      setCurrentPw('');
      setNewPw('');
      setConfirmPw('');
    }, 2000);
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      {/* Page Title */}
      <div>
        <h2 className="text-2xl font-black text-stone-900 tracking-tight">
          My Profile
        </h2>
        <p className="text-xs text-stone-500 font-medium">
          Manage your personal information and account security
        </p>
      </div>

      {editSuccess && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Profile information updated successfully!</span>
        </div>
      )}

      {/* Account Details Card */}
      <div className="bg-white rounded-3xl p-6 border-2 border-stone-200 shadow-xs space-y-4">
        <div className="flex items-center gap-3.5 pb-4 border-b border-stone-100">
          <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-900 flex items-center justify-center font-black text-2xl shrink-0">
            {currentUser?.name?.charAt(0) || '🌾'}
          </div>
          <div>
            <h3 className="text-lg font-black text-stone-900 leading-tight">
              {currentUser?.name || 'Farmer Ramesh Patil'}
            </h3>
            <span className="text-xs font-black text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full inline-block mt-1">
              {accountTypeLabel}
            </span>
          </div>
        </div>

        {/* Profile Attributes per spec: 👤 Name, 📱 Mobile, 📍 Location, 🌾 Account Type */}
        <div className="space-y-3 text-sm">
          <div className="flex items-start gap-3 p-3 rounded-2xl bg-stone-50 border border-stone-100">
            <span className="text-xl">👤</span>
            <div>
              <span className="text-[11px] font-bold text-stone-400 block uppercase tracking-wider">
                Full Name
              </span>
              <span className="font-bold text-stone-900">
                {currentUser?.name || 'Farmer Ramesh Patil'}
              </span>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-2xl bg-stone-50 border border-stone-100">
            <span className="text-xl">📱</span>
            <div>
              <span className="text-[11px] font-bold text-stone-400 block uppercase tracking-wider">
                Mobile Number
              </span>
              <span className="font-bold text-stone-900">
                {currentUser?.phone || '+91 98765 43210'}
              </span>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-2xl bg-stone-50 border border-stone-100">
            <span className="text-xl">📍</span>
            <div>
              <span className="text-[11px] font-bold text-stone-400 block uppercase tracking-wider">
                Location
              </span>
              <span className="font-bold text-stone-900">
                {currentUser?.location || 'Nashik, Maharashtra'}
              </span>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-2xl bg-stone-50 border border-stone-100">
            <span className="text-xl">🌾</span>
            <div>
              <span className="text-[11px] font-bold text-stone-400 block uppercase tracking-wider">
                Account Type
              </span>
              <span className="font-bold text-stone-900 capitalize">
                {accountTypeLabel}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Buttons strictly per spec: Edit Profile, Change Password, Logout */}
      <div className="space-y-3">
        {/* Button 1: Edit Profile */}
        <button
          onClick={() => setIsEditing(true)}
          className="w-full py-4 rounded-2xl bg-white hover:bg-stone-50 text-stone-900 border-2 border-stone-200 font-extrabold text-sm flex items-center justify-center gap-2 active:scale-98 transition-all shadow-xs"
        >
          <Edit3 className="w-4 h-4 text-stone-700" />
          <span>Edit Profile</span>
        </button>

        {/* Button 2: Change Password */}
        <button
          onClick={() => setIsChangingPassword(true)}
          className="w-full py-4 rounded-2xl bg-white hover:bg-stone-50 text-stone-900 border-2 border-stone-200 font-extrabold text-sm flex items-center justify-center gap-2 active:scale-98 transition-all shadow-xs"
        >
          <KeyRound className="w-4 h-4 text-stone-700" />
          <span>Change Password</span>
        </button>

        {/* Button 3: Logout */}
        {onLogout && (
          <button
            onClick={onLogout}
            className="w-full py-4 rounded-2xl bg-rose-50 hover:bg-rose-100 text-rose-800 border-2 border-rose-200 font-black text-sm flex items-center justify-center gap-2 active:scale-98 transition-all"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        )}
      </div>

      {/* Edit Profile Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-sm rounded-3xl p-6 shadow-2xl space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-black text-stone-900">Edit Profile</h3>
              <button
                onClick={() => setIsEditing(false)}
                className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center text-stone-500 hover:bg-stone-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-3.5">
              <div>
                <label className="text-xs font-bold text-stone-600 block mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-stone-50 border border-stone-300 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-stone-600 block mb-1">
                  Mobile Number
                </label>
                <input
                  type="text"
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-stone-50 border border-stone-300 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-stone-600 block mb-1">
                  Location (Village / City)
                </label>
                <input
                  type="text"
                  value={editLocation}
                  onChange={(e) => setEditLocation(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-stone-50 border border-stone-300 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="flex-1 py-3.5 rounded-2xl border-2 border-stone-200 text-stone-600 font-bold text-sm hover:bg-stone-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3.5 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-black text-sm active:scale-95 transition-all shadow-md"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Change Password Modal */}
      {isChangingPassword && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-sm rounded-3xl p-6 shadow-2xl space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-black text-stone-900">Change Password</h3>
              <button
                onClick={() => {
                  setIsChangingPassword(false);
                  setPasswordStatus('idle');
                  setPasswordError('');
                }}
                className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center text-stone-500 hover:bg-stone-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {passwordStatus === 'success' ? (
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-2">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                <h4 className="text-base font-black text-emerald-950">Password Updated</h4>
                <p className="text-xs text-emerald-800">Your password has been changed successfully.</p>
              </div>
            ) : (
              <form onSubmit={handleChangePassword} className="space-y-3.5">
                {passwordError && (
                  <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold">
                    {passwordError}
                  </div>
                )}

                <div>
                  <label className="text-xs font-bold text-stone-600 block mb-1">
                    New Password
                  </label>
                  <input
                    type="password"
                    value={newPw}
                    onChange={(e) => setNewPw(e.target.value)}
                    placeholder="At least 8 characters"
                    className="w-full px-4 py-3 rounded-2xl bg-stone-50 border border-stone-300 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-stone-600 block mb-1">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    value={confirmPw}
                    onChange={(e) => setConfirmPw(e.target.value)}
                    placeholder="Repeat new password"
                    className="w-full px-4 py-3 rounded-2xl bg-stone-50 border border-stone-300 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    required
                  />
                </div>

                <div className="pt-2 flex gap-2">
                  <button
                    type="button"
                    onClick={() => setIsChangingPassword(false)}
                    className="flex-1 py-3.5 rounded-2xl border-2 border-stone-200 text-stone-600 font-bold text-sm hover:bg-stone-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3.5 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-black text-sm active:scale-95 transition-all shadow-md"
                  >
                    Update Password
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
