// routes/swagger.js
import express from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';

const router = express.Router();

const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Estimate API',
            version: '1.0.0',
            description: 'API zur Schätzung und Verwaltung von Projektmetriken',
        },
        servers: [
            {
                url: 'http://localhost:3010',
            },
        ],
    },
    apis: ['./routes/*.js'],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

router.use('/', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

export default router;
