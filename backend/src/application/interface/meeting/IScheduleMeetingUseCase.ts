import { IMeetingEntity } from "../../../domain/entities/Meeting/IMeetingEntity";
import { ScheduleMeetingDTO } from "../../dtos/project/requestDTOs/ScheduleMeetingDTO";

export interface IScheduleMeetingUseCase {
    execute(dto: ScheduleMeetingDTO): Promise<IMeetingEntity>;
}