import { useGetUsers, useBlockUser, useUnblockUser } from "@/hooks/Admin/AdminHooks"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { User as LucideUser, Shield, ShieldOff, Mail, Phone, Clock, Loader2, AlertCircle, Search } from "lucide-react"
import { useState } from "react"
import toast from "react-hot-toast"
import type { User } from "@/types/user"
import type { AxiosError } from "axios"
import Pagination from "@/components/common/AppPagination"
import { DialogModal } from "@/components/common/DialogModal"
import { Table } from "@/components/common/Table"
import { useDebounce } from "@/hooks/common/useDebounce"

export const UsersPage = () => {
  const [page, setPage] = useState(1)
  const limit = 5
  const [search, setSearch] = useState('')

  const debouncedSearch = useDebounce(search, 500)

  const { data, isLoading, isError, error } = useGetUsers({ page, limit, search: debouncedSearch })

  const blockMutation = useBlockUser()
  const unblockMutation = useUnblockUser()

  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  if (isLoading) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center space-y-4">
        <Loader2 className="h-10 w-10 animate-spin text-blue-500" />
        <p className="text-zinc-400 font-medium animate-pulse">Fetching platform users...</p>
      </div>
    )
  }

  if (isError) {
    const axiosError = error as AxiosError<{ message: string }>;
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center space-y-4 px-4 text-center">
        <div className="bg-red-500/10 p-4 rounded-full">
          <AlertCircle className="h-10 w-10 text-red-500" />
        </div>
        <h3 className="text-xl font-bold text-zinc-100 italic">Authentication Error</h3>
        <p className="text-zinc-400 max-w-md">
          {axiosError.response?.status === 401
            ? "Your session has expired. Please log in again to continue."
            : axiosError.response?.data?.message || axiosError.message}
        </p>
      </div>
    )
  }

  const users = data?.data?.data || []
  const meta = data?.data?.meta

  const handleActionClick = (user: User) => {
    setSelectedUser(user)
    setIsDialogOpen(true)
  }

  const confirmAction = async () => {
    if (!selectedUser) return

    const action = selectedUser.isBlocked ? unblockMutation : blockMutation
    const label = selectedUser.isBlocked ? "Unblocking" : "Blocking"

    const toastId = toast.loading(`${label} user...`)

    try {
      await action.mutateAsync({ userId: (selectedUser.id || selectedUser._id) as string })
      toast.success(`User successfully ${selectedUser.isBlocked ? 'unblocked' : 'blocked'}`, { id: toastId })
      setIsDialogOpen(false)
      setSelectedUser(null)
    } catch (err: unknown) {
      const axiosErr = err as AxiosError<{ message: string }>;
      toast.error(axiosErr.response?.data?.message || "Action failed", { id: toastId })
    }
  }

  const columns = [
    {
      key: "identity",
      header: "User Identity",
      render: (user: User) => (
        <div className="flex items-center gap-4">
          <div className="h-11 w-11 rounded-2xl bg-zinc-900 border border-white/5 flex items-center justify-center overflow-hidden">
            {user.avatarUrl ? (
              <img src={user.avatarUrl} className="h-full w-full object-cover" />
            ) : (
              <span className="text-sm font-black text-blue-500/80">
                {user.firstName?.[0]}
                {user.lastName?.[0]}
              </span>
            )}
          </div>

          <div>
            <div className="text-sm font-bold text-zinc-100">
              {user.firstName} {user.lastName}
            </div>
            <div className="text-[11px] text-zinc-500 flex items-center gap-1.5 mt-1 italic">
              <Mail className="h-3 w-3" /> {user.email}
            </div>
          </div>
        </div>
      ),
    },
    {
      key: "phone",
      header: "Details",
      render: (user: User) => (
        <div className="text-[11px] text-zinc-400 flex items-center gap-2">
          <Phone className="h-3.5 w-3.5" />
          {user.phone || "N/A"}
        </div>
      ),
    },
    {
      key: "status",
      header: "Status",
      className: "text-center",
      render: (user: User) => (
        <div className="flex justify-center">
          {user.isBlocked ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-red-500/10 text-red-500 border border-red-500/20 shadow-sm shadow-red-500/10">
              <ShieldOff className="h-3 w-3" /> Blocked
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 shadow-sm shadow-emerald-500/10">
              <Shield className="h-3 w-3" /> Active
            </span>
          )}
        </div>
      ),
    },
    {
      key: "createdAt",
      header: "Joined Date",
      render: (user: User) => (
        <div className="text-[11px] text-zinc-400 flex items-center gap-2">
          <Clock className="h-3.5 w-3.5" />
          {new Date(user.createdAt).toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          })}
        </div>
      ),
    },
    {
      key: "actions",
      header: "Management",
      className: "text-right",
      render: (user: User) => (
        <button
          onClick={() => handleActionClick(user)}
          className={`
            relative overflow-hidden group/btn px-4 py-1.5 rounded-lg text-xs font-medium transition-all duration-300
            ${user.isBlocked
              ? 'bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 border border-emerald-500/20 shadow-emerald-500/10'
              : 'bg-red-500/10 text-red-500 hover:bg-red-500/20 border border-red-500/20 shadow-red-500/10'
            }
            border shadow-lg backdrop-blur-sm
          `}
        >
          <span className="relative z-10 flex items-center gap-1.5">
            {user.isBlocked ? (
              <>
                Unlock Access
              </>
            ) : (
              <>
                Block User
              </>
            )}
          </span>
        </button>
      ),
    },
  ]


  return (
    <div className="p-6 space-y-6 animate-in fade-in duration-700">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-zinc-100">User Management</h1>
        <p className="text-zinc-500 font-medium">Monitor and manage all system users from this central repository.</p>
      </div>

      <Card className="border-white/5 bg-[#141414]/10 shadow-2xl rounded-2xl overflow-hidden border">
        <CardHeader className="border-b border-white/5 bg-white/1 py-5">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-bold flex items-center gap-2 text-zinc-100">
              <LucideUser className="h-5 w-5 text-blue-500" />
              Users Database
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
                placeholder="Search users by name or email..."
                className="w-full rounded-xl bg-[#0f0f0f] border border-white/10 pl-10 pr-4 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-all duration-300"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table columns={columns} data={users} emptyText="No user records found in the database." />
          </div>
        </CardContent>
      </Card>

      {meta && <Pagination page={page} totalPages={meta.totalPages} onPageChange={setPage} />}

      <DialogModal
        isDialogOpen={isDialogOpen}
        setIsDialogOpen={setIsDialogOpen}
        selectedUser={selectedUser}
        isProcessing={blockMutation.isPending || unblockMutation.isPending}
        confirmAction={confirmAction}
      />
    </div>
  )
}
