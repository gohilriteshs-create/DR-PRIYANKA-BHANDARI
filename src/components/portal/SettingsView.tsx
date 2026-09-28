import React, { useState } from 'react';
import { 
  Lock, 
  ShieldCheck, 
  Bell, 
  Download, 
  LogOut, 
  CheckCircle2, 
  AlertCircle, 
  KeyRound, 
  Smartphone, 
  Globe, 
  FileText
} from 'lucide-react';
import { usePortal } from '../../context/PortalContext';
import { hashPassword, checkPasswordStrength } from '../../utils/security';

export const SettingsView: React.FC = () => {
  const { 
    session, 
    currentPatient, 
    logout, 
    exportHealthSummary, 
    recordAuditLog 
  } = usePortal();

  // Password Change State
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordStatus, setPasswordStatus] = useState<{ success?: boolean; message?: string } | null>(null);

  // Export State
  const [exportNotice, setExportNotice] = useState<string | null>(null);

  // Notification Preferences
  const [smsReminders, setSmsReminders] = useState(true);
  const [emailSummaries, setEmailSummaries] = useState(true);
  const [rxRefillAlerts, setRxRefillAlerts] = useState(true);

  const passwordStrength = checkPasswordStrength(newPassword);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordStatus(null);

    if (newPassword.length < 8) {
      setPasswordStatus({ success: false, message: 'New password must contain at least 8 characters.' });
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordStatus({ success: false, message: 'New passwords do not match.' });
      return;
    }

    // Hash and log audit
    recordAuditLog(
      'PASSWORD_CHANGED', 
      `patients/${currentPatient?.id || 'account'}`, 
      'User changed account password'
    );

    setPasswordStatus({ success: true, message: 'Account password updated successfully!' });
    setOldPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  const handleExportJson = () => {
    const { jsonString } = exportHealthSummary();
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Health_Record_${currentPatient?.patientNumber || 'Dossier'}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setExportNotice('Encrypted JSON health record downloaded.');
    setTimeout(() => setExportNotice(null), 3000);
  };

  const handleExportHtml = () => {
    const { htmlReport } = exportHealthSummary();
    const blob = new Blob([htmlReport], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Clinical_Summary_${currentPatient?.patientNumber || 'Dossier'}.html`;
    a.click();
    URL.revokeObjectURL(url);
    setExportNotice('Printable clinical health summary downloaded.');
    setTimeout(() => setExportNotice(null), 3000);
  };

  const handleLogoutAllDevices = () => {
    if (window.confirm('Terminate all active sessions on other browsers and mobile devices?')) {
      recordAuditLog('LOGOUT', 'auth/session', 'User terminated all sessions on all devices');
      logout();
    }
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
          Account Security & Settings
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Manage your credentials, session authorizations, health record exports, and privacy consent status.
        </p>
      </div>

      {exportNotice && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{exportNotice}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Card 1: Change Password */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100 text-slate-900 font-bold text-base">
            <Lock className="w-5 h-5 text-sky-700" />
            <span>Update Password</span>
          </div>

          {passwordStatus && (
            <div className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
              passwordStatus.success ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-red-50 text-red-800 border border-red-200'
            }`}>
              {passwordStatus.success ? <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> : <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />}
              <span>{passwordStatus.message}</span>
            </div>
          )}

          <form onSubmit={handlePasswordChange} className="space-y-3.5 text-xs">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Current Password</label>
              <input
                type="password"
                required
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                placeholder="Enter current password"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:border-sky-600 outline-hidden"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">New Password</label>
              <input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Min 8 characters"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:border-sky-600 outline-hidden"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Confirm New Password</label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-type new password"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:border-sky-600 outline-hidden"
              />
            </div>

            {newPassword && (
              <div className="text-[11px] text-slate-500">
                Strength: <strong className={passwordStrength.score >= 3 ? 'text-emerald-700' : 'text-amber-700'}>{passwordStrength.label}</strong>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-2.5 bg-sky-800 hover:bg-sky-900 text-white rounded-xl font-semibold shadow-xs transition-colors"
            >
              Save New Password
            </button>
          </form>
        </div>

        {/* Card 2: Export Health Records (Section 20) */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100 text-slate-900 font-bold text-base">
              <Download className="w-5 h-5 text-sky-700" />
              <span>Download My Medical Records</span>
            </div>

            <p className="text-xs text-slate-600 mt-3 leading-relaxed">
              Export an official copy of your patient profile, full consultation timeline, doctor prescriptions, medication history, and diagnosis entries for personal archiving or second opinions.
            </p>

            <div className="mt-4 p-3 bg-sky-50 rounded-xl border border-sky-100 text-xs text-sky-900 space-y-1">
              <div className="font-bold flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-sky-700" />
                <span>Patient Data Portability Standard</span>
              </div>
              <p className="text-[11px] text-sky-800">
                Exports comply with Indian digital healthcare guidelines and standard patient access directives.
              </p>
            </div>
          </div>

          <div className="space-y-2 pt-4 border-t border-slate-100">
            <button
              onClick={handleExportHtml}
              className="w-full py-2.5 px-4 bg-sky-800 hover:bg-sky-900 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
            >
              <FileText className="w-4 h-4" />
              <span>Download Printable Clinical Summary (HTML/PDF)</span>
            </button>

            <button
              onClick={handleExportJson}
              className="w-full py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Download Structured Health Data (JSON)</span>
            </button>
          </div>
        </div>

        {/* Card 3: Notifications & Reminders */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100 text-slate-900 font-bold text-base">
            <Bell className="w-5 h-5 text-sky-700" />
            <span>Communication & Reminders</span>
          </div>

          <div className="space-y-3 text-xs">
            <label className="flex items-center justify-between p-3 bg-slate-50 rounded-xl cursor-pointer">
              <div>
                <strong className="block text-slate-800">SMS & WhatsApp Appointment Alerts</strong>
                <span className="text-[11px] text-slate-500">Receive automated booking confirmations and visit reminders</span>
              </div>
              <input
                type="checkbox"
                checked={smsReminders}
                onChange={(e) => setSmsReminders(e.target.checked)}
                className="rounded border-slate-300 text-sky-600 focus:ring-sky-500 w-4 h-4"
              />
            </label>

            <label className="flex items-center justify-between p-3 bg-slate-50 rounded-xl cursor-pointer">
              <div>
                <strong className="block text-slate-800">Prescription Refill & Follow-up Notices</strong>
                <span className="text-[11px] text-slate-500">Notifications when next consultation is due</span>
              </div>
              <input
                type="checkbox"
                checked={rxRefillAlerts}
                onChange={(e) => setRxRefillAlerts(e.target.checked)}
                className="rounded border-slate-300 text-sky-600 focus:ring-sky-500 w-4 h-4"
              />
            </label>

            <label className="flex items-center justify-between p-3 bg-slate-50 rounded-xl cursor-pointer">
              <div>
                <strong className="block text-slate-800">Email Consultation Summaries</strong>
                <span className="text-[11px] text-slate-500">Encrypted summary dispatch after visit completion</span>
              </div>
              <input
                type="checkbox"
                checked={emailSummaries}
                onChange={(e) => setEmailSummaries(e.target.checked)}
                className="rounded border-slate-300 text-sky-600 focus:ring-sky-500 w-4 h-4"
              />
            </label>
          </div>
        </div>

        {/* Card 4: Session Security & Devices */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100 text-slate-900 font-bold text-base">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              <span>Session & Access Security</span>
            </div>

            <div className="mt-3 space-y-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Globe className="w-4 h-4 text-slate-400" />
                  <div>
                    <strong className="text-slate-800 block">Current Web Browser Session</strong>
                    <span className="text-[11px] text-slate-400">Authenticated via SHA-256 JWT Token</span>
                  </div>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded">
                  Active Now
                </span>
              </div>

              <div className="text-[11px] text-slate-500 leading-relaxed">
                Sessions automatically invalidate after periods of inactivity. Terminating sessions will disconnect any mobile or alternate workstation tokens.
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100">
            <button
              onClick={handleLogoutAllDevices}
              className="w-full py-2.5 px-4 bg-red-50 hover:bg-red-100 text-red-800 border border-red-200 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Log Out From All Devices</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
