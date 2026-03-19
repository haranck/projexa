import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

interface ProgressLinearProps {
    title: string;
    description: string;
    completed: number;
    total: number;
    color?: string;
}

export const ProgressLinear = ({ title, description, completed, total, color = "bg-blue-500" }: ProgressLinearProps) => {
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

    return (
        <Card className="bg-[#141820] border-white/5 relative overflow-hidden">
             <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/5 blur-[80px] -mr-32 -mt-32 pointer-events-none" />
             
            <CardHeader className="pb-2">
                <div className="flex justify-between items-end">
                    <CardTitle className="text-lg font-black text-white tracking-tight">{title}</CardTitle>
                    <span className="text-zinc-400 text-xs font-bold uppercase tracking-widest">{percentage}%</span>
                </div>
                <p className="text-zinc-500 text-xs font-medium">{description}</p>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <div className="h-3 w-full bg-[#1c222d] rounded-full overflow-hidden border border-white/5">
                        <div 
                            className={`h-full ${color} transition-all duration-1000 ease-out rounded-full shadow-[0_0_20px_rgba(59,130,246,0.3)]`}
                            style={{ width: `${percentage}%` }}
                        />
                    </div>
                    <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-zinc-600">
                        <span>{completed} / {total} Issues</span>
                        <span>{total - completed} Remaining</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};
