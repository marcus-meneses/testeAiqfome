import express from "express";
import swaggerUi from "swagger-ui-express";
import swaggerOutput from "./swagger.json";

import { Config } from "@common/services/Config";
import { Logger } from "@common/services/Logger";

import { AuthenticationHandler } from "@common/handlers/AuthenticationHandler";
import { FakeStoreHandler } from "@common/handlers/FakeStoreHandler";
import { UserHandler } from "@user/handlers/UserHandler";
import { ProductHandler } from "@product/handlers/ProductHandler";

const logger = Logger.Instance;
const configuration = Config.Instance;

const server = express();
server.use(express.json());

//swagger.description = "Rota do swagger para a documentação da API";
server.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerOutput));

//swagger.description = "Rota para login de usuário";
server.post("/login", AuthenticationHandler.login);

//swagger.description = "Rota para registro de usuário";
server.post("/users/register", UserHandler.registerUser);

//swagger.description = "Rota para busca de todos os usuários";
server.get(
  "/users",
  AuthenticationHandler.authenticate,
  UserHandler.getAllUsers
);


//swagger.description = "Rota para busca de usuário por id";
server.get(
  "/users/:id",
  AuthenticationHandler.authenticate,
  UserHandler.getUserById
);


//swagger.description = "Rota para atualização de usuário";
server.put(
  "/users/:id",
  AuthenticationHandler.authenticate,
  UserHandler.updateUser
);


//swagger.description = "Rota para deletar usuário";
server.delete(
  "/users/:id",
  AuthenticationHandler.authenticate,
  UserHandler.deleteUser
);

//adds a new product if it does not exist in the database after validating its existence in
//the fake store API. Adds a UserProduct relation in the database for the newly created product
//swagger.description = "Rota para adicionar produto";
server.post(
  "/products",
  AuthenticationHandler.authenticate,
  ProductHandler.addProduct
);


//swagger.description = "Rota para buscar todos os produtos na base de dados";
server.get(
  "/products",
  AuthenticationHandler.authenticate,
  ProductHandler.getAllProducts
);


//swagger.description = "Rota para buscar produtos por id de usuário";
server.get(
  "/products/user/:id",
  AuthenticationHandler.authenticate,
  ProductHandler.getProductsByUserId
);

//swagger.description = "Rota para buscar produto por id na base de dados";
server.get(
  "/products/:id",
  AuthenticationHandler.authenticate,
  ProductHandler.getProductById
);


//swagger.description = "Rota para excuir produto de um perfil de usuário";
server.delete(
  "/products/:id",
  AuthenticationHandler.authenticate,
  ProductHandler.deleteProduct
);

//swagger.description = Busca todos os produtos da fake store API
server.get(
  "/api/fakeproducts",
  FakeStoreHandler.getAllProducts
);

//swagger.description = "Rota para buscar produto por id na fake store API";
server.get(
  "/api/fakeproducts/:id",
  FakeStoreHandler.getProductById
);

server.listen(configuration.get("PORT"), () => {
  logger.info(
    `Server running on http://localhost:${configuration.get("PORT")}`
  );
});
