import app from "./index.js";
import { prisma } from "./lib/prisma.js";

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    await prisma.$connect();
    console.log(" Conectado ao banco SQLite");

    app.listen(PORT, () => {
      console.log("\n" + "=".repeat(50));
      console.log(" Servidor iniciado com sucesso!");
      console.log("=".repeat(50));
      console.log(` Porta: ${PORT}`);
      console.log(` URL: http://localhost:${PORT}`);
      console.log(` API: http://localhost:${PORT}/transacoes`);
      console.log(` Health: http://localhost:${PORT}/health`);
      console.log("=".repeat(50));
      console.log("\n  Todas as rotas exigem autenticação JWT");
      console.log(" Header: Authorization: Bearer <token>\n");
    });
  } catch (error) {
    console.error(" Erro ao iniciar servidor:", error);
    process.exit(1);
  }
}

startServer();
