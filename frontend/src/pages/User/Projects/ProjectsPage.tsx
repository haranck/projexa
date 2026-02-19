import { useState, useEffect } from 'react';
import DashboardLayout from "../../../components/Layout/DashboardLayout";
import { useGetAllProjects, useDeleteProject } from "../../../hooks/Project/ProjectHooks";
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from "../../../store/store";
import {
    Plus,
    Search,
    Edit2,
    Trash2,
    Folder,
    Calendar,
    ChevronLeft,
    ChevronRight,
    Loader2
} from 'lucide-react';
import { CreateProjectModal } from "../../../components/modals/CreateProjectModal";
import { EditProjectModal } from "../../../components/modals/EditProjectModal";
import { DeleteConfirmationModal } from "../../../components/modals/DeleteConfirmationModal";
import { ProjectMembersModal } from "../../../components/modals/ProjectMembersModal";
import type { Project } from "../../../types/project";
import { toast } from 'react-hot-toast';
import { getErrorMessage } from '@/utils/errorHandler';
import { setProjects, setCurrentProject } from '@/store/slice/projectSlice';

export const ProjectsPage = () => {
    const { currentWorkspace } = useSelector((state: RootState) => state.workspace);
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [editProject, setEditProject] = useState<Project | null>(null);
    const [viewMembersProjectId, setViewMembersProjectId] = useState<string | null>(null);
    const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);
    const dispatch = useDispatch()

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(search);
            setPage(1);
        }, 500);
        return () => clearTimeout(timer);
    }, [search]);

    const { currentProject } = useSelector((state: RootState) => state.project);
    const { data: projectsResponse, isLoading, isError } = useGetAllProjects({
        workspaceId: currentWorkspace?._id || currentWorkspace?.id || '',
        page,
        limit: 5,
        search: debouncedSearch
    });

    const projectsData = projectsResponse?.data;
    const projects = projectsData?.projects || [];
    const totalPages = projectsData?.totalPages || 0;
    console.log(projectsData)
    useEffect(() => {
        if (projectsData?.projects) {
            dispatch(setProjects(projectsData.projects))
            if (!currentProject && projectsData.projects) {
                dispatch(setCurrentProject(projectsData.projects[0]))
            }
        }
    }, [projectsData])


    const viewMembersProject = projects.find((p: Project) => p._id === viewMembersProjectId) || null;

    const deleteProjectMutation = useDeleteProject();

    const handleDeleteProject = () => {
        if (!projectToDelete) return;

        deleteProjectMutation.mutate(projectToDelete._id, {
            onSuccess: () => {
                toast.success("Project deleted successfully");
                setProjectToDelete(null);
            },
            onError: (err) => {
                const error = getErrorMessage(err);
                toast.error(error || "Failed to delete project");
            }
        });
    };

    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setPage(newPage);
        }
    };

    return (
        <DashboardLayout>
            <div className="p-8 space-y-8 min-h-screen bg-[#101017]">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <h1 className="text-3xl font-bold text-white tracking-tight">Projects</h1>
                        <p className="text-zinc-400 mt-1">Manage and track your team&apos;s projects</p>
                    </div>
                    <button
                        onClick={() => setIsCreateModalOpen(true)}
                        className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold shadow-lg shadow-blue-600/20 transition-all active:scale-95 group"
                    >
                        <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
                        Create Project
                    </button>
                </div>

                {/* Filters & Search */}
                <div className="flex items-center justify-between">
                    <div className="relative w-full max-w-md group">
                        <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${search !== debouncedSearch ? 'text-blue-500' : 'text-zinc-500'}`} />
                        <input
                            type="text"
                            placeholder="Search projects..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full bg-zinc-900/50 border border-white/5 rounded-xl text-white placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-blue-500/40 focus:border-blue-500/40 px-10 py-2.5 text-sm transition-all"
                        />
                        {search !== debouncedSearch && (
                            <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />
                            </div>
                        )}
                    </div>
                </div>

                {/* Content */}
                {isLoading ? (
                    <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="h-32 bg-zinc-900/50 rounded-2xl animate-pulse border border-white/5" />
                        ))}
                    </div>
                ) : isError ? (
                    <div className="text-center py-20">
                        <p className="text-red-400 font-bold">Failed to load projects</p>
                        <button
                            onClick={() => window.location.reload()}
                            className="mt-4 text-blue-500 hover:underline"
                        >
                            Retry
                        </button>
                    </div>
                ) : projects.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-32 text-center bg-zinc-900/20 rounded-[2rem] border border-white/5 border-dashed">
                        <div className="w-16 h-16 bg-zinc-900 rounded-2xl flex items-center justify-center mb-6 shadow-inner">
                            <Folder className="w-8 h-8 text-zinc-600" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">No projects found</h3>
                        <p className="text-zinc-500 max-w-sm mx-auto mb-8">
                            {search ? "Try adjusting your search terms" : "Get started by creating your first projectworkspace"}
                        </p>
                        {!search && (
                            <button
                                onClick={() => setIsCreateModalOpen(true)}
                                className="px-6 py-2.5 bg-white/5 hover:bg-white/10 text-white rounded-xl font-bold transition-all"
                            >
                                Create Project
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="space-y-4">
                        {projects.map((project: Project) => (
                            <div
                                key={project._id}
                                onClick={() => dispatch(setCurrentProject(project))}
                                className={`group relative border rounded-[2rem] p-8 transition-all flex flex-col md:flex-row md:items-center justify-between gap-6 cursor-pointer ${currentProject?._id === project._id
                                    ? 'bg-blue-600/5 border-blue-500/30 shadow-lg shadow-blue-500/5'
                                    : 'bg-zinc-900/40 hover:bg-zinc-900/60 border-white/5 hover:border-white/10'
                                    }`}
                            >
                                <div className="flex-1 space-y-4">
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-3">
                                            <h3 className={`text-xl font-bold tracking-tight transition-colors ${currentProject?._id === project._id ? 'text-blue-400' : 'text-white group-hover:text-blue-400'
                                                }`}>
                                                {project.projectName}
                                            </h3>
                                            {currentProject?._id === project._id && (
                                                <span className="px-2 py-0.5 rounded-full bg-blue-500 text-[9px] font-black text-white uppercase tracking-widest shadow-[0_0_10px_rgba(59,130,246,0.5)]">
                                                    Current Project
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-sm text-zinc-500 line-clamp-2 max-w-2xl font-medium">
                                            Key : {project.key || "No key provided."}
                                        </p>
                                        <p className="text-sm text-zinc-500 line-clamp-2 max-w-2xl font-medium">
                                            {project.description || "No description provided."}
                                        </p>
                                    </div>

                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center gap-2 text-[10px] font-bold text-zinc-600 uppercase tracking-widest bg-zinc-950/50 px-3 py-1.5 rounded-lg border border-white/5">
                                            <Calendar className="w-3.5 h-3.5 text-zinc-700 shrink-0" />
                                            <span>Created {new Date(project.createdAt).toLocaleDateString('en-US', {
                                                month: 'short',
                                                day: 'numeric',
                                                year: 'numeric'
                                            })}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={() => setViewMembersProjectId(project._id)}
                                        className="px-4 py-1.5 rounded-full border border-blue-500/30 text-blue-400 text-xs font-medium hover:bg-blue-500/10 transition-colors"
                                    >
                                        View Members
                                    </button>
                                    <div className="flex items-center gap-1">
                                        <button
                                            onClick={() => setEditProject(project)}
                                            className="p-2 hover:bg-white/10 rounded-lg text-zinc-400 hover:text-white transition-colors"
                                            title="Edit Project"
                                        >
                                            <Edit2 className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => setProjectToDelete(project)}
                                            className="p-2 hover:bg-white/10 rounded-lg text-zinc-400 hover:text-white transition-colors"
                                            title="Delete Project"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex items-center justify-center gap-4 pt-8">
                        <button
                            onClick={() => handlePageChange(page - 1)}
                            disabled={page === 1}
                            className="p-2 rounded-xl bg-zinc-900 border border-white/5 text-zinc-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:bg-white/5"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>

                        <div className="flex items-center gap-2">
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                                <button
                                    key={p}
                                    onClick={() => handlePageChange(p)}
                                    className={`w-9 h-9 rounded-xl text-sm font-bold transition-all ${page === p
                                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                                        : 'bg-zinc-900 border border-white/5 text-zinc-400 hover:bg-white/5 hover:text-white'
                                        }`}
                                >
                                    {p}
                                </button>
                            ))}
                        </div>

                        <button
                            onClick={() => handlePageChange(page + 1)}
                            disabled={page === totalPages}
                            className="p-2 rounded-xl bg-zinc-900 border border-white/5 text-zinc-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:bg-white/5"
                        >
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                )}
            </div>

            <CreateProjectModal
                open={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
            />

            <EditProjectModal
                open={!!editProject}
                onClose={() => setEditProject(null)}
                project={editProject}
            />

            <DeleteConfirmationModal
                open={!!projectToDelete}
                onClose={() => setProjectToDelete(null)}
                onConfirm={handleDeleteProject}
                projectName={projectToDelete?.projectName || ''}
                isDeleting={deleteProjectMutation.isPending}
            />

            <ProjectMembersModal
                open={!!viewMembersProjectId}
                onClose={() => setViewMembersProjectId(null)}
                project={viewMembersProject}
            />
        </DashboardLayout>
    );
};
