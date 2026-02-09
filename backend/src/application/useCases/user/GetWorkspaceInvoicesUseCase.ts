import { injectable, inject } from 'tsyringe'
import { IWorkspaceRepository } from '../../../domain/interfaces/repositories/IWorkspaceRepository'
import { IStripeService } from '../../../domain/interfaces/services/IStripeService'
import { WorkspaceInvoicesResponseDTO } from '../../dtos/user/responseDTOs/WorkspaceInvoicesResponseDTO'
import { WORKSPACE_ERRORS } from '../../../domain/constants/errorMessages'
import { ISubscriptionRepository } from '../../../domain/interfaces/repositories/ISubscriptionRepository'
import { IGetWorkspaceInvoicesUseCase } from '../../../application/interface/user/IGetWorkspaceInvoicesUseCase'

@injectable()
export class GetWorkspaceInvoicesUseCase implements IGetWorkspaceInvoicesUseCase {
    constructor(
        @inject('IWorkspaceRepository') private readonly _workspaceRepository: IWorkspaceRepository,
        @inject('ISubscriptionRepository') private readonly _subscriptionRepository: ISubscriptionRepository,
        @inject('IStripeService') private readonly _stripeService: IStripeService
    ) { }

    async execute(workspaceId: string): Promise<WorkspaceInvoicesResponseDTO> {
        const workspace = await this._workspaceRepository.getWorkspaceById(workspaceId)
        if (!workspace) throw new Error(WORKSPACE_ERRORS.WORKSPACE_NOT_FOUND)

        const subscription = await this._subscriptionRepository.findByWorkspaceId(workspaceId)

        if (!subscription || !subscription.stripeCustomerId) {
            return {
                workspaceId,
                invoices: []
            }
        }
        const invoices = await this._stripeService.getInvoicesByCustomer(subscription.stripeCustomerId)
        
        return {
            workspaceId,
            invoices
        }
    }
}
