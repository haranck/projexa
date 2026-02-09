import { useForm } from "react-hook-form"
import { workspaceSchema, type WorkspaceSchemaType } from "@/lib/validations/workspace.schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { useCreateWorkspace } from "@/hooks/Workspace/WorkspaceHooks"
import { useNavigate } from "react-router-dom"
import { toast } from 'react-hot-toast'
import { FRONTEND_ROUTES } from "@/constants/frontendRoutes"
import { WORKSPACE_ERRORS } from "@/constants/errorMessages"
import { Loader2, ArrowRight, ArrowLeft } from "lucide-react"
import { cn } from "@/lib/utils"

export const CreateWorkspaceForm = () => {
  const navigate = useNavigate()
  const { mutate: createWorkspace, isPending: createWorkspacePending } = useCreateWorkspace()
  const { register, handleSubmit, formState: { errors } } = useForm<WorkspaceSchemaType>({
    resolver: zodResolver(workspaceSchema),
    defaultValues: {
      workspaceName: "",
      description: "",
    }
  })

  const onSubmit = (data: WorkspaceSchemaType) => {
    createWorkspace(data, {
      onSuccess: () => {
        toast.success("Workspace created successfully!")
        navigate(FRONTEND_ROUTES.WORKSPACE.SELECT_PLAN, { state: { workspaceName: data.workspaceName } })
      },
      onError: (error) => { 
        console.log("Create Workspace Failed:", error)
        toast.error(WORKSPACE_ERRORS.WORKSPACE_CREATION_FAILED)
      }
    })
  }

  return (

    <div className="w-full max-w-md mx-auto" >

      <div className="flex flex-col items-center mb-8">
        <ArrowLeft className="w-5 h-5 group-hover:translate-x-1 transition-transform absolute top-[-50px] left-[-350px]" onClick={() => navigate(FRONTEND_ROUTES.HOME)} />
        <div className="w-16 h-16 bg-[#00ff88] rounded-full flex items-center justify-center mb-4 shadow-[0_0_20px_rgba(0,255,136,0.3)]">
          <div className="w-8 h-8 bg-black/20 rounded-full" />
        </div>
        <h1 className="text-2xl font-bold text-white mb-2">Workspace Details</h1>
        <p className="text-zinc-500 text-sm">Set up your workspace to get started</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-2">
          <label className="text-zinc-400 text-xs font-medium uppercase tracking-wider">Workspace Name</label>
          <input
            {...register("workspaceName")}
            placeholder="MySpace"
            className={cn(
              "w-full bg-[#0d1117] border border-zinc-800 focus:border-[#4dabf7]/50 focus:ring-1 focus:ring-[#4dabf7]/20 rounded-xl px-4 py-3 text-white transition-all outline-none",
              errors.workspaceName && "border-red-500/50"
            )}
          />
          {errors.workspaceName && <p className="text-red-500 text-[10px] mt-1">{errors.workspaceName.message}</p>}
        </div>

        <div className="space-y-2">
          <label className="text-zinc-400 text-xs font-medium uppercase tracking-wider">Description</label>
          <textarea
            {...register("description")}
            rows={4}
            className={cn(
              "w-full bg-[#0d1117] border border-zinc-800 focus:border-[#4dabf7]/50 focus:ring-1 focus:ring-[#4dabf7]/20 rounded-xl px-4 py-3 text-white transition-all outline-none resize-none",
              errors.description && "border-red-500/50"
            )}
          />
          {errors.description && <p className="text-red-500 text-[10px] mt-1">{errors.description.message}</p>}
        </div>

        {/* <div className="space-y-2">
          <label className="text-zinc-400 text-xs font-medium uppercase tracking-wider">Workspace Type</label>
          <Controller
            control={control}
            name="workspaceType"
            render={({ field }) => (
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => field.onChange("individual")}
                  className={cn(
                    "flex flex-col items-center justify-center gap-2 p-4 rounded-xl border transition-all duration-300 bg-[#0d1117]",
                    field.value === "individual"
                      ? "border-[#4dabf7] bg-[#4dabf7]/5 shadow-[0_0_15px_rgba(77,171,247,0.1)]"
                      : "border-zinc-800 hover:border-zinc-700"
                  )}
                >
                  <User className={cn("w-6 h-6", field.value === "individual" ? "text-[#4dabf7]" : "text-zinc-500")} />
                  <span className={cn("text-xs font-bold", field.value === "individual" ? "text-white" : "text-zinc-500")}>Individual</span>
                </button>
                <button
                  type="button"
                  onClick={() => field.onChange("company")}
                  className={cn(
                    "flex flex-col items-center justify-center gap-2 p-4 rounded-xl border transition-all duration-300 bg-[#0d1117]",
                    field.value === "company"
                      ? "border-[#4dabf7] bg-[#4dabf7]/5 shadow-[0_0_15px_rgba(77,171,247,0.1)]"
                      : "border-zinc-800 hover:border-zinc-700"
                  )}
                >
                  <Building2 className={cn("w-6 h-6", field.value === "company" ? "text-blue-500" : "text-zinc-500")} />
                  <span className={cn("text-xs font-bold", field.value === "company" ? "text-white" : "text-zinc-500")}>Company</span>
                </button>
              </div>
            )}
          />
          {errors.workspaceType && <p className="text-red-500 text-[10px] mt-1">{errors.workspaceType.message}</p>}
        </div> */}

        <button
          type="submit"
          disabled={createWorkspacePending}
          className="w-full bg-[#00ff88] hover:bg-[#00e67a] disabled:opacity-50 text-black font-bold h-12 rounded-xl flex items-center justify-center gap-2 transition-all duration-300 mt-8 group active:scale-[0.98]"
        >
          {createWorkspacePending ? (
            <Loader2 className="animate-spin w-5 h-5" />
          ) : (
            <>
              <span>Create Workspace</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </button>
      </form>
    </div>
  )
}
