import { Building2, Heart, Brain, Stethoscope, Bone, Activity, Droplets, Cookie } from 'lucide-react';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface DepartmentBadgeProps {
  department: string;
}

const DepartmentBadge = ({ department }: DepartmentBadgeProps) => {
  const departmentConfig: Record<string, { icon: LucideIcon, color: string }> = {
    'Cardiology': { icon: Heart, color: 'bg-red-500/10 text-red-500 border-red-500/30' },
    'Neurology': { icon: Brain, color: 'bg-purple-500/10 text-purple-500 border-purple-500/30' },
    'Oncology': { icon: Activity, color: 'bg-orange-500/10 text-orange-500 border-orange-500/30' },
    'Pulmonology': { icon: Droplets, color: 'bg-blue-500/10 text-blue-500 border-blue-500/30' },
    'Nephrology': { icon: Droplets, color: 'bg-cyan-500/10 text-cyan-500 border-cyan-500/30' },
    'Endocrinology': { icon: Cookie, color: 'bg-amber-500/10 text-amber-500 border-amber-500/30' },
    'Gastroenterology': { icon: Stethoscope, color: 'bg-green-500/10 text-green-500 border-green-500/30' },
    'Orthopedics': { icon: Bone, color: 'bg-stone-500/10 text-stone-500 border-stone-500/30' },
    'General Medicine': { icon: Building2, color: 'bg-primary/10 text-primary border-primary/30' }
  };

  const config = departmentConfig[department] || departmentConfig['General Medicine'];
  const Icon = config.icon;

  return (
    <div className={cn('inline-flex items-center gap-2 px-4 py-2 rounded-full border', config.color)}>
      <Icon className="h-4 w-4" />
      <span className="font-medium text-sm">{department}</span>
    </div>
  );
};

export default DepartmentBadge;
