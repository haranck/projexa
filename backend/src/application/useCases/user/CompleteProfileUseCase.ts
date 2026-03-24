import { ICompleteProfileUseCase } from "../../interface/user/ICompleteProfileUseCase";
import { IUserRepository } from "../../../domain/interfaces/repositories/IUserRepository";
import { injectable, inject } from "tsyringe";
import { USER_ERRORS } from "../../../domain/constants/errorMessages";
import { CompleteProfileDTO } from "../../dtos/user/requestDTOs/CompleteProfileDTO";
import { IPasswordService } from "../../../domain/interfaces/services/IPasswordService";
import { CompleteProfileResponseDTO } from "../../dtos/user/responseDTOs/CompleteProfileResponseDTO";
import { UserDTOmapper } from "../../mappers/User/UserDTOmapper";

@injectable()
export class CompleteProfileUseCase implements ICompleteProfileUseCase {
    constructor(
        @inject("IUserRepository") private readonly _userRepository: IUserRepository,
        @inject("IPasswordService") private readonly _passwordService: IPasswordService
    ) { }

    async execute(userId: string, dto: CompleteProfileDTO): Promise<CompleteProfileResponseDTO> {
        const user = await this._userRepository.findById(userId)
        if (!user) throw new Error(USER_ERRORS.USER_NOT_FOUND)

        const hashedPassword = await this._passwordService.hash(dto.password)

        user.firstName = dto.firstName
        user.lastName = dto.lastName
        user.password = hashedPassword
        user.isEmailVerified = true
        user.onboardingCompleted = true

        await this._userRepository.update(user, userId)
        return UserDTOmapper.toCompleteProfileResponseDTO(user)
    }
}
