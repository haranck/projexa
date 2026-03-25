export interface IMeetingParticipantEntity {
    userId: string;
    status: 'invited' | 'joined' | 'left' | 'missed';
    joinedAt?: Date;
    leftAt?: Date;
}
