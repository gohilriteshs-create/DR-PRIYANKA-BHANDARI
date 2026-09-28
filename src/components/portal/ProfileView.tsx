import React, { useState } from 'react';
import { 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  Heart, 
  ShieldCheck, 
  AlertCircle, 
  Edit3, 
  Save, 
  CheckCircle2, 
  Lock,
  Calendar,
  FileCheck
} from 'lucide-react';
import { usePortal } from '../../context/PortalContext';

export const ProfileView: React.FC = () => {
  const { currentPatient, updateProfile } = usePortal();

  const [isEditing, setIsEditing] = useState(false);
  const [mobile, setMobile] = useState(currentPatient?.mobile || '');
  const [address, setAddress] = useState(currentPatient?.address || '');
  const [emergencyName, setEmergencyName] = useState(currentPatient?.emergencyContact?.name || '');
  const [emergencyRelation, setEmergencyRelation] = useState(currentPatient?.emergencyContact?.relation || '');
  const [emergencyPhone, setEmergencyPhone] = useState(currentPatient?.emergencyContact?.phone || '');

  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsSaving(true);
    try {
      const res = await updateProfile({
        mobile,
        address,
        emergencyContact: emergencyName ? {
          name: emergencyName,
          relation: emergencyRelation || 'Emergency Contact',
          phone: emergencyPhone
        } : undefined
      });

      if (res.success) {
        setSaveSuccess(true);
        setIsEditing(false);
        setTimeout(() => setSaveSuccess(false), 2500);
      } else {
        setErrorMsg(res.error || 'Failed to update profile.');
      }
    } catch {
      setErrorMsg('Error saving updates.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
            My Patient Profile
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Review your clinical profile, verified blood group, contact details, and emergency contacts.
          </p>
        </div>

        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="px-4 py-2 bg-sky-800 hover:bg-sky-900 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-2 cursor-pointer self-start sm:self-auto"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Edit Personal Information</span>
          </button>
        )}
      </div>

      {saveSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Personal information updated successfully and logged in your patient file.</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-800 text-xs flex items-center gap-2 animate-in fade-in">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Main Grid: Personal (Editable) vs Medical (Doctor Read-Only) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Section 1: Personal Information */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-base">
              <User className="w-5 h-5 text-sky-700" />
              <span>Personal Information</span>
            </div>
            {isEditing && (
              <span className="text-[11px] font-semibold text-sky-800 bg-sky-50 px-2 py-0.5 rounded">
                Editing Permitted Fields
              </span>
            )}
          </div>

          {isEditing ? (
            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl text-slate-600 space-y-1">
                <div>Full Name: <strong>{currentPatient?.fullName}</strong> (Locked by clinic registration)</div>
                <div>Date of Birth: <strong>{currentPatient?.dateOfBirth}</strong></div>
                <div>Gender: <strong>{currentPatient?.gender}</strong></div>
                <div>Email: <strong>{currentPatient?.email}</strong></div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Mobile Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  required
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:border-sky-600 outline-hidden"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Residential Address
                </label>
                <textarea
                  rows={2}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:border-sky-600 outline-hidden resize-none"
                />
              </div>

              <div className="pt-2 border-t border-slate-100 space-y-2">
                <span className="font-bold text-slate-700 block">Emergency Contact</span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <input
                    type="text"
                    value={emergencyName}
                    onChange={(e) => setEmergencyName(e.target.value)}
                    placeholder="Contact Name"
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                  />
                  <input
                    type="text"
                    value={emergencyRelation}
                    onChange={(e) => setEmergencyRelation(e.target.value)}
                    placeholder="Relationship"
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                  />
                  <input
                    type="tel"
                    value={emergencyPhone}
                    onChange={(e) => setEmergencyPhone(e.target.value)}
                    placeholder="Phone"
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl font-semibold hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-4 py-2 bg-sky-800 text-white rounded-xl font-semibold hover:bg-sky-900 flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-xl">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Patient Number</span>
                  <strong className="text-slate-900 font-mono">{currentPatient?.patientNumber || 'N/A'}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Date of Birth / Gender</span>
                  <span className="text-slate-800 font-medium">
                    {currentPatient?.dateOfBirth} ({currentPatient?.gender})
                  </span>
                </div>
              </div>

              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Full Legal Name</span>
                <div className="text-slate-900 font-bold text-sm">{currentPatient?.fullName}</div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Contact Mobile</span>
                  <div className="text-slate-800 font-medium">{currentPatient?.mobile}</div>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Registered Email</span>
                  <div className="text-slate-800 font-medium">{currentPatient?.email}</div>
                </div>
              </div>

              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Residential Address</span>
                <div className="text-slate-800 font-medium leading-relaxed">
                  {currentPatient?.address || 'No residential address on record'}
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100">
                <span className="text-slate-400 block text-[10px] uppercase font-bold mb-1">
                  Designated Emergency Contact
                </span>
                {currentPatient?.emergencyContact ? (
                  <div className="p-3 bg-slate-50 rounded-xl space-y-0.5 text-slate-800">
                    <div className="font-bold">{currentPatient.emergencyContact.name} ({currentPatient.emergencyContact.relation})</div>
                    <div className="text-slate-600">{currentPatient.emergencyContact.phone}</div>
                  </div>
                ) : (
                  <div className="text-slate-500 italic">None specified</div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Section 2: Clinical Medical Information (Read-Only) */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-base">
              <Heart className="w-5 h-5 text-red-600" />
              <span>Medical Information</span>
            </div>
            <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full flex items-center gap-1">
              <Lock className="w-3 h-3 text-slate-400" />
              <span>Doctor-Verified / Read-Only</span>
            </span>
          </div>

          <div className="p-3.5 bg-sky-50/70 border border-sky-200 rounded-xl text-xs text-sky-900 leading-relaxed">
            <strong>Clinical Safety Protocol:</strong> Medical fields below are maintained exclusively by Dr. Priyanka Bhandari, BAMS, CGO, PGDEMS (General Physician Consultant, Hinduja Hospital). To submit a correction request or report new allergies, please contact the clinic desk directly.
          </div>

          <div className="space-y-4 text-xs">
            {/* Blood Group */}
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Blood Group</span>
              <div className="text-slate-900 font-black text-lg text-sky-900 mt-0.5">
                {currentPatient?.bloodGroup || 'Not Documented Yet'}
              </div>
            </div>

            {/* Allergies */}
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold mb-1">
                Documented Allergies
              </span>
              {currentPatient?.allergies && currentPatient.allergies.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {currentPatient.allergies.map((allergy, i) => (
                    <span 
                      key={i}
                      className="px-2.5 py-1 bg-red-50 text-red-800 border border-red-200 rounded-lg font-semibold text-xs flex items-center gap-1"
                    >
                      <AlertCircle className="w-3.5 h-3.5 text-red-600" />
                      <span>{allergy}</span>
                    </span>
                  ))}
                </div>
              ) : (
                <div className="p-2.5 bg-slate-50 rounded-lg text-slate-500 italic">
                  No known drug allergies (NKDA) recorded.
                </div>
              )}
            </div>

            {/* Existing Conditions */}
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold mb-1">
                Existing Conditions Under Care
              </span>
              {currentPatient?.existingConditions && currentPatient.existingConditions.length > 0 ? (
                <div className="space-y-1.5">
                  {currentPatient.existingConditions.map((cond, i) => (
                    <div key={i} className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-medium">
                      {cond}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-slate-500 italic">None documented</div>
              )}
            </div>

            {/* Relevant Medical History */}
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold mb-1">
                Physician History Summary
              </span>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 leading-relaxed">
                {currentPatient?.relevantMedicalHistory || 'No historical medical notes logged.'}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-400 flex items-center justify-between">
              <span>Primary Care: Dr. Priyanka Bhandari, BAMS, CGO, PGDEMS (Hinduja Hospital)</span>
              <span>Reg. No: MMC / State Council</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
