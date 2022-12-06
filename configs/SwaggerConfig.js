const swaggerJsdoc = require("swagger-jsdoc");
const options = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "Easy Car",
      version: "1.0.0",
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          in: "header",
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: ["./routes/*.js"],
};
module.exports = swaggerJsdoc(options);
