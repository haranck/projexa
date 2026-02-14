export interface IDeleteRoleUseCase {
    execute(roleId: string): Promise<void>
}