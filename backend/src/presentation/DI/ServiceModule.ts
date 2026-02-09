import { container } from "tsyringe";
import { IPasswordService } from "../../domain/interfaces/services/IPasswordService";
import { PasswordService } from "../../infrastructure/services/PasswordService";
import { IEmailService } from "../../domain/interfaces/services/IEmailService";
import { EmailService } from "../../infrastructure/services/EmailService";
import { IJwtService } from "../../domain/interfaces/services/IJwtService";
import { JwtService } from "../../infrastructure/services/JwtService";
import { IGoogleAuthService } from "../../domain/interfaces/services/IGoogleAuthService";
import { GoogleAuthService } from "../../infrastructure/services/GoogleAuthService";
import { RedisTempUserStore } from "../../infrastructure/services/RedisTempUserStore";
import { ITempUserStore } from "../../domain/interfaces/services/ITempUserStore";
import { IS3Service } from "../../domain/interfaces/services/IS3Service";
import { S3Service } from "../../infrastructure/services/S3service";
import { IStripeService } from "../../domain/interfaces/services/IStripeService";
import { StripeService } from "../../infrastructure/services/StripeService";

export class ServiceModule {
    static registerModules():void{

        container.register<IPasswordService>("IPasswordService",{
            useClass: PasswordService
        });

        container.register<IEmailService>('IEmailService',{
            useClass: EmailService
        });

        container.register<IJwtService>('IJwtService',{
            useClass: JwtService
        })

        container.register<IGoogleAuthService>('IGoogleAuthService',{
            useClass: GoogleAuthService
        })

        container.register<ITempUserStore>('ITempUserStore',{
            useClass: RedisTempUserStore
        })

        container.register<IS3Service>('IS3Service',{
            useClass: S3Service
        })

        container.register<IStripeService>('IStripeService',{
            useClass: StripeService
        })
    }
}