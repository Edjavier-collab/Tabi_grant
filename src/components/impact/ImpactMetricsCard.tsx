"use client";

import { useImpactMetrics } from "@/hooks/useImpactMetrics";
import { TreePine, Map, Droplet, Users, ShieldAlert, Bird } from "lucide-react";

export function ImpactMetricsCard({ projectId }: { projectId: string }) {
    const { metrics } = useImpactMetrics(projectId);

    if (!metrics) {
        return (
            <div className="border-4 border-black bg-[#E2DFD8] p-12 text-center animate-pulse">
                <div className="font-heading text-xl font-black uppercase tracking-widest">Awaiting Data...</div>
            </div>
        );
    }

    const StatBox = ({ icon: Icon, label, value, color }: { icon: any, label: string, value: string | number, color: string }) => (
        <div className="border-4 border-black bg-white p-6 relative group overflow-hidden transition-all hover:translate-x-[-4px] hover:translate-y-[-4px] hover:shadow-[8px_8px_0px_0px_rgba(17,17,17,1)] cursor-default">
            <div className={`absolute -right-6 -top-6 w-24 h-24 rounded-full opacity-10 transition-transform group-hover:scale-150 duration-500`} style={{ backgroundColor: color }}></div>
            <div className="flex items-start gap-4 mb-4 z-10 relative">
                <div className="p-3 border-4 border-black" style={{ backgroundColor: color }}>
                    <Icon className="w-6 h-6 text-black" />
                </div>
            </div>
            <p className="font-mono text-xs font-black uppercase tracking-widest text-black/60 mb-1 z-10 relative">{label}</p>
            <p className="font-mono text-3xl font-black z-10 relative">{value}</p>
        </div>
    );

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <StatBox icon={TreePine} label="Trees Planted" value={metrics.treesPlanted?.toLocaleString() || 0} color="#32CD32" />
            <StatBox icon={Map} label="Hectares Restored" value={`${metrics.hectaresRestored || 0} ha`} color="#FFD700" />
            <StatBox icon={Droplet} label="Survival Rate" value={`${metrics.survivalRate || 0}%`} color="#4169E1" />
            <StatBox icon={ShieldAlert} label="Patrol Hours" value={`${metrics.patrolHours || 0} hrs`} color="#FF3500" />
            <StatBox icon={Users} label="Community Members" value={metrics.communityMembers?.toLocaleString() || 0} color="#FF69B4" />
            <StatBox icon={Bird} label="Species Sighted" value={metrics.speciesSighted || 0} color="#9370DB" />

            <div className="lg:col-span-3 border-4 border-black bg-black text-white p-6 flex flex-col md:flex-row items-center justify-between shadow-[6px_6px_0px_0px_rgba(255,215,0,1)] hover:shadow-none hover:translate-x-[6px] hover:translate-y-[6px] transition-all">
                <div className="flex items-center gap-4">
                    <Droplet className="w-8 h-8 text-[#00FFFF]" />
                    <div>
                        <p className="font-mono text-xs font-black uppercase tracking-widest text-white/60">Water Quality Index</p>
                        <p className="font-heading text-2xl font-black uppercase tracking-widest">{metrics.waterQuality || 'N/A'}</p>
                    </div>
                </div>
                <div className="mt-4 md:mt-0 px-4 py-2 bg-[#00FFFF] text-black font-mono text-sm font-black uppercase border-2 border-transparent hover:bg-white hover:text-black transition-colors cursor-pointer">
                    Latest Reading
                </div>
            </div>
        </div>
    );
}
