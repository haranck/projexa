import { IMeetingEntity } from "../../../domain/entities/Meeting/IMeetingEntity";
import { RescheduleMeetingDTO } from "../../dtos/project/requestDTOs/ScheduleMeetingDTO";

export interface IRescheduleMeetingUseCase {
    execute(dto: RescheduleMeetingDTO): Promise<IMeetingEntity>;
}