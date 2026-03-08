"use client";

import { useState } from "react";
import { useReportGenerator, ReportConfig } from "@/hooks/useReportGenerator";
import { Sparkles, FileText, Download, Mail, RefreshCcw } from "lucide-react";

export function ReportGenerator() {
    const { generate, generating, result, error } = useReportGenerator();
    const [config, setConfig] = useState<ReportConfig>({
        grantId: "mock-grant-123",
        reportType: "Quarterly Progress Report",
        reportingPeriod: { start: "2026-01-01", end: "2026-03-31" },
        donorPersona: "scientific",
        outputFormat: "both",
        includeGlossary: true,
        includePhotos: true,
        saveToDrive: false
    });

    const handleGenerate = async () => {
        await generate(config);
    };

    return (
        <div className="space-y-8">
            <div className="border-4 border-black bg-[#E2DFD8] p-8 shadow-[8px_8px_0px_0px_rgba(17,17,17,1)] relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#FDFCF8] rounded-full blur-3xl z-0 pointer-events-none translate-x-10 -translate-y-10"></div>

                <div className="z-10 relative">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="bg-black text-white p-3 border-4 border-black">
                            <Sparkles className="w-8 h-8 text-[#FFD700]" />
                        </div>
                        <h2 className="font-heading font-black text-3xl uppercase tracking-widest text-[#FF3500]">AI Report Generator</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        <div className="space-y-2">
                            <label className="font-mono text-xs font-black uppercase tracking-widest text-black">Report Type</label>
                            <div className="relative">
                                <select
                                    value={config.reportType}
                                    onChange={e => setConfig({ ...config, reportType: e.target.value })}
                                    className="w-full px-4 py-3 bg-white border-4 border-black font-mono text-sm font-bold focus:outline-none focus:translate-x-[-2px] focus:translate-y-[-2px] focus:shadow-[4px_4px_0px_0px_rgba(255,53,0,1)] transition-all appearance-none rounded-none cursor-pointer"
                                >
                                    <option value="Quarterly Progress Report">Quarterly Progress Report</option>
                                    <option value="Annual Narrative">Annual Narrative</option>
                                    <option value="Final Closeout Report">Final Closeout Report</option>
                                </select>
                                <div className="absolute bottom-4 right-4 pointer-events-none w-3 h-3 bg-black transform rotate-45"></div>
                            </div>
                        </div>
                        <div className="space-y-2 relative">
                            <label className="font-mono text-xs font-black uppercase tracking-widest text-black">Donor Persona</label>
                            <select
                                value={config.donorPersona}
                                onChange={e => setConfig({ ...config, donorPersona: e.target.value })}
                                className="w-full px-4 py-3 bg-white border-4 border-black font-mono text-sm font-bold focus:outline-none focus:translate-x-[-2px] focus:translate-y-[-2px] focus:shadow-[4px_4px_0px_0px_rgba(255,53,0,1)] transition-all appearance-none rounded-none cursor-pointer"
                            >
                                <option value="scientific">Scientific / Conservation</option>
                                <option value="humanitarian">Humanitarian / Social</option>
                                <option value="innovation">Innovation / Tech</option>
                            </select>
                            <div className="absolute bottom-4 right-4 pointer-events-none w-3 h-3 bg-black transform rotate-45"></div>
                        </div>

                        <div className="md:col-span-2 space-y-4 pt-4 border-t-4 border-black border-dotted">
                            <h4 className="font-heading font-black text-sm uppercase tracking-widest text-black mb-2">OUTPUT OPTIONS</h4>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <label className="flex items-center gap-3 cursor-pointer group">
                                    <input
                                        type="radio"
                                        name="outputFormat"
                                        value="docx"
                                        checked={config.outputFormat === 'docx'}
                                        onChange={e => setConfig({ ...config, outputFormat: e.target.value as any })}
                                        className="w-5 h-5 accent-[#FF3500] border-2 border-black"
                                    />
                                    <span className="font-mono text-sm font-bold uppercase group-hover:text-[#FF3500] transition-colors">Word Doc Only</span>
                                </label>
                                <label className="flex items-center gap-3 cursor-pointer group">
                                    <input
                                        type="radio"
                                        name="outputFormat"
                                        value="email"
                                        checked={config.outputFormat === 'email'}
                                        onChange={e => setConfig({ ...config, outputFormat: e.target.value as any })}
                                        className="w-5 h-5 accent-[#FF3500] border-2 border-black"
                                    />
                                    <span className="font-mono text-sm font-bold uppercase group-hover:text-[#FF3500] transition-colors">Email Only</span>
                                </label>
                                <label className="flex items-center gap-3 cursor-pointer group">
                                    <input
                                        type="radio"
                                        name="outputFormat"
                                        value="both"
                                        checked={config.outputFormat === 'both'}
                                        onChange={e => setConfig({ ...config, outputFormat: e.target.value as any })}
                                        className="w-5 h-5 accent-[#FF3500] border-2 border-black"
                                    />
                                    <span className="font-mono text-sm font-black uppercase group-hover:text-[#FF3500] transition-colors">Generate Both</span>
                                </label>
                            </div>
                        </div>

                        {/* Google Drive Integration element */}
                        <div className="md:col-span-2 pt-2">
                            <label className="flex items-center gap-3 cursor-pointer group bg-[#00FFFF]/10 border-2 border-[#00FFFF] p-3 inline-flex transition-colors hover:bg-[#00FFFF]/20">
                                <input
                                    type="checkbox"
                                    checked={config.saveToDrive}
                                    onChange={e => setConfig({ ...config, saveToDrive: e.target.checked })}
                                    className="w-5 h-5 accent-[#00FFFF] border-2 border-black"
                                />
                                <span className="font-mono text-sm font-bold uppercase text-black">Save Backup to Google Drive</span>
                                <FileText className="w-4 h-4 ml-2 text-[#00FFFF]" />
                            </label>
                        </div>
                    </div>

                    <button
                        onClick={handleGenerate}
                        disabled={generating}
                        className={`w-full py-5 border-4 border-black font-heading font-black text-xl uppercase tracking-widest transition-all ${generating
                            ? "bg-[#E2DFD8] text-black cursor-wait shadow-none translate-x-[6px] translate-y-[6px]"
                            : "bg-black text-white shadow-[6px_6px_0px_0px_rgba(255,215,0,1)] hover:bg-[#FFD700] hover:text-black hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[4px_4px_0px_0px_rgba(17,17,17,1)]"
                            }`}
                    >
                        <span className="flex items-center justify-center gap-3">
                            {generating ? <RefreshCcw className="w-6 h-6 animate-spin" /> : null}
                            {generating ? "PROCESSING FIELD DATA..." : "AUTO-GENERATE REPORT"}
                        </span>
                    </button>

                    {error && (
                        <div className="mt-6 p-4 bg-[#FF3500] text-black font-mono text-sm font-black border-4 border-black uppercase tracking-wider">
                            ERROR: {error}
                        </div>
                    )}
                </div>
            </div>

            {result && (
                <div className="animate-in slide-in-from-bottom flex flex-col gap-8">
                    <div className="flex items-center gap-4 py-8">
                        <div className="h-0.5 bg-black flex-1"></div>
                        <h3 className="font-heading text-2xl font-black uppercase tracking-widest px-4">GENERATION COMPLETE</h3>
                        <div className="h-0.5 bg-black flex-1"></div>
                    </div>

                    <div className="border-4 border-black bg-white shadow-[6px_6px_0px_0px_rgba(17,17,17,1)] overflow-hidden">
                        <div className="px-6 py-4 border-b-4 border-black bg-black text-white flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <FileText className="w-5 h-5 text-[#00FFFF]" />
                                <h3 className="font-heading font-black text-lg uppercase tracking-widest">Document Content</h3>
                            </div>
                            {result.documentUrl && (
                                <a
                                    href={result.documentUrl}
                                    download="Progress_Report.docx"
                                    className="flex items-center gap-2 bg-[#00FFFF] text-black px-4 py-2 border-2 border-transparent font-mono text-xs font-black uppercase tracking-widest hover:border-black transition-all"
                                >
                                    <Download className="w-4 h-4" /> Download DOCX
                                </a>
                            )}
                        </div>
                        <div className="p-8 font-mono text-sm bg-[#F8F8F8] overflow-y-auto max-h-[400px]">
                            {result.reportContent?.executive_summary && (
                                <h4 className="font-heading font-black text-xl mb-6 bg-white p-4 border-2 border-black">{result.reportContent.executive_summary}</h4>
                            )}
                            {result.reportContent?.sections?.map((s: any, i: number) => (
                                <div key={i} className="mb-8">
                                    <h5 className="font-heading font-black text-lg text-white bg-black inline-block px-3 py-1 mb-4">{s.title}</h5>
                                    <p className="mb-4 whitespace-pre-wrap leading-relaxed max-w-3xl">{s.content}</p>
                                    {s.metrics && s.metrics.length > 0 && (
                                        <div className="bg-[#E2DFD8] p-4 border-l-4 border-[#FF3500] max-w-2xl">
                                            <ul className="space-y-2">
                                                {s.metrics.map((m: any, j: number) => (
                                                    <li key={j} className="flex gap-2">
                                                        <span className="font-black">• {m.label}:</span>
                                                        <span>{m.value}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {result.coverEmail && (
                        <div className="border-4 border-black bg-white shadow-[6px_6px_0px_0px_rgba(17,17,17,1)] overflow-hidden">
                            <div className="px-6 py-4 border-b-4 border-black bg-black text-white flex items-center gap-3">
                                <Mail className="w-5 h-5 text-[#00FFFF]" />
                                <h4 className="font-heading font-black text-lg uppercase tracking-widest">Suggested Cover Email</h4>
                            </div>
                            <div className="p-8 bg-[#E2DFD8]">
                                <div className="p-6 bg-white border-4 border-black font-mono text-sm whitespace-pre-wrap leading-loose">
                                    {result.coverEmail}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
