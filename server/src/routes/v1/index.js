import {Router} from "express";

import productsRouter from "./products.routes.js";

export const router = Router();

router.use("/products", productsRouter);

export default router;


