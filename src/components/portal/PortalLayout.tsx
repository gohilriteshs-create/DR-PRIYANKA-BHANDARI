import React, { useState } from 'react';
import { 
  Stethoscope, 
  Home, 
  FileText, 
  Pill, 
  Activity, 
  Calendar, 
  User, 
  Settings, 
  LogOut, 
  Bell, 
  ShieldCheck, 
  ChevronRight, 
  ArrowLeft, 
  Menu, 
  X, 
  Download,
  Users,
  History,
  CheckCircle2
} from 'lucide-react';
import { usePortal } from '../../context/PortalContext';
import { PatientDashboard } from './PatientDashboard';
import { ConsultationsView } from './ConsultationsView';
import { MedicinesView } from './MedicinesView';
import { MedicalHistoryView } from './MedicalHistoryView';
import { DocumentsView } from './DocumentsView';
import { AppointmentsView } from './AppointmentsView';
import { ProfileView } from './ProfileView';
import { SettingsView } from './SettingsView';
import { DoctorDashboard } from './DoctorDashboard';

interface PortalLayoutProps {
  onBackToWebsite: () => void;
}

export const PortalLayout: React.FC<PortalLayoutProps> = ({ onBackToWebsite }) => {
  const { 
    session, 
    currentPatient, 
    role, 
    logout, 
    switchDemoAccount, 
    notifications,
    markNotificationAsRead,
    markAllNotificationsAsRead 
  } = usePortal();

  // Active Tab
  const [activeTab, setActiveTab] = useState<string>(
    role === 'doctor' || role === 'admin' ? 'doctor-view' : 'dashboard'
  );

  // Mobile drawer
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const unreadNotifications = notifications.filter(n => !n.read);

  const isDoctorOrAdmin = role === 'doctor' || role === 'admin';

  const navItems = isDoctorOrAdmin
    ? [
        { id: 'doctor-view', label: 'Doctor Clinical Dossier', icon: Stethoscope },
        { id: 'consultations', label: 'All Consultations', icon: FileText },
        { id: 'documents', label: 'Reports & Uploads', icon: FileText },
        { id: 'appointments', label: 'Appointments Desk', icon: Calendar },
        { id: 'settings', label: 'Security & Settings', icon: Settings }
      ]
    : [
        { id: 'dashboard', label: 'My Health Dashboard', icon: Home },
        { id: 'consultations', label: 'My Consultations', icon: FileText },
        { id: 'medicines', label: 'My Medicines', icon: Pill },
        { id: 'history', label: 'Medical History', icon: Activity },
        { id: 'documents', label: 'My Documents', icon: FileText },
        { id: 'appointments', label: 'My Appointments', icon: Calendar },
        { id: 'profile', label: 'My Profile', icon: User },
        { id: 'settings', label: 'Account & Settings', icon: Settings }
      ];

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans selection:bg-sky-200">
      {/* 1. Portal Sticky Top Navigation Bar */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Brand & Clinic Identity */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100"
              aria-label="Open portal navigation"
            >
              <Menu className="w-5 h-5" />
            </button>

            <button
              onClick={onBackToWebsite}
              className="flex items-center gap-2 group text-left"
              title="Return to Dr. Priyanka Bhandari Clinic Website"
            >
              <div className="w-10 h-10 rounded-xl bg-sky-900 text-white flex items-center justify-center font-bold text-lg shadow-xs group-hover:bg-sky-800 transition-colors">
                <Stethoscope className="w-5 h-5" />
              </div>
              <div className="hidden sm:block">
                <div className="text-xs font-bold text-sky-950 uppercase tracking-wider">
                  Dr. Priyanka Bhandari, BAMS, CGO, PGDEMS
                </div>
                <div className="text-[11px] text-slate-500 font-medium flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>General Physician Consultant · Hinduja Hospital</span>
                </div>
              </div>
            </button>
          </div>

          {/* Quick Demo Switcher Strip */}
          <div className="hidden xl:flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-[11px] font-medium border border-slate-200">
            <span className="text-slate-400 px-2 font-semibold uppercase text-[10px]">Quick Test:</span>
            <button
              onClick={() => { switchDemoAccount('rajesh'); setActiveTab('dashboard'); }}
              className={`px-2.5 py-1 rounded-lg transition-all ${currentPatient?.id === 'pat-101' && role === 'patient' ? 'bg-white shadow-xs font-bold text-sky-900' : 'text-slate-600 hover:text-slate-900'}`}
            >
              Rajesh (Patient)
            </button>
            <button
              onClick={() => { switchDemoAccount('priya'); setActiveTab('dashboard'); }}
              className={`px-2.5 py-1 rounded-lg transition-all ${currentPatient?.id === 'pat-102' && role === 'patient' ? 'bg-white shadow-xs font-bold text-sky-900' : 'text-slate-600 hover:text-slate-900'}`}
            >
              Priya (Patient)
            </button>
            <button
              onClick={() => { switchDemoAccount('doctor'); setActiveTab('doctor-view'); }}
              className={`px-2.5 py-1 rounded-lg transition-all ${role === 'doctor' ? 'bg-sky-900 text-white font-bold' : 'text-slate-600 hover:text-slate-900'}`}
            >
              Dr. Priyanka (Doctor)
            </button>
            <button
              onClick={() => { switchDemoAccount('admin'); setActiveTab('doctor-view'); }}
              className={`px-2.5 py-1 rounded-lg transition-all ${role === 'admin' ? 'bg-slate-800 text-white font-bold' : 'text-slate-600 hover:text-slate-900'}`}
            >
              Admin
            </button>
          </div>

          {/* Right Header Actions: Notifications, Back to Website, Logout */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Notifications Dropdown */}
            <div className="relative">
              <button
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="p-2 text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-100 transition-colors relative"
                aria-label="View notifications"
              >
                <Bell className="w-5 h-5" />
                {unreadNotifications.length > 0 && (
                  <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-600 rounded-full ring-2 ring-white"></span>
                )}
              </button>

              {notificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 py-3 z-50 animate-in fade-in">
                  <div className="px-4 pb-2 border-b border-slate-100 flex items-center justify-between">
                    <span className="font-bold text-slate-800 text-xs">Patient Notifications</span>
                    {unreadNotifications.length > 0 && (
                      <button
                        onClick={markAllNotificationsAsRead}
                        className="text-[11px] text-sky-700 hover:text-sky-900 font-semibold"
                      >
                        Mark all as read
                      </button>
                    )}
                  </div>

                  <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
                    {notifications.length > 0 ? (
                      notifications.map((n) => (
                        <div
                          key={n.id}
                          onClick={() => markNotificationAsRead(n.id)}
                          className={`p-3 text-xs cursor-pointer hover:bg-slate-50 transition-colors ${
                            !n.read ? 'bg-sky-50/50' : ''
                          }`}
                        >
                          <div className="font-bold text-slate-900 flex items-center justify-between">
                            <span>{n.title}</span>
                            {!n.read && (
                              <span className="w-1.5 h-1.5 rounded-full bg-sky-600"></span>
                            )}
                          </div>
                          <p className="text-slate-600 text-[11px] mt-0.5 leading-relaxed">{n.message}</p>
                          <span className="text-[10px] text-slate-400 mt-1 block">
                            {new Date(n.date).toLocaleDateString()}
                          </span>
                        </div>
                      ))
                    ) : (
                      <div className="py-6 text-center text-xs text-slate-400">
                        No notifications.
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Back to Clinic Website Button */}
            <button
              onClick={onBackToWebsite}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Clinic</span>
            </button>

            {/* User Profile Pill & Logout */}
            <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
              <div className="hidden md:block text-right">
                <div className="font-bold text-slate-900 text-xs truncate max-w-[140px]">
                  {session?.fullName || 'User'}
                </div>
                <div className="text-[10px] font-mono text-slate-400 uppercase">
                  {role === 'doctor' ? 'Practitioner' : role === 'admin' ? 'Clinic Staff' : currentPatient?.patientNumber || 'Patient'}
                </div>
              </div>

              <button
                onClick={logout}
                className="p-2 text-slate-500 hover:text-red-700 rounded-xl hover:bg-red-50 transition-colors"
                title="Sign out of portal"
                aria-label="Sign out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* 2. Main Portal Body: Sidebar + Dynamic Content */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 flex gap-6">
        {/* Desktop Sidebar Navigation */}
        <aside className="hidden lg:block w-64 shrink-0 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-3 shadow-xs space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-sky-800 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* Quick Clinic Emergency Box */}
          <div className="bg-slate-900 rounded-2xl p-4 text-white text-xs space-y-2">
            <div className="font-bold text-sky-300 uppercase tracking-wider text-[10px]">
              Direct Clinic Desk
            </div>
            <p className="text-slate-300 text-[11px] leading-relaxed">
              Mon - Sat: 10:00 AM - 9:00 PM<br />
              Emergency Help: 112 / 108
            </p>
            <a
              href="tel:+917506651415"
              className="inline-block pt-1 text-sky-400 font-bold hover:underline"
            >
              Call +91 75066 51415
            </a>
          </div>
        </aside>

        {/* Mobile Slide-out Drawer */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex">
            <div 
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs"
              onClick={() => setMobileMenuOpen(false)}
            />
            <div className="relative bg-white w-72 max-w-[80%] h-full p-5 shadow-2xl flex flex-col justify-between overflow-y-auto">
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-slate-200">
                  <div className="font-bold text-slate-900 text-sm">Portal Navigation</div>
                  <button onClick={() => setMobileMenuOpen(false)}>
                    <X className="w-5 h-5 text-slate-400" />
                  </button>
                </div>

                <div className="mt-4 space-y-1">
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          setActiveTab(item.id);
                          setMobileMenuOpen(false);
                        }}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold ${
                          isActive
                            ? 'bg-sky-800 text-white'
                            : 'text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        <Icon className="w-4 h-4 shrink-0" />
                        <span>{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200 space-y-2">
                <button
                  onClick={onBackToWebsite}
                  className="w-full py-2 px-3 bg-slate-100 text-slate-700 rounded-xl text-xs font-semibold flex items-center justify-center gap-2"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Return to Website</span>
                </button>
                <button
                  onClick={logout}
                  className="w-full py-2 px-3 bg-red-50 text-red-700 rounded-xl text-xs font-semibold flex items-center justify-center gap-2"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Content View Router */}
        <main className="flex-1 min-w-0">
          {activeTab === 'dashboard' && (
            <PatientDashboard
              onNavigateTab={(tab) => setActiveTab(tab)}
              onOpenBookingModal={() => setActiveTab('appointments')}
            />
          )}

          {activeTab === 'consultations' && <ConsultationsView />}
          {activeTab === 'medicines' && <MedicinesView />}
          {activeTab === 'history' && <MedicalHistoryView />}
          {activeTab === 'documents' && <DocumentsView />}
          {activeTab === 'appointments' && <AppointmentsView />}
          {activeTab === 'profile' && <ProfileView />}
          {activeTab === 'settings' && <SettingsView />}
          {activeTab === 'doctor-view' && <DoctorDashboard />}
        </main>
      </div>
    </div>
  );
};
