import { container } from "tsyringe";
import { IUserRepository } from "../../domain/interfaces/repositories/IUserRepository";
import { UserRepository } from "../../infrastructure/database/mongo/repositories/UserRepository";
import { IOtpRepository } from "../../domain/interfaces/repositories/IOtpRepository";
import { OtpRepository } from "../../infrastructure/database/mongo/repositories/OtpRepository";
import { ITokenBlacklistRepository } from "../../domain/interfaces/repositories/ITokenBlacklistRepository";
import { RedisTokenBlacklistRepository } from "../../infrastructure/database/mongo/repositories/RedisTokenBlacklistRepository";
import { IPlanRepository } from "../../domain/interfaces/repositories/IPlanRepository";
import { PlanRepository } from "../../infrastructure/database/mongo/repositories/PlanRepository";


export class RepositoryModule {
    static registerModules(): void {

        container.register<IUserRepository>('IUserRepository', {
            useClass: UserRepository
        });

        container.register<IOtpRepository>('IOtpRepository', {
            useClass: OtpRepository
        })

        container.register<ITokenBlacklistRepository>('ITokenBlacklistRepository', {
            useClass: RedisTokenBlacklistRepository
        })

        container.register<IPlanRepository>('IPlanRepository', {
            useClass: PlanRepository
        })

    }
}
