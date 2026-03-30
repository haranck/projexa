import { injectable } from "tsyringe";
import { IssueModel } from "../../models/Issue/IssueModel";
import { IDashboardRepository } from "../../../../../domain/interfaces/repositories/DashboardRepo/IDashboardRepository";
import { SprintModel } from "../../models/Sprint/SprintModel";
import { IssueStatus, IssueType } from "../../../../../domain/enums/IssueEnums";
import { SprintStatus } from "../../../../../domain/enums/SprintStatus";
import { 
    DashboardStatsDTO, 
    IssueDistributionDTO, 
    ModuleProgressDTO, 
    SprintSummaryDTO, 
    TeamActivityDTO, 
    TopPerformerDTO, 
    OverdueTaskDTO, 
    TodayMeetingDTO 
} from "../../../../../application/dtos/dashboard/DashboardResponseDTO";
import { ProjectMemberModel } from "../../models/Project/ProjectMemberModel";
import { UserActivityModel } from "../../models/UserActivity/UserActivityModel";
import { Types } from "mongoose";
import { MeetingModel, IMeetingDocument } from "../../models/Meeting/MeetingModel";
import { UserModel } from "../../models/UserModel";

interface PopulatedMember {
    userId: {
        _id: Types.ObjectId;
        firstName: string;
        avatarUrl?: string;
    };
    roleId: {
        _id: Types.ObjectId;
        name: string;
    };
}

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

        const storyCount = issues.filter(i => i.issueType === IssueType.STORY).length;
        const taskCount = issues.filter(i => i.issueType === IssueType.TASK).length;
        const bugCount = issues.filter(i => i.issueType === IssueType.BUG).length;

        return {
            sprintName: activeSprint.name,
            completedPoints: completedIssues,
            totalPoints: totalIssues,
            percentage: totalIssues > 0 ? Math.round((completedIssues / totalIssues) * 100) : 0,
            todoCount: todoIssues,
            inProgressCount: inProgressIssues,
            doneCount: completedIssues,
            storyCount,
            taskCount,
            bugCount
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

    async getTeamActivity(projectId: string): Promise<TeamActivityDTO[]> {
        const members = await ProjectMemberModel.find({ projectId: new Types.ObjectId(projectId) })
            .populate("userId")
            .populate("roleId");

        const teamActivity: TeamActivityDTO[] = await Promise.all((members as unknown as PopulatedMember[]).map(async (member) => {
            const activity = await UserActivityModel.findOne({ userId: member.userId._id });
            const totalTime = activity?.totalTime || 0;
            return {
                userId: member.userId._id.toString(),
                userName: member.userId.firstName,
                role: member.roleId.name,
                profilePicture: member.userId.avatarUrl,
                totalTime,
                hoursLogged: Math.round((totalTime / 3600000) * 10) / 10
            };
        }));

        return teamActivity.sort((a, b) => b.hoursLogged - a.hoursLogged);
    }

    async getTopPerformer(projectId: string): Promise<TopPerformerDTO | null> {
        const teamActivity = await this.getTeamActivity(projectId);
        if (teamActivity.length === 0) return null;

        const performers = await Promise.all(teamActivity.map(async (activity) => {
            const issuesCompleted = await IssueModel.countDocuments({ 
                projectId, 
                assigneeId: activity.userId,
                status: IssueStatus.DONE 
            });

            return {
                ...activity,
                issuesCompleted,
                score: (activity.hoursLogged * 0.4) + (issuesCompleted * 0.6)
            };
        }));

        const top = performers.sort((a, b) => b.score - a.score)[0];
        
        return {
            userId: top.userId,
            userName: top.userName,
            role: top.role,
            profilePicture: top.profilePicture,
            hoursLogged: top.hoursLogged,
            issuesCompleted: top.issuesCompleted
        };
    }

    async getOverdueTasks(projectId: string, userId?: string): Promise<OverdueTaskDTO[]> {
        if (!userId) return [];
        
        const now = new Date();
        const overdueTasks = await IssueModel.find({
            projectId,
            assigneeId: userId,
            status: { $ne: IssueStatus.DONE },
            endDate: { $lt: now, $ne: null }
        }).sort({ endDate: 1 });

        return overdueTasks.map(task => ({
            id: task._id.toString(),
            title: task.title,
            endDate: task.endDate!,
            key: task.key
        }));
    }

    async getTodayMeetings(projectId: string, userId?: string): Promise<TodayMeetingDTO[]> {
        const now = new Date();
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);
        
        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999);

        const meetings = await MeetingModel.find({
            projectId,
            startTime: { $gte: startOfDay, $lte: endOfDay },
            endTime: { $gt: now }, 
            status: 'upcoming'
        }).sort({ startTime: 1 });

        const filteredMeetings = userId ? meetings.filter(meeting => {
            const participant = meeting.participants.find(p => p.userId.toString() === userId.toString());
            return participant?.status !== 'left';
        }) : meetings;

        return await Promise.all(filteredMeetings.map(async (meeting: IMeetingDocument) => {
            const host = await UserModel.findById(meeting.hostId);
            return {
                id: meeting._id.toString(),
                title: meeting.title,
                startTime: meeting.startTime,
                endTime: meeting.endTime,
                roomName: meeting.roomName,
                hostName: host ? `${host.firstName} ${host.lastName}` : "Unknown",
                hostAvatar: host?.avatarUrl || ""
            };
        }));
    }
}