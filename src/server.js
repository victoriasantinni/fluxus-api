// Importações
import 'dotenv/config';
import express from 'express';

// Definindo cosntantes
const PORT = process.env.PORT;
const DB_HOST = process.env.DB_HOST;

// Iniciando Express
const app = express();

// Definindo rota "/"
app.get('/', (req, res) => {
    res.json({message: 'Bem vind@ ao Fluxus!'});
});

// Iniciando servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://${DB_HOST}:${PORT}/`);
});