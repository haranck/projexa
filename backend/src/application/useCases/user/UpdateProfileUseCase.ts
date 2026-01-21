import { IUpdateProfileUseCase } from "../../interface/user/IUpdateProfileUseCase";
import { UpdateProfileDTO } from "../../dtos/user/requestDTOs/UpdateProfileDTO";
import { UpdateProfileResponseDTO } from "../../dtos/user/responseDTOs/UpdateProfileResponseDTO";
import { inject, injectable } from "tsyringe";
import { IUserRepository } from "../../../domain/interfaces/repositories/IUserRepository";
import { USER_ERRORS } from "../../../domain/constants/errorMessages";
import { MESSAGES } from "../../../domain/constants/messages";

@injectable()
export class UpdateProfileUseCase implements IUpdateProfileUseCase {
    constructor(
        @inject('IUserRepository') private readonly _userRepository: IUserRepository
    ) { }
    async execute(dto: UpdateProfileDTO): Promise<UpdateProfileResponseDTO> {
        const user = await this._userRepository.findById(dto.userId)
        if (!user) throw new Error(USER_ERRORS.USER_NOT_FOUND)
        await this._userRepository.update({ firstName: dto.firstName, lastName: dto.lastName, phone: dto.phoneNumber }, dto.userId)
        return {
            message: MESSAGES.USERS.PROFILE_UPDATED_SUCCESSFULLY,
            data: {
                userId: dto.userId,
                firstName: dto.firstName,
                lastName: dto.lastName,
                phone: dto.phoneNumber,
            }
        }
    }
}