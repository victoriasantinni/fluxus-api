import express from 'express';
import * as authService from '../services/AuthenticationService.js'; 

const router = express.Router();

router.post('/register', async (req, res) => {
    try {
        await authService.register(req.body);
        return res.status(200).send("Usuário registrado com sucesso");
    } catch (error) {
        console.error("Erro no registro:", error);
        return res.status(400).send(error.message || "Erro ao registrar usuário");
    }
});

router.post('/login', async (req, res) => {
    try {
        const token = await authService.login(req.body);
        return res.status(200).json({ token: token });
    } catch (error) {
        console.error("Erro no login:", error);
        return res.status(401).send(error.message || "Credenciais inválidas");
    }
});

export default router;