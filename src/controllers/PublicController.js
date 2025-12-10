import express from 'express';
const router = express.Router();
import moment from 'moment'; 

router.get('/hello', (req, res) => {
    const response = {
        message: "✅ API Pública funcionando!",
        timestamp: new Date().toISOString(),
        status: "active",
        security: "JWT Authentication enabled"
    };
    return res.status(200).json(response);
});

router.get('/health', (req, res) => {
    const response = {
        status: "UP",
        service: "fluxus-finance-tracker-api",
        version: "1.0.0"
    };
    return res.status(200).json(response);
});

export default router;