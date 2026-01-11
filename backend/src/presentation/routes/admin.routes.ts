import { Router } from "express";
import { adminController } from "../DI/resolver";
import { ROUTES } from "../../shared/constant/routes";

const router = Router()

router.post(ROUTES.ADMIN.LOGIN,adminController.adminLogin) 

export default router 