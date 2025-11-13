const swaggerJSDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'SGE Fortal API',
      version: '1.0.0',
      description: 'API para o Sistema de Gestão de Estoque (Camada 3)',
    },
    servers: [{ url: 'http://localhost:4000' }],
  },
  apis: ['./src/routes/*.js'],
};

module.exports = swaggerJSDoc(options);
