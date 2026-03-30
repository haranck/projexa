import React from "react";

interface TooltipPayloadItem {
    color: string;
    value: number | string;
    name: string;
}

interface ChartTooltipProps {
    active?: boolean;
    payload?: TooltipPayloadItem[];
    label?: string;
    prefix?: string;
}

const formatCurrency = (v: number) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(v);

export const ChartTooltip = ({ active, payload, label, prefix = "" }: ChartTooltipProps) => {
    if (active && payload && payload.length) {
        return (
            <div className="rounded-xl px-4 py-3 border border-white/10 shadow-2xl backdrop-blur-md bg-[#12121e]/90">
                {label && <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">{label}</p>}
                {payload.map((p, i) => (
                    <div key={i} className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full" style={{ background: p.color }} />
                        <p className="text-sm font-bold text-white">
                            {p.name && <span className="text-zinc-400 font-medium mr-1">{p.name}:</span>}
                            {typeof p.value === "number" && prefix === "₹" ? formatCurrency(p.value) : `${prefix}${p.value}`}
                        </p>
                    </div>
                ))}
            </div>
        );
    }
    return null;
};
