import { Table } from "@/components/common/Table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Loader2,
    CheckCircle2,
    XCircle,
    RefreshCcw,
    CreditCard,
    Coins,
    Calendar,
    Search,
    AlertCircle,
    CalendarDays,
    X,
    Download
} from "lucide-react";
import { useState, useMemo } from "react";
import { useDebounce } from "@/hooks/common/useDebounce";
import Pagination from "@/components/common/AppPagination";
import { useGetAdminPayments, useExportAdminPaymentsPDF } from "@/hooks/Admin/AdminHooks";
import type { AxiosError } from "axios";
import { toast } from "react-hot-toast";

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

type DateFilterType = 'all' | 'month' | 'year' | 'custom';

export const SalesReport = () => {
    const [page, setPage] = useState(1);
    const limit = 5;
    const [search, setSearch] = useState('');
    const debouncedSearch = useDebounce(search, 500);

    // Date filter state
    const [dateFilter, setDateFilter] = useState<DateFilterType>('all');
    const [customStartDate, setCustomStartDate] = useState('');
    const [customEndDate, setCustomEndDate] = useState('');

    // Calculate date range based on filter type
    const { startDate, endDate } = useMemo(() => {
        const now = new Date();

        switch (dateFilter) {
            case 'month': {
                const start = new Date(now.getFullYear(), now.getMonth(), 1);
                const end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
                return {
                    startDate: start.toISOString(),
                    endDate: end.toISOString()
                };
            }
            case 'year': {
                const start = new Date(now.getFullYear(), 0, 1);
                const end = new Date(now.getFullYear(), 11, 31, 23, 59, 59);
                return {
                    startDate: start.toISOString(),
                    endDate: end.toISOString()
                };
            }
            case 'custom': {
                if (customStartDate && customEndDate) {
                    return {
                        startDate: new Date(customStartDate).toISOString(),
                        endDate: new Date(customEndDate + 'T23:59:59').toISOString()
                    };
                }
                return { startDate: undefined, endDate: undefined };
            }
            default:
                return { startDate: undefined, endDate: undefined };
        }
    }, [dateFilter, customStartDate, customEndDate]);

    const { data: paymentsResponse, isLoading, isError, error } = useGetAdminPayments({
        page,
        limit,
        search: debouncedSearch || undefined,
        startDate,
        endDate
    });

    const handleDateFilterChange = (filter: DateFilterType) => {
        setDateFilter(filter);
        setPage(1);
        if (filter !== 'custom') {
            setCustomStartDate('');
            setCustomEndDate('');
        }
    };

    const handleClearFilter = () => {
        setDateFilter('all');
        setCustomStartDate('');
        setCustomEndDate('');
        setPage(1);
    };

    const exportMutation = useExportAdminPaymentsPDF();

    const handleDownloadPDF = async () => {
        try {
            const blob = await exportMutation.mutateAsync({
                search: debouncedSearch || undefined,
                startDate,
                endDate
            });

            // Create download link
            const url = window.URL.createObjectURL(new Blob([blob]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `sales-report-${new Date().toISOString().split('T')[0]}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);

            toast.success("Sales report downloaded successfully");
        } catch (err) {
            console.error("PDF Export error:", err);
            toast.error("Failed to download sales report");
        }
    };

    if (isLoading) {
        return (
            <div className="flex h-[60vh] flex-col items-center justify-center space-y-4">
                <Loader2 className="h-10 w-10 animate-spin text-blue-500" />
                <p className="text-zinc-400 font-medium animate-pulse">Fetching platform sales data...</p>
            </div>
        );
    }

    if (isError) {
        const axiosError = error as AxiosError<{ message: string }>;
        return (
            <div className="flex h-[60vh] flex-col items-center justify-center space-y-4 px-4 text-center">
                <div className="bg-red-500/10 p-4 rounded-full">
                    <AlertCircle className="h-10 w-10 text-red-500" />
                </div>
                <h3 className="text-xl font-bold text-zinc-100 italic">Data Access Error</h3>
                <p className="text-zinc-400 max-w-md">
                    {axiosError.response?.status === 401
                        ? "Your session has expired. Please log in again to continue."
                        : axiosError.response?.data?.message || axiosError.message}
                </p>
            </div>
        );
    }

    const payments: AdminPayment[] = paymentsResponse?.data?.data || [];
    const meta = paymentsResponse?.data?.meta || { totalDocs: 0, totalPages: 0, page: 1, limit: 5 };

    const getStatusStyle = (status: string) => {
        const s = status.toLowerCase();
        if (s === 'paid' || s === 'succeeded') return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
        if (s === 'failed' || s === 'unpaid') return 'bg-red-500/10 text-red-500 border-red-500/20';
        if (s === 'refunded') return 'bg-purple-500/10 text-purple-500 border-purple-500/20';
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

    const columns = [
        {
            key: 'date',
            header: 'Date',
            render: (payment: AdminPayment) => (
                <div className="flex items-center gap-2 text-xs text-zinc-300">
                    <Calendar className="h-3.5 w-3.5 text-zinc-500" />
                    <span>
                        {new Date(payment.paidAt).toLocaleDateString('en-IN', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric'
                        })}
                    </span>
                </div>
            )
        },
        {
            key: 'customer',
            header: 'Customer Name',
            render: (payment: AdminPayment) => (
                <div className="text-sm font-medium text-zinc-100">
                    {payment.userName}
                </div>
            )
        },
        {
            key: 'workspace',
            header: 'Workspace',
            render: (payment: AdminPayment) => (
                <div className="text-sm text-zinc-300 truncate max-w-[150px]">
                    {payment.workspaceName}
                </div>
            )
        },
        {
            key: 'amount',
            header: 'Amount',
            render: (payment: AdminPayment) => (
                <div className="text-sm font-semibold text-emerald-400">
                    {formatCurrency(payment.amount, payment.currency)}
                </div>
            )
        },
        {
            key: 'status',
            header: 'Status',
            className: "text-center",
            render: (payment: AdminPayment) => (
                <div className="flex justify-center">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-medium border ${getStatusStyle(payment.status)}`}>
                        {getStatusIcon(payment.status)}
                        {payment.status.charAt(0).toUpperCase() + payment.status.slice(1).toLowerCase()}
                    </span>
                </div>
            )
        },
        {
            key: 'invoice',
            header: 'Invoice No',
            render: (payment: AdminPayment) => (
                <div className="text-xs text-zinc-400 font-mono">
                    {payment.invoiceId.slice(0, 12)}...
                </div>
            )
        },
        {
            key: 'method',
            header: 'Payment Method',
            className: "text-right",
            render: (payment: AdminPayment) => (
                <div className="flex items-center justify-end gap-1.5 text-xs text-zinc-300">
                    <CreditCard className="h-3.5 w-3.5 text-blue-500/60" />
                    <span className="capitalize">{payment.paymentMethod}</span>
                </div>
            )
        }
    ];

    return (
        <div className="p-6 space-y-6 animate-in fade-in duration-700">
            <div className="flex flex-col space-y-2">
                <h1 className="text-3xl font-bold tracking-tight text-zinc-100">Sales Report</h1>
                <p className="text-zinc-500 font-medium">Monitor and audit all system transactions and revenue performance.</p>
            </div>

            <Card className="border-white/5 bg-[#141414]/10 shadow-2xl rounded-2xl overflow-hidden border">
                <CardHeader className="border-b border-white/5 bg-white/1 py-5">
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-lg font-bold flex items-center gap-2 text-zinc-100">
                                <Coins className="h-5 w-5 text-blue-500" />
                                Sales Database
                                <span className="text-sm font-normal text-zinc-500">
                                    ({meta.totalDocs} {meta.totalDocs === 1 ? 'record' : 'records'})
                                </span>
                            </CardTitle>
                            <div className="relative flex items-center w-full max-w-sm">
                                <div className="absolute left-3.5 flex items-center pointer-events-none">
                                    <Search className="h-4 w-4 text-zinc-500" />
                                </div>
                                <input
                                    value={search}
                                    onChange={(e) => {
                                        setSearch(e.target.value);
                                        setPage(1);
                                    }}
                                    placeholder="Search by customer, workspace or ID..."
                                    className="w-full rounded-xl bg-[#0f0f0f] border border-white/10 pl-10 pr-4 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-all duration-300 "
                                />
                            </div>
                            <button
                                onClick={handleDownloadPDF}
                                disabled={exportMutation.isPending || payments.length === 0}
                                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-500 hover:bg-blue-600 disabled:bg-blue-500/50 disabled:cursor-not-allowed text-white text-sm font-semibold transition-all shadow-lg shadow-blue-500/20"
                            >
                                {exportMutation.isPending ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                    <Download className="h-4 w-4" />
                                )}
                                Export PDF
                            </button>
                        </div>

                        {/* Date Filter in Header */}
                        <div className="flex flex-wrap items-center gap-2">
                            <button
                                onClick={() => handleDateFilterChange('all')}
                                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${dateFilter === 'all'
                                    ? 'bg-blue-500 text-white'
                                    : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
                                    }`}
                            >
                                All Time
                            </button>
                            <button
                                onClick={() => handleDateFilterChange('month')}
                                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${dateFilter === 'month'
                                    ? 'bg-blue-500 text-white'
                                    : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
                                    }`}
                            >
                                This Month
                            </button>
                            <button
                                onClick={() => handleDateFilterChange('year')}
                                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${dateFilter === 'year'
                                    ? 'bg-blue-500 text-white'
                                    : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
                                    }`}
                            >
                                This Year
                            </button>
                            <button
                                onClick={() => handleDateFilterChange('custom')}
                                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${dateFilter === 'custom'
                                    ? 'bg-blue-500 text-white'
                                    : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
                                    }`}
                            >
                                <CalendarDays className="h-3.5 w-3.5" />
                                Custom Range
                            </button>

                            {dateFilter === 'custom' && (
                                <>
                                    <input
                                        type="date"
                                        value={customStartDate}
                                        onChange={(e) => {
                                            setCustomStartDate(e.target.value);
                                            setPage(1);
                                        }}
                                        className="px-3 py-1.5 rounded-lg bg-zinc-800 border border-white/10 text-xs text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                                    />
                                    <span className="text-zinc-500 text-xs">to</span>
                                    <input
                                        type="date"
                                        value={customEndDate}
                                        onChange={(e) => {
                                            setCustomEndDate(e.target.value);
                                            setPage(1);
                                        }}
                                        className="px-3 py-1.5 rounded-lg bg-zinc-800 border border-white/10 text-xs text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                                    />
                                    <button
                                        onClick={handleClearFilter}
                                        className="px-3 py-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 text-xs font-medium transition-all flex items-center gap-1.5"
                                    >
                                        <X className="h-3.5 w-3.5" />
                                        Clear
                                    </button>
                                </>
                            )}
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

            {meta.totalPages > 1 && (
                <Pagination
                    page={page}
                    totalPages={meta.totalPages}
                    onPageChange={setPage}
                />
            )}
        </div>
    );
};
