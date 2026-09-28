import React from 'react';
import { PortalAuth } from './PortalAuth';

interface PortalAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialTab?: 'signin' | 'signup';
}

export const PortalAuthModal: React.FC<PortalAuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  initialTab = 'signin'
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in overflow-y-auto">
      <div className="w-full max-w-2xl my-8">
        <PortalAuth
          onSuccess={onSuccess}
          onClose={onClose}
          initialTab={initialTab}
        />
      </div>
    </div>
  );
};
