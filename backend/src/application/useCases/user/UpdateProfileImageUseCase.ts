import { IUpdateProfileImageUseCase } from "../../interface/user/IUpdateProfileImageUseCase";
import { UpdateProfileImageDTO } from "../../dtos/user/requestDTOs/UpdateProfileImageDTO";
import { UpdateProfileImageResponseDTO } from "../../dtos/user/responseDTOs/UpdateProfileImageResponseDTO";
import { IUserRepository } from "../../../domain/interfaces/repositories/IUserRepository";
import { inject, injectable } from "tsyringe";
import { USER_ERRORS } from "../../../domain/constants/errorMessages";
import { MESSAGES } from "../../../domain/constants/messages";

@injectable()
export class UpdateProfileImageUseCase implements IUpdateProfileImageUseCase {
    constructor(
        @inject("IUserRepository") private readonly _userRepository: IUserRepository,
    ) { }
    async execute(dto: UpdateProfileImageDTO): Promise<UpdateProfileImageResponseDTO> {
        const { userId, profileImage } = dto
        const user = await this._userRepository.findById(userId)
        if (!user) throw new Error(USER_ERRORS.USER_NOT_FOUND)
        user.avatarUrl = profileImage
        await this._userRepository.update({ avatarUrl: profileImage }, userId)
        return {
            message: MESSAGES.USERS.PROFILE_IMAGE_UPDATED_SUCCESSFULLY,
            avatarUrl: profileImage
        }
    }
}