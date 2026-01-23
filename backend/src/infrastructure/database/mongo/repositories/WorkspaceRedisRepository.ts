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

}


