import express from 'express';
const router = express.Router();

import { authMiddleware } from '../middlewares/authMiddleware.js';

router.get('/hello', authMiddleware, (req, res) => {
    return res.status(200).send("Olá — rota protegida!");
});

export default router;
