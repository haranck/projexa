import { IssueType } from "../../../domain/enums/IssueEnums";

export interface DashboardStatsDTO {
    totalIssues: number;
    completedIssues: number;
    activeSprintsCount: number;
    memberCount: number;
    completionRate: number;
}

export interface IssueDistributionDTO {
    type: IssueType;
    count: number;
}

export interface ModuleProgressDTO {
    sprintName: string;
    completedPoints: number;
    totalPoints: number;
    percentage: number;
    todoCount: number;
    inProgressCount: number;
    doneCount: number;
}

export interface SprintSummaryDTO {
    id: string;
    name: string;
    status: string;
    progress: number;
}

export interface DashboardDataResponseDTO {
    stats: DashboardStatsDTO;
    distribution: IssueDistributionDTO[];
    progress: ModuleProgressDTO | null;
    recentSprints: SprintSummaryDTO[];
}
