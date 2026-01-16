import { useGetUsers, useBlockUser, useUnblockUser } from "@/hooks/Admin/AdminHooks"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { User as LucideUser, Shield, ShieldOff, Mail, Phone, Clock, Loader2, AlertCircle, Search } from "lucide-react"
import { useState } from "react"
import toast from "react-hot-toast"
import type { User } from "@/types/user"
import type { AxiosError } from "axios"
import Pagination from "@/components/common/AppPagination"
import { DialogModal } from "@/components/common/DialogModal"

export const UsersPage = () => {
  const [page, setPage] = useState(1)
  const limit = 5
  const [search, setSearch] = useState('')

  const { data, isLoading, isError, error } = useGetUsers({ page, limit, search })

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
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white/2 text-zinc-500 text-[10px] font-bold uppercase tracking-[0.2em]">
                  <th className="px-6 py-4 border-b border-white/5">User Identity</th>
                  <th className="px-6 py-4 border-b border-white/5">Details</th>
                  <th className="px-6 py-4 border-b border-white/5 text-center">Status</th>
                  <th className="px-6 py-4 border-b border-white/5">Joined Date</th>
                  <th className="px-6 py-4 border-b border-white/5 text-right">Management</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {users.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-20 text-center text-zinc-600 font-medium italic">
                      No user records found in the database.
                    </td>
                  </tr>
                ) : (
                  users.map((user: User) => (
                    <tr key={user.id || user._id} className="group hover:bg-white/1 transition-all duration-300">
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-4">
                          <div className="h-11 w-11 rounded-2xl bg-zinc-900 border border-white/5 group-hover:border-blue-500/30 transition-all flex items-center justify-center overflow-hidden shadow-inner">
                            {user.avatarUrl ? (
                              <img src={user.avatarUrl} alt="" className="h-full w-full object-cover" />
                            ) : (
                              <div className="h-full w-full bg-linear-to-br from-blue-600/10 to-indigo-600/10 flex items-center justify-center">
                                <span className="text-sm font-black text-blue-500/80">
                                  {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
                                </span>
                              </div>
                            )}
                          </div>
                          <div>
                            <div className="text-sm font-bold text-zinc-100 group-hover:text-blue-400 transition-colors">
                              {user.firstName} {user.lastName}
                            </div>
                            <div className="text-[11px] text-zinc-500 flex items-center gap-1.5 mt-1 font-medium italic">
                              <Mail className="h-3 w-3 opacity-50" /> {user.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="text-[11px] text-zinc-400 flex items-center gap-2 font-medium">
                          <Phone className="h-3.5 w-3.5 text-zinc-700" />
                          <span className="font-mono">{user.phone || 'N/A'}</span>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex justify-center">
                          {user.isBlocked ? (
                            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/10 text-red-500 border border-red-500/20 text-[9px] font-black uppercase tracking-widest leading-none">
                              <ShieldOff className="h-3 w-3" /> Blocked
                            </div>
                          ) : (
                            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 text-[9px] font-black uppercase tracking-widest leading-none">
                              <Shield className="h-3 w-3" /> Active
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="text-[11px] text-zinc-400 flex items-center gap-2 font-medium">
                          <Clock className="h-3.5 w-3.5 text-zinc-700" />
                          {new Date(user.createdAt).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-5 text-right">
                        <button
                          onClick={() => handleActionClick(user)}
                          disabled={blockMutation.isPending || unblockMutation.isPending}
                          className={`text-[9px] font-black uppercase tracking-[0.15em] px-5 py-2.5 rounded-xl transition-all duration-500 active:scale-95 disabled:opacity-50 ${user.isBlocked
                            ? "bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-white border border-emerald-500/20 shadow-[0_0_20px_rgba(16,185,129,0.1)]"
                            : "bg-red-500/5 text-red-500 hover:bg-red-500 hover:text-white border border-red-500/10 hover:shadow-[0_0_25px_rgba(239,68,68,0.3)]"
                            }`}
                        >
                          {user.isBlocked ? "Unblock Access" : "Block User"}
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
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
