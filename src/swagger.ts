import swaggerAutogen from "swagger-autogen";
import { Config } from "./common/services/Config";

const configuration = Config.Instance;

const APIPORT = configuration.get("PORT");

const components = {
  securitySchemes: {
    Bearer: {
      type: "http",
      description: "JWT Authorization header using the Bearer scheme.",
      header: "Authorization",
      scheme: "bearer",
    },
  },
  schemas: {
    LoginUser: {
      email: "eu@mail.com",
      password: "123456",
    },
    UpdateUser: {
      id: "44bf1ff9-c0ba-41d6-b5ee-09f2e2c7934d",
      name: "Fulano de Tal",
      email: "novo@mail.com",
    },
    CreateUser: {
      name: "Fulano de Tal",
      email: "eu@mail.com",
      password: "123456",
    },
    ErrorResponse: {
      message: "Error message",
    },
    LoginResponse: {
      user: {
        id: "44bf1ff9-c0ba-41d6-b5ee-09f2e2c7934d",
        name: "Fulano de Tal",
        email: "eu@eu.com",
      },
      token:
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c",
    },
    ListUsersResponse: [
      {
        id: "44bf1ff9-c0ba-41d6-b5ee-09f2e2c7934d",
        name: "Fulano de Tal",
        email: "email@domain.com",
      },
      {
        id: "44bf1ff9-c0ba-41d6-b5ee-09f2e2c7934d",
        name: "Ciclano de Tal",
        email: "eu@dev.com",
      },
    ],
    GetUserResponse: {
      id: "44bf1ff9-c0ba-41d6-b5ee-09f2e2c7934d",
      name: "Fulano de Tal",
      email: "mail@domain",
    },
    ListFakeProductsResponse: [
      {
        id: 1,
        title: "Fjallraven - Foldsack No. 1 Backpack, Fits 15 Laptops",
        price: 109.95,
        description:
          "Your perfect pack for everyday use and walks in the forest. Stash your laptop in the padded sleeve, your everyday",
        category:
          "men's clothing",
        image:
          "https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg",
        rating: {
          rate: 3.9,
          count: 120,
        },
      },
      {
        id: 2,
        title: "Mens Casual Premium Slim Fit T-Shirts",
        price: 22.3,
        description:
          "Slim fitting style, contrast raglan long sleeve, three-button henley placket, contrast stitching.",
        category:
          "men's clothing",
        image:
          "https://fakestoreapi.com/img/71YXzeOuslL._AC_UL640_QL65_ML3_.jpg",
        rating: {
          rate: 4.1,
          count: 259,
        },
      }],
    GetFakeProductResponse: {
      id: 1,
      title: "Fjallraven - Foldsack No. 1 Backpack, Fits 15 Laptops",
      price: 109.95,
      description:
        "Your perfect pack for everyday use and walks in the forest. Stash your laptop in the padded sleeve, your everyday",
      category:
        "men's clothing",
      image:
        "https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg",
      rating: {
        rate: 3.9,
        count: 120,
      },
    },
    ProductInsertedResponse: {
      id: "44bf1ff9-c0ba-41d6-b5ee-09f2e2c7934d",
      user_id: "44bf1ff9-c0ba-41d6-b5ee-09f2e2c7934d",
      fakestore_id: 1,
      title: "Fjallraven - Foldsack No. 1 Backpack, Fits 15 Laptops",
      price: 109.95,
      image:
        "https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg",
      review: 3.9,
    }
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
    Bearer: {
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
