import { CreateWorkspaceForm } from "@/components/Workspace/CreateWorkspaceForm"

export const CreateWorkspacePage = () => {
  return (
    <div className="min-h-screen relative flex flex-col items-center justify-center overflow-x-hidden bg-[#0a0a0a] p-4 font-sans">
      {/* Background Glows */}
      <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[20%] right-[-10%] w-[60%] h-[60%] bg-emerald-500/10 rounded-full blur-[140px]" />
        <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] bg-blue-400/5 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 w-full max-w-xl">
        <CreateWorkspaceForm />
      </div>
    </div>
  )
}
