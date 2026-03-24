export interface UpdateProfileResponseDTO {
    message: string,
    data: {
        userId: string,
        _id: string,
        firstName: string,
        lastName: string,
        phone: string,
    }
}