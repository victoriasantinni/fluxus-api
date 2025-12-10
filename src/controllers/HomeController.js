import express from 'express';
const router = express.Router();

const HOME_HTML = `
    <!DOCTYPE html>
    <html>
    <head>
        <title>JWT Project</title>
        <style>
            body { font-family: Arial; padding: 40px; text-align: center; }
            h1 { color: #4CAF50; }
            .links a { display: block; margin: 10px; padding: 10px; background: #4CAF50; color: white; text-decoration: none; border-radius: 5px; }
        </style>
    </head>
    <body>
        <h1>✅ Fluxus Finance Tracker (Node/Express) está RODANDO!</h1>
        <p>API Back-end para rastreamento de finanças</p>
        <div class="links">
            <a href="/api/public/hello" target="_blank">🔓 Testar API Pública</a>
            <a href="/api/auth/register" target="_blank">👤 Tentar Registrar Usuário</a>
            <a href="/api/private/hello" target="_blank">🔒 Tentar API Protegida</a>
        </div>
    </body>
    </html>
`;

router.get('/', (req, res) => {
    return res.status(200).send(HOME_HTML);
});

export default router;
