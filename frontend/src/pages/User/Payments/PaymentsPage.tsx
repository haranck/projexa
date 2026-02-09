import DashboardLayout from "../../../components/Layout/DashboardLayout";
import { Table } from "../../../components/common/Table";
import { useSelector } from "react-redux";
import type { RootState } from "../../../store/store";
import { useGetUserWorkspaces, useGetWorkspaceInvoices } from "../../../hooks/Workspace/WorkspaceHooks";
import { useEffect } from "react";
import type { Workspace } from "../../../types/workspace";
import type { Invoice } from "../../../types/invoice";
import {
    ExternalLink,
    CheckCircle2,
    XCircle,
    RefreshCcw,
    FileText,
    ArrowUpRight,
    Loader2
} from "lucide-react";
import { FRONTEND_ROUTES } from "@/constants/frontendRoutes";
import { useNavigate } from "react-router-dom";

export const PaymentsPage = () => {
    const { currentWorkspace } = useSelector((state: RootState) => state.workspace);
    const { data: workspacesData } = useGetUserWorkspaces();
    const navigate = useNavigate()


    const workspaceId = currentWorkspace?._id || currentWorkspace?.id || '';

    const { data: invoicesResponse, isLoading: isLoadingInvoices } = useGetWorkspaceInvoices(workspaceId);

    const selectedWorkspace = workspacesData?.data?.find((ws: Workspace) =>
        (ws._id === workspaceId) || (ws.id === workspaceId)
    );

    const plan = selectedWorkspace?.subscriptionId?.planId;
    const subscription = selectedWorkspace?.subscriptionId;

    const invoices: Invoice[] = invoicesResponse?.data?.invoices || [];


    useEffect(() => {
        console.log('current workspace Name', currentWorkspace?.name);
        console.log('current workspace ID', currentWorkspace);
        console.log('workspacesData', workspacesData);
        console.log('selected workpsace ', selectedWorkspace)
    }, [currentWorkspace]);

    const getStatusStyle = (status: string) => {
        const s = status.toLowerCase();
        if (s === 'paid' || s === 'succeeded') return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
        if (s === 'failed' || s === 'unpaid') return 'bg-red-500/10 text-red-400 border-red-500/20';
        if (s === 'refunded') return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
        return 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20';
    };

    const getStatusIcon = (status: string) => {
        const s = status.toLowerCase();
        if (s === 'paid' || s === 'succeeded') return <CheckCircle2 className="w-3 h-3" />;
        if (s === 'failed' || s === 'unpaid') return <XCircle className="w-3 h-3" />;
        if (s === 'refunded') return <RefreshCcw className="w-3 h-3" />;
        return null;
    };

    const formatCurrency = (amount: number, currency: string) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currency.toUpperCase(),
        }).format(amount);
    };

    return (
        <DashboardLayout>
            <div className="max-w-6xl mx-auto p-8 space-y-10 text-white pb-20">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="space-y-1">
                        <h1 className="text-3xl font-bold tracking-tight">Billing & Payment History</h1>
                        <p className="text-zinc-500 text-sm font-medium">Manage your subscription and view past transactions.</p>
                    </div>
                </div>

                {/* Active Plan Card */}
                {subscription ? (
                    <div className="relative overflow-hidden bg-linear-to-br from-[#0c121e] to-[#080b12] border border-white/5 rounded-3xl p-8 group shadow-2xl animate-fade-in">
                        <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                        </div>

                        <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <div>
                                        <h2 className="text-2xl font-bold">
                                            {plan?.name || "Active Plan"}
                                        </h2>
                                        <h4 className="text-base font-bold mt-2 text-yellow-400">
                                            Workspace: {selectedWorkspace?.name}
                                        </h4>
                                    </div>
                                    <span className="flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full uppercase tracking-wider">
                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse " />
                                        {subscription.status}
                                    </span>
                                </div>

                                <div className="space-y-1">
                                    <p className="text-4xl font-bold text-cyan-400 tracking-tight">
                                        {formatCurrency(plan?.price || 0, 'INR')}
                                        <span className="text-lg text-zinc-500 font-medium tracking-normal">/{plan?.interval || 'mo'}</span>
                                    </p>
                                    <p className="text-xs text-zinc-500 font-medium">Renews on <span className="text-zinc-300">{new Date(subscription.endDate).toLocaleDateString()}</span></p>
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-3">
                                <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white border border-white/10 transition-all font-semibold text-sm"
                                    onClick={() => navigate(FRONTEND_ROUTES.WORKSPACE.SELECT_PLAN, { state: { workspaceName: selectedWorkspace.name, workspaceId: selectedWorkspace._id, isUpgrade: true } })}>
                                    <ArrowUpRight className="w-4 h-4" />
                                    Upgrade Plan
                                </button>

                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="p-8 rounded-3xl border border-white/5 bg-zinc-900/30 border-dashed text-center">
                        <p className="text-zinc-500 text-sm">No active subscription found for this workspace.</p>
                    </div>
                )}

                {/* Payment History Section */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between px-1">
                        <h3 className="text-lg font-bold flex items-center gap-2">
                            <FileText className="w-4 h-4 text-zinc-500" />
                            Payment History
                        </h3>
                        <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Showing historical invoices</p>
                    </div>

                    <div className="bg-[#0c0f16]/50 border border-white/5 rounded-3xl overflow-hidden shadow-xl">
                        {isLoadingInvoices ? (
                            <div className="flex flex-col items-center gap-3 py-12 text-center">
                                <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
                                <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Loading Invoices...</p>
                            </div>
                        ) : (
                            <Table<Invoice>
                                data={invoices}
                                emptyText="No invoice history found for this workspace."
                                columns={[
                                    {
                                        key: 'date',
                                        header: 'Date',
                                        className: 'text-center',
                                        render: (invoice) => (
                                            <span className="font-medium text-zinc-400 group-hover:text-zinc-200 transition-colors">
                                                {new Date(invoice.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                            </span>
                                        )
                                    },
                                    {
                                        key: 'status',
                                        header: 'Status',
                                        render: (invoice) => (
                                            <span className={`flex items-center justify-center gap-1.5 w-fit px-2.5 py-1 text-[10px] font-bold rounded-lg border uppercase tracking-wider ${getStatusStyle(invoice.status)}`}>
                                                {getStatusIcon(invoice.status)}
                                                {invoice.status}
                                            </span>
                                        )
                                    },
                                    {
                                        key: 'amount',
                                        header: 'Amount',
                                        render: (invoice) => (
                                            <span className="font-bold text-white tracking-tight">
                                                {formatCurrency(invoice.amount, invoice.currency)}
                                            </span>
                                        )
                                    },
                                    {
                                        key: 'invoiceId',
                                        header: 'Invoice ID',
                                        className: 'font-mono text-zinc-600 text-[11px]'
                                    },
                                    {
                                        key: 'action',
                                        header: 'Action',
                                        className: 'text-right',
                                        render: (invoice) => (
                                            <div className="flex justify-end">
                                                <button
                                                    onClick={() => window.open(invoice.hostedInvoiceUrl, '_blank')}
                                                    className="inline-flex items-center gap-1.5 text-[10px] font-bold text-zinc-500 hover:text-white transition-all bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-lg border border-white/5 group-hover:border-white/10"
                                                >
                                                    View Invoice
                                                    <ExternalLink className="w-3 h-3" />
                                                </button>
                                            </div>
                                        )
                                    }
                                ]}
                            />
                        )}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};
