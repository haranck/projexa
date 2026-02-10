import DashboardLayout from "@/components/Layout/DashboardLayout";
import { Table } from "@/components/common/Table";
import { useGetAdminPayments } from "@/hooks/Admin/AdminHooks";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Loader2,
    CheckCircle2,
    XCircle,
    RefreshCcw,
    
    CreditCard,
    Hash,
    Coins,
    Calendar,
    ArrowUpRight,
    Search
} from "lucide-react";
import { useState } from "react";

interface AdminPayment {
    invoiceId: string;
    userName: string;
    workspaceName: string;
    amount: number;
    currency: string;
    status: string;
    paymentMethod: string;
    paidAt: string;
    stripeCustomerId: string;
}

export const SalesReport = () => {
    const [search, setSearch] = useState('')
    const { data: paymentsResponse, isLoading } = useGetAdminPayments();

    const rawPayments: AdminPayment[] = paymentsResponse?.data?.data || paymentsResponse?.data || [];

    const payments = rawPayments.filter(p =>
        p.userName.toLowerCase().includes(search.toLowerCase()) ||
        p.workspaceName.toLowerCase().includes(search.toLowerCase()) ||
        p.stripeCustomerId.toLowerCase().includes(search.toLowerCase())
    );

    const getStatusStyle = (status: string) => {
        const s = status.toLowerCase();
        if (s === 'paid' || s === 'succeeded') return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20 shadow-sm shadow-emerald-500/10';
        if (s === 'failed' || s === 'unpaid') return 'bg-red-500/10 text-red-500 border-red-500/20 shadow-sm shadow-red-500/10';
        if (s === 'refunded') return 'bg-purple-500/10 text-purple-500 border-purple-500/20 shadow-sm shadow-purple-500/10';
        return 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20';
    };

    const getStatusIcon = (status: string) => {
        const s = status.toLowerCase();
        if (s === 'paid' || s === 'succeeded') return <CheckCircle2 className="h-3 w-3" />;
        if (s === 'failed' || s === 'unpaid') return <XCircle className="h-3 w-3" />;
        if (s === 'refunded') return <RefreshCcw className="h-3 w-3" />;
        return null;
    };

    const formatCurrency = (amount: number, currency: string) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: currency.toUpperCase(),
        }).format(amount);
    };

    if (isLoading) {
        return (
            <DashboardLayout>
                <div className="flex h-[60vh] flex-col items-center justify-center space-y-4">
                    <Loader2 className="h-10 w-10 animate-spin text-blue-500" />
                    <p className="text-zinc-400 font-medium animate-pulse">Fetching platform sales data...</p>
                </div>
            </DashboardLayout>
        );
    }

    const columns = [
        {
            key: 'paidAt',
            header: 'Timestamp',
            render: (payment: AdminPayment) => (
                <div className="flex items-center gap-2.5 text-[11px] text-zinc-400">
                    <Calendar className="h-3.5 w-3.5 text-zinc-500" />
                    <div className="flex flex-col">
                        <span className="text-zinc-200 font-medium">
                            {new Date(payment.paidAt).toLocaleDateString(undefined, {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric'
                            })}
                        </span>
                        <span className="text-[10px] text-zinc-500">
                            {new Date(payment.paidAt).toLocaleTimeString(undefined, {
                                hour: '2-digit',
                                minute: '2-digit'
                            })}
                        </span>
                    </div>
                </div>
            )
        },
        {
            key: 'identity',
            header: 'Customer Identity',
            render: (payment: AdminPayment) => (
                <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-2xl bg-zinc-900 border border-white/5 flex items-center justify-center overflow-hidden shrink-0">
                        <span className="text-sm font-black text-blue-500/80">
                            {payment.userName?.[0]}
                        </span>
                    </div>
                    <div>
                        <div className="text-sm font-bold text-zinc-100 italic">
                            {payment.userName}
                        </div>
                        <div className="text-[10px] text-zinc-500 flex items-center gap-1.5 mt-0.5 font-mono">
                            <Hash className="h-3 w-3" /> {payment.stripeCustomerId}
                        </div>
                    </div>
                </div>
            )
        },
        {
            key: 'workspace',
            header: 'Workspace',
            render: (payment: AdminPayment) => (
                <div className="flex flex-col max-w-[150px]">
                    <span className="text-sm font-bold text-zinc-200 truncate italic">
                        {payment.workspaceName}
                    </span>
                    <span className="text-[10px] text-zinc-500 flex items-center gap-1">
                        <ArrowUpRight className="h-2.5 w-2.5" /> Platform Subscription
                    </span>
                </div>
            )
        },
        {
            key: 'amount',
            header: 'Amount',
            render: (payment: AdminPayment) => (
                <div className="flex flex-col">
                    <span className="text-sm font-black text-zinc-100 tracking-tight">
                        {formatCurrency(payment.amount, payment.currency)}
                    </span>
                    <span className="text-[9px] text-emerald-500 font-bold uppercase tracking-wider">
                        Net Revenue
                    </span>
                </div>
            )
        },
        {
            key: 'status',
            header: 'Status',
            className: "text-center",
            render: (payment: AdminPayment) => (
                <div className="flex justify-center">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold border ${getStatusStyle(payment.status)} uppercase tracking-wider`}>
                        {getStatusIcon(payment.status)}
                        {payment.status}
                    </span>
                </div>
            )
        },
        {
            key: 'method',
            header: 'Payment Method',
            className: "text-right pr-6",
            render: (payment: AdminPayment) => (
                <div className="flex flex-col items-end">
                    <div className="flex items-center gap-2 text-[11px] text-zinc-300 font-bold capitalize">
                        <CreditCard className="h-3.5 w-3.5 text-blue-500/60" />
                        {payment.paymentMethod}
                    </div>
                    <span className="text-[10px] text-zinc-600 font-medium">Stripe Gateway</span>
                </div>
            )
        }
    ];

    return (
        <DashboardLayout>
            <div className="p-6 space-y-6 animate-in fade-in duration-700">
                <div className="flex flex-col space-y-2">
                    <h1 className="text-3xl font-bold tracking-tight text-zinc-100">Sales Report</h1>
                    <p className="text-zinc-500 font-medium">Global transaction auditing and revenue performance tracking.</p>
                </div>

                <Card className="border-white/5 bg-[#141414]/10 shadow-2xl rounded-2xl overflow-hidden border">
                    <CardHeader className="border-b border-white/5 bg-white/1 py-5">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-lg font-bold flex items-center gap-3 text-zinc-100">
                                <Coins className="h-6 w-6 text-blue-500" />
                                Sales Database
                            </CardTitle>
                            <div className="relative flex items-center w-full max-w-sm">
                                <div className="absolute left-3.5 flex items-center pointer-events-none">
                                    <Search className="h-4 w-4 text-zinc-500" />
                                </div>
                                <input
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Search by customer, workspace or ID..."
                                    className="w-full rounded-xl bg-[#0f0f0f] border border-white/10 pl-10 pr-4 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-all duration-300"
                                />
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <Table<AdminPayment>
                                columns={columns}
                                data={payments}
                                emptyText="No transaction records found in the database."
                            />
                        </div>
                    </CardContent>
                </Card>
            </div>
        </DashboardLayout>
    );
};