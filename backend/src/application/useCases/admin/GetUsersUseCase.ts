import { inject, injectable } from "tsyringe";
import { IGetUsersUseCase } from "../../interface/admin/IGetUsersUseCase";
import { IUserRepository } from "../../../domain/interfaces/repositories/IUserRepository";
import { GetUsersResponseDTO } from "../../dtos/admin/responseDTOs/GetUsersResponseDTO";
import { GetUsersRequestDTO } from "../../dtos/admin/requestDTOs/GetUsersRequestDTO";

@injectable()
export class GetUsersUseCase implements IGetUsersUseCase {
    constructor(
        @inject('IUserRepository') private userRepository: IUserRepository
    ) { }

    async execute(dto: GetUsersRequestDTO): Promise<GetUsersResponseDTO> {
        const users = await this.userRepository.findAllUsers(dto);
        return users;
    }
}
