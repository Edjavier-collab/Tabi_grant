"use client";

import { Table, Loader2 } from "lucide-react";

export function KoboDataTable({ formName, data, loading }: { formName: string, data: any[], loading?: boolean }) {
    if (loading) {
        return (
            <div className="border-4 border-black bg-white p-12 text-center shadow-[6px_6px_0px_0px_rgba(17,17,17,1)]">
                <Loader2 className="w-12 h-12 mx-auto mb-4 text-signal animate-spin" />
                <h3 className="font-heading text-xl font-black uppercase tracking-widest">Fetching Field Data...</h3>
                <p className="font-mono text-black/60">Retrieving latest submissions from KoBoToolbox.</p>
            </div>
        );
    }

    if (!data || data.length === 0) {
        return (
            <div className="border-4 border-black bg-white p-12 text-center shadow-[6px_6px_0px_0px_rgba(17,17,17,1)]">
                <Table className="w-12 h-12 mx-auto mb-4 text-black/20" />
                <h3 className="font-heading text-xl font-black uppercase tracking-widest mb-2">No Data Available</h3>
                <p className="font-mono text-black/60">Sync the specific form or check connection if this is unexpected.</p>
            </div>
        );
    }

    const headers = Object.keys(data[0] || {}).slice(0, 5); // Just show first 5 columns for dashboard

    return (
        <div className="border-4 border-black bg-white shadow-[6px_6px_0px_0px_rgba(17,17,17,1)] overflow-hidden">
            <div className="px-6 py-4 border-b-4 border-black bg-black text-white flex items-center gap-3">
                <Table className="w-5 h-5" />
                <h2 className="font-heading font-black text-base uppercase tracking-widest">{formName} Data Preview</h2>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-[#E2DFD8] border-b-4 border-black">
                            {headers.map(h => (
                                <th key={h} className="p-4 font-mono text-xs font-black uppercase tracking-widest border-r-4 border-black last:border-r-0">
                                    {h.replace(/_/g, ' ')}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {data.slice(0, 5).map((row, i) => (
                            <tr key={i} className={`border-b-4 border-black last:border-b-0 ${i % 2 === 0 ? 'bg-white' : 'bg-[#F8F8F8]'}`}>
                                {headers.map(h => (
                                    <td key={h} className="p-4 font-mono text-sm border-r-4 border-black last:border-r-0 truncate max-w-[200px]">
                                        {String(row[h] || '—')}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
