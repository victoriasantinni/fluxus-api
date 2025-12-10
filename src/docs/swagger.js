import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

export function configureSwagger(app) {
  const options = {
    definition: {
      openapi: "3.0.0",
      info: {
        title: "API Finance Tracker - Squad 6",
        version: "1.0.0",
        description: "Documentação da API de Finanças Pessoais",
      },
      servers: [
        { url: "http://localhost:3000", description: "Servidor Local" },
      ],
      components: {
        securitySchemes: {
          bearerAuth: {
            type: "http",
            scheme: "bearer",
            bearerFormat: "JWT",
          },
        },
      },
    },
    apis: ["./src/routes/*.js"], 
  };

  const swaggerSpec = swaggerJSDoc(options);
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  console.log("📘 Swagger rodando em: http://localhost:3000/api-docs");
}
