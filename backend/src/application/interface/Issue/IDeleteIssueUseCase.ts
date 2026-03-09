export interface IDeleteIssueUseCase {
    execute(issueId:string,userId:string):Promise<void>
}