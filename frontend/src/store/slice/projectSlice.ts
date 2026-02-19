import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface Project {
    _id: string;
    projectName: string;
    workspaceId: string
}

interface ProjectState {
    projects: Project[];
    currentProject: Project | null
}

const initialState: ProjectState = {
    projects: [],
    currentProject: null
}

const projectSlice = createSlice({
    name: 'project',
    initialState,
    reducers: {
        setProjects: (state, action: PayloadAction<Project[]>) => {
            state.projects = action.payload
        },
        setCurrentProject: (state, action: PayloadAction<Project | null>) => {
            state.currentProject = action.payload
        }
    }
})

export const { setProjects, setCurrentProject } = projectSlice.actions;
export default projectSlice.reducer;