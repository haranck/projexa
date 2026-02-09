import { Router, raw } from "express";
import { stripeWebhookController } from "../DI/resolver";
import { ROUTES } from "../../shared/constant/routes";

const router = Router();

router.post(ROUTES.STRIPE.WEBHOOK, raw({ type: 'application/json' }), stripeWebhookController.handleWebhook);

export default router;
