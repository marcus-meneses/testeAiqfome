import swaggerAutogen from 'swagger-autogen';
import { Config } from './common/services/Config';

const configuration = Config.Instance;

const APIPORT = configuration.get('PORT');

const doc = {
    info: {
        version: 'v1.0.0',
        title: 'Teste Aiqfome',
        description: 'Teste requisitado para a vaga de desenvolvedor backend na Aiqfome.',
    },
    servers: [
        {
            url: `http://localhost:${APIPORT}`,
        },
    ],
    components:{
        securitySchemes: {
            bearerAuth: {
                type: 'http',
                scheme: 'bearer',
            },
        },
    }
};

const outputFile = './swagger.json';
const endpointsFiles = ['./src/index.ts'];

swaggerAutogen({openapi: '3.0.0'})(outputFile, endpointsFiles, doc);