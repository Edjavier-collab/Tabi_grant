"use client";

import React, { useState } from "react";
import { Grant } from "@/types/grant";
import { X, Download, Sparkles, FileText, Loader2 } from "lucide-react";
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, BorderStyle, ImageRun } from "docx";
import { saveAs } from "file-saver";

interface Props {
    grant: Grant | null;
    isOpen: boolean;
    onClose: () => void;
}

export const LoiGenerator = ({ grant, isOpen, onClose }: Props) => {
    const [loiText, setLoiText] = useState("");
    const [loading, setLoading] = useState(false);
    const [persona, setPersona] = useState<string>("Scientific");

    if (!isOpen || !grant) return null;

    const handleGenerate = async () => {
        setLoading(true);
        setLoiText("");
        try {
            const res = await fetch("/api/generate-loi", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    funderName: grant.funderName,
                    projectName: grant.projectLinked,
                    amountRequested: grant.amountRequested,
                    persona: persona,
                    programName: grant.programName,
                }),
            });
            const data = await res.json();
            if (data.error) {
                alert("Generation failed: " + data.error);
            } else {
                setLoiText(data.loi);
            }
        } catch (err) {
            console.error(err);
            alert("Network error during LOI generation.");
        } finally {
            setLoading(false);
        }
    };

    const handleDownloadDocx = async () => {
        if (!loiText) return;

        const paragraphs = loiText.split("\n").filter(Boolean);

        // Fetch logo for embedding in docx
        let logoImageRun: ImageRun | null = null;
        try {
            const logoRes = await fetch("/Logo/tabi_po_foundation_logo.png");
            const logoBlob = await logoRes.arrayBuffer();
            logoImageRun = new ImageRun({
                data: logoBlob,
                transformation: { width: 800, height: 320 },
                type: "png",
            });
        } catch { /* Logo fetch failed, proceed without */ }

        const headerChildren: Paragraph[] = [];

        // Logo paragraph
        if (logoImageRun) {
            headerChildren.push(
                new Paragraph({
                    alignment: AlignmentType.CENTER,
                    spacing: { after: 10 },
                    children: [logoImageRun],
                })
            );
        }


        // Tax status
        headerChildren.push(
            new Paragraph({
                alignment: AlignmentType.CENTER,
                spacing: { after: 100 },
                children: [
                    new TextRun({
                        text: "A 501(c)(3) Tax-Exempt Organization | EIN: 88-33456484",
                        size: 18,
                        font: "Arial",
                        italics: true,
                        color: "666666",
                    }),
                ],
            })
        );

        // Address
        headerChildren.push(
            new Paragraph({
                alignment: AlignmentType.CENTER,
                spacing: { after: 50 },
                children: [
                    new TextRun({
                        text: "P.O. Box 10163, Palm Desert, California, USA 92255",
                        size: 16,
                        font: "Arial",
                        color: "999999",
                    }),
                ],
            })
        );

        // Contact
        headerChildren.push(
            new Paragraph({
                alignment: AlignmentType.CENTER,
                spacing: { after: 200 },
                children: [
                    new TextRun({
                        text: "www.tabipofoundation.org | email@tabipofoundation.org",
                        size: 16,
                        font: "Arial",
                        color: "999999",
                    }),
                ],
            })
        );

        const doc = new Document({
            sections: [{
                properties: {},
                children: [
                    ...headerChildren,
                    // Divider
                    new Paragraph({
                        border: {
                            bottom: { style: BorderStyle.SINGLE, size: 6, color: "000000" },
                        },
                        spacing: { after: 400 },
                        children: [],
                    }),
                    // Date
                    new Paragraph({
                        spacing: { after: 200 },
                        children: [
                            new TextRun({
                                text: new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }),
                                font: "Arial",
                                size: 22,
                            }),
                        ],
                    }),
                    // Addressee
                    new Paragraph({
                        spacing: { after: 300 },
                        children: [
                            new TextRun({
                                text: `${grant.funderName}${grant.programName ? ` — ${grant.programName}` : ""}`,
                                font: "Arial",
                                size: 22,
                            }),
                        ],
                    }),
                    // LOI Body paragraphs
                    ...paragraphs.map((p) => {
                        const isHeading = /^(\d+\.|#{1,3}\s|[A-Z][A-Z\s:]+$)/.test(p.trim());
                        if (isHeading) {
                            return new Paragraph({
                                heading: HeadingLevel.HEADING_2,
                                spacing: { before: 300, after: 100 },
                                children: [
                                    new TextRun({
                                        text: p.replace(/^#+\s*/, "").replace(/^\d+\.\s*/, ""),
                                        bold: true,
                                        font: "Arial",
                                        size: 24,
                                    }),
                                ],
                            });
                        }
                        return new Paragraph({
                            spacing: { after: 200 },
                            children: [
                                new TextRun({
                                    text: p.replace(/\*\*/g, ""),
                                    font: "Arial",
                                    size: 22,
                                }),
                            ],
                        });
                    }),
                    // Signature block
                    new Paragraph({
                        spacing: { before: 600 },
                        children: [
                            new TextRun({ text: "Respectfully,", font: "Arial", size: 22, italics: true }),
                        ],
                    }),
                    new Paragraph({
                        spacing: { before: 400 },
                        children: [
                            new TextRun({ text: "Tabi Po Foundation", font: "Arial", size: 22, bold: true }),
                        ],
                    }),
                ],
            }],
        });

        const blob = await Packer.toBlob(doc);
        saveAs(blob, `LOI_${grant.funderName.replace(/\s+/g, "_")}_${new Date().toISOString().slice(0, 10)}.docx`);
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md text-black">
            <div className="w-full max-w-3xl max-h-[90vh] bg-white border-4 border-black shadow-[16px_16px_0px_0px_rgba(17,17,17,1)] overflow-hidden flex flex-col animate-in fade-in zoom-in duration-200">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b-4 border-black bg-black text-white shrink-0">
                    <h2 className="font-heading text-xl font-black uppercase tracking-tighter flex items-center gap-3">
                        <FileText className="h-6 w-6" />
                        LOI Generator
                    </h2>
                    <button onClick={onClose} className="flex h-10 w-10 items-center justify-center border-2 border-white/30 bg-transparent transition-all hover:bg-signal hover:border-signal">
                        <X className="w-5 h-5 stroke-[3]" />
                    </button>
                </div>

                {/* Controls */}
                <div className="p-6 border-b-2 border-black bg-offwhite shrink-0">
                    <div className="flex flex-col sm:flex-row gap-4 items-end">
                        <div className="flex-1 space-y-2">
                            <label className="font-mono text-xs font-black uppercase tracking-widest text-black/50">Donor Persona</label>
                            <select
                                value={persona}
                                onChange={(e) => setPersona(e.target.value)}
                                className="w-full px-4 py-3 bg-white border-2 border-black font-mono text-sm font-bold focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(230,59,46,1)] transition-all"
                            >
                                <option value="Scientific">🔬 Scientific / Conservation</option>
                                <option value="Humanitarian">🤝 Humanitarian / Social</option>
                                <option value="Innovation">💡 Innovation / Tech</option>
                            </select>
                        </div>
                        <div className="text-right space-y-1 min-w-[180px]">
                            <div className="font-mono text-xs text-black/50 font-bold uppercase">For: {grant.funderName}</div>
                            <div className="font-mono text-xs text-black/50 font-bold">Project: {grant.projectLinked}</div>
                        </div>
                        <button
                            onClick={handleGenerate}
                            disabled={loading}
                            className="flex items-center gap-2 px-6 py-3 bg-signal text-white border-2 border-black font-heading text-sm font-black uppercase tracking-widest hover:bg-black transition-all disabled:opacity-50 shadow-[4px_4px_0px_0px_rgba(17,17,17,1)] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] shrink-0"
                        >
                            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                            {loading ? "Generating..." : "Generate LOI"}
                        </button>
                    </div>
                </div>

                {/* Preview */}
                <div className="flex-1 overflow-y-auto p-8 bg-white">
                    {!loiText && !loading && (
                        <div className="flex flex-col items-center justify-center h-full text-center text-black/30 py-20">
                            <FileText className="w-16 h-16 mb-4 stroke-1" />
                            <p className="font-mono text-sm font-bold uppercase tracking-widest">Select persona & click Generate</p>
                        </div>
                    )}
                    {loading && (
                        <div className="flex flex-col items-center justify-center h-full text-center py-20">
                            <Loader2 className="w-12 h-12 animate-spin text-signal mb-4" />
                            <p className="font-mono text-sm font-bold uppercase tracking-widest text-black/50">Gemini is drafting your LOI...</p>
                        </div>
                    )}
                    {loiText && !loading && (
                        <div className="max-w-[600px] mx-auto">
                            {/* Letterhead Preview */}
                            <div className="text-center mb-6 pb-4 border-b-2 border-black">
                                <img src="/Logo/tabi_po_foundation_logo.png" alt="Tabi Po Foundation Logo" className="w-[800px] h-[320px] mx-auto mb-0 object-contain" style={{ mixBlendMode: 'multiply' }} />
                                <p className="font-mono text-xs text-black/50 italic -mt-10">A 501(c)(3) Tax-Exempt Organization | EIN: 88-33456484</p>
                                <p className="font-mono text-[10px] text-black/30 mt-1">P.O. Box 10163, Palm Desert, California, USA 92255</p>
                                <p className="font-mono text-[10px] text-black/30 mt-0.5">www.tabipofoundation.org | email@tabipofoundation.org</p>
                            </div>
                            <div className="font-mono text-xs text-black/40 mb-4">
                                {new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                            </div>
                            <div className="prose prose-sm max-w-none font-mono text-sm leading-relaxed whitespace-pre-wrap">
                                {loiText}
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer Actions */}
                {loiText && !loading && (
                    <div className="p-6 border-t-4 border-black bg-offwhite flex gap-4 shrink-0">
                        <button
                            onClick={() => { navigator.clipboard.writeText(loiText); alert("LOI copied!"); }}
                            className="px-6 py-3 bg-white text-black border-2 border-black font-heading text-sm font-black uppercase tracking-widest hover:bg-black hover:text-white transition-all shadow-[4px_4px_0px_0px_rgba(17,17,17,1)] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px]"
                        >
                            Copy Text
                        </button>
                        <button
                            onClick={handleDownloadDocx}
                            className="flex-1 flex items-center justify-center gap-2 py-3 bg-signal text-white border-2 border-black font-heading text-sm font-black uppercase tracking-widest hover:bg-black transition-all shadow-[4px_4px_0px_0px_rgba(17,17,17,1)] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px]"
                        >
                            <Download className="w-4 h-4" /> Download .docx
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};
