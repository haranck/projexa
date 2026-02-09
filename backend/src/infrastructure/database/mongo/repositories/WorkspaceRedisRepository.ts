import { IWorkspaceRedisRepository } from "../../../../domain/interfaces/repositories/IWorkspaceRedisRepository";
import { redisClient } from "../../../cache/redisClient";
import { IWorkspaceEntity } from "../../../../domain/entities/IWorkspaceEntity";

export class WorkspaceRedisRepository implements IWorkspaceRedisRepository {
    private readonly prefix = "workspace";
    private readonly ttl = 60 * 30;

    async save(workspace: IWorkspaceEntity): Promise<IWorkspaceEntity> {
        await redisClient.set(
            `${this.prefix}:${workspace.name}`,
            JSON.stringify(workspace),
            "EX",
            this.ttl
        );
        return workspace;
    }

    async findByName(workspaceName: string): Promise<IWorkspaceEntity | null> {
        const data = await redisClient.get(`${this.prefix}:${workspaceName}`)
        if (!data) return null;
        return JSON.parse(data) as IWorkspaceEntity;
    }

    async delete(workspaceName: string): Promise<void> {
        await redisClient.del(`${this.prefix}:${workspaceName}`);
    }

}


