import React from 'react';
import {
  Stethoscope,
  ShieldCheck,
  HeartHandshake,
  Users,
  Sparkles,
  CalendarCheck,
  Activity,
  HeartPulse,
  UserCheck,
  FileText,
  Heart,
  Award,
  Compass,
  Smile,
  Shield,
  HelpCircle,
  LucideProps
} from 'lucide-react';

interface DynamicIconProps extends LucideProps {
  name: string;
}

export const DynamicMedicalIcon: React.FC<DynamicIconProps> = ({ name, ...props }) => {
  switch (name) {
    case 'Stethoscope':
      return <Stethoscope {...props} />;
    case 'ShieldCheck':
      return <ShieldCheck {...props} />;
    case 'HeartHandshake':
      return <HeartHandshake {...props} />;
    case 'Users':
      return <Users {...props} />;
    case 'Sparkles':
      return <Sparkles {...props} />;
    case 'CalendarCheck':
      return <CalendarCheck {...props} />;
    case 'Activity':
      return <Activity {...props} />;
    case 'HeartPulse':
      return <HeartPulse {...props} />;
    case 'UserCheck':
      return <UserCheck {...props} />;
    case 'FileText':
      return <FileText {...props} />;
    case 'Heart':
      return <Heart {...props} />;
    case 'Award':
      return <Award {...props} />;
    case 'Compass':
      return <Compass {...props} />;
    case 'Smile':
      return <Smile {...props} />;
    case 'Shield':
      return <Shield {...props} />;
    default:
      return <HelpCircle {...props} />;
  }
};
