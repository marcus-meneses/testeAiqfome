import swaggerAutogen from "swagger-autogen";
import { Config } from "./common/services/Config";

const configuration = Config.Instance;

const APIPORT = configuration.get("PORT");

const components = {
  securitySchemes: {
    bearerAuth: {
      type: "http",
      scheme: "bearer",
    },
  },
  schemas: {
    LoginUser: {
      email: "eu@mail.com",
      password: "123456",
    },
    CreateUser: {
      name: "Fulano de Tal",
      email: "eu@mail.com",
      password: "123456",
    },
    UpdateUser: {
      id: "44bf1ff9-c0ba-41d6-b5ee-09f2e2c7934d",
      name: "Fulano de Tal",
      email: "novo@mail.com",
    },
  },
};

const doc = {
  info: {
    version: "v1.0.0",
    title: "Teste Aiqfome",
    description:
      "Teste requisitado para a vaga de Engenheiro(a) de Software SR | APIs e Backoffice | L2L Aiqfome ;)",
  },
  servers: [
    {
      url: `http://localhost:${APIPORT}`,
    },
  ],
  securityDefinitions: {
    bearerAuth: {
      type: "http",
      scheme: "bearer",
      bearerFormat: "JWT",
      description: "JWT Authorization header using the Bearer scheme.",
    },
  },
  components: { ...components },
};

const outputFile = "./swagger.json";
const endpointsFiles = ["./index.ts"];

swaggerAutogen({ openapi: "3.0.0" })(outputFile, endpointsFiles, doc);
