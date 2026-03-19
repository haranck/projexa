import { injectable } from "tsyringe";
import { IssueModel } from "../../models/Issue/IssueModel";
import { IDashboardRepository } from "../../../../../domain/interfaces/repositories/DashboardRepo/IDashboardRepository";
import { SprintModel } from "../../models/Sprint/SprintModel";
import { IssueStatus } from "../../../../../domain/enums/IssueEnums";
import { SprintStatus } from "../../../../../domain/enums/SprintStatus";
import { DashboardStatsDTO, IssueDistributionDTO, ModuleProgressDTO, SprintSummaryDTO } from "../../../../../application/dtos/dashboard/DashboardResponseDTO";
import { ProjectMemberModel } from "../../models/Project/ProjectMemberModel";
import { Types } from "mongoose";

@injectable()
export class DashboardRepository implements IDashboardRepository {
    async getStats(projectId: string): Promise<DashboardStatsDTO> {
        const totalIssues = await IssueModel.countDocuments({ projectId });
        const completedIssues = await IssueModel.countDocuments({ 
            projectId, 
            status: IssueStatus.DONE 
        });
        const activeSprintsCount = await SprintModel.countDocuments({ 
            projectId, 
            status: SprintStatus.ACTIVE 
        });
        const memberCount = await ProjectMemberModel.countDocuments({ projectId: new Types.ObjectId(projectId) });

        return {
            totalIssues,
            completedIssues,
            activeSprintsCount,
            memberCount,
            completionRate: totalIssues > 0 ? Math.round((completedIssues / totalIssues) * 100) : 0
        };
    }

    async getIssueDistribution(projectId: string): Promise<IssueDistributionDTO[]> {
        return await IssueModel.aggregate([
            { $match: { projectId } },
            { $group: { _id: "$issueType", count: { $sum: 1 } } },
            { $project: { type: "$_id", count: 1, _id: 0 } }
        ]);
    }

    async getModuleProgress(projectId: string, userId?: string): Promise<ModuleProgressDTO | null> {
        const activeSprint = await SprintModel.findOne({ 
            projectId, 
            status: SprintStatus.ACTIVE 
        });
        if (!activeSprint) return null;

        const query: Record<string, string> = { sprintId: activeSprint._id.toString() };
        if (userId) {
            query.assigneeId = userId;
        }

        const issues = await IssueModel.find(query);
        const totalIssues = issues.length;
        const completedIssues = issues.filter(i => i.status === IssueStatus.DONE).length;
        const todoIssues = issues.filter(i => i.status === IssueStatus.TODO).length;
        const inProgressIssues = issues.filter(i => i.status === IssueStatus.IN_PROGRESS).length;

        return {
            sprintName: activeSprint.name,
            completedPoints: completedIssues,
            totalPoints: totalIssues,
            percentage: totalIssues > 0 ? Math.round((completedIssues / totalIssues) * 100) : 0,
            todoCount: todoIssues,
            inProgressCount: inProgressIssues,
            doneCount: completedIssues
        };
    }

    async getRecentSprints(projectId: string): Promise<SprintSummaryDTO[]> {
        const sprints = await SprintModel.find({ projectId })
            .sort({ createdAt: -1 })
            .limit(5);

        const sprintSummaries = await Promise.all(sprints.map(async (sprint) => {
            const issues = await IssueModel.find({ sprintId: sprint._id.toString() });
            const total = issues.length;
            const completed = issues.filter(i => i.status === IssueStatus.DONE).length;
            
            return {
                id: sprint._id.toString(),
                name: sprint.name,
                status: sprint.status,
                progress: total > 0 ? Math.round((completed / total) * 100) : 0
            };
        }));

        return sprintSummaries;
    }
}
