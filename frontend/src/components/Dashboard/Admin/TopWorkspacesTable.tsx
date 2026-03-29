import { Crown } from "lucide-react";

interface TopWorkspace {
    name: string;
    members: number;
    plan: string;
}

interface TopWorkspacesTableProps {
    workspaces: TopWorkspace[];
    colors: string[];
}

export const TopWorkspacesTable = ({ workspaces, colors }: TopWorkspacesTableProps) => {
    if (!workspaces || workspaces.length === 0) {
        return (
            <div className="rounded-2xl p-6 border border-white/5 bg-[#12121e]/85 backdrop-blur-xl h-full flex items-center justify-center min-h-[300px]">
                <p className="text-zinc-500 text-sm italic">No workspace data available</p>
            </div>
        );
    }

    const maxMembers = workspaces[0]?.members || 1;

    return (
        <div className="rounded-2xl p-6 border border-white/5 bg-[#12121e]/85 backdrop-blur-xl h-full flex flex-col">
            <div className="mb-6">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">Top Workspaces</h3>
                <p className="text-xs text-zinc-500 mt-1">Highest engagement by member count</p>
            </div>
            
            <div className="space-y-3 flex-1 overflow-y-auto pr-1 custom-scrollbar">
                {workspaces.map((ws, i) => (
                    <div
                        key={ws.name}
                        className="flex items-center justify-between p-3.5 rounded-xl border border-white/3 hover:border-white/10 transition-all duration-300 group bg-white/02 hover:bg-white/04"
                    >
                        <div className="flex items-center gap-4">
                            <div
                                className="w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold text-white shrink-0 shadow-lg border border-white/10"
                                style={{ background: colors[i % colors.length] + "33", color: colors[i % colors.length] }}
                            >
                                {i === 0 ? <Crown size={16} /> : i + 1}
                            </div>
                            <div className="min-w-0">
                                <p className="text-sm font-bold text-white truncate group-hover:text-indigo-400 transition-colors uppercase tracking-tight">{ws.name}</p>
                                <p className="text-[10px] text-zinc-500 font-medium uppercase mt-0.5">{ws.members} users · {ws.plan} plan</p>
                            </div>
                        </div>
                        <div className="flex flex-col items-end gap-1.5 min-w-[80px]">
                            <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden shadow-inner">
                                <div
                                    className="h-full rounded-full transition-all duration-1000"
                                    style={{
                                        width: `${Math.min(100, (ws.members / maxMembers) * 100)}%`,
                                        background: colors[i % colors.length],
                                        boxShadow: `0 0 10px ${colors[i % colors.length]}55`
                                    }}
                                />
                            </div>
                            <span className="text-[10px] font-bold text-zinc-500 tabular-nums">
                                {Math.round((ws.members / maxMembers) * 100)}%
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
