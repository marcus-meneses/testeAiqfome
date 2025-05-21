import express from "express";
import swaggerUi from "swagger-ui-express";
import swaggerOutput from "./swagger.json";

import { Config } from "@common/services/Config";
import { Logger } from "@common/services/Logger";

import { AuthenticationHandler } from "@common/handlers/AuthenticationHandler";
import { FakeStoreHandler } from "@common/handlers/FakeStoreHandler";
import { UserHandler } from "@user/handlers/UserHandler";
import { ProductHandler } from "@product/handlers/ProductHandler";
import { ErrorHandler } from "./common/handlers/ErrorHandler";

const logger = Logger.Instance;
const configuration = Config.Instance;

const server = express();
server.use(express.json());

server.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerOutput));

server.post(
  "/login", 
  AuthenticationHandler.login
);

server.post(
  "/users/register",
  UserHandler.registerUser
);

server.get(
  "/users",
  AuthenticationHandler.authenticate,
  UserHandler.getAllUsers
);

server.get(
  "/users/:id",
  AuthenticationHandler.authenticate,
  UserHandler.getUserById
);

server.put(
  "/users/:id",
  AuthenticationHandler.ownData,
  AuthenticationHandler.authenticate,
  UserHandler.updateUser
);

server.delete(
  "/users/:id",
  AuthenticationHandler.ownData,
  AuthenticationHandler.authenticate,
  UserHandler.deleteUser
);

server.post(
  "/products",
  AuthenticationHandler.ownData,
  AuthenticationHandler.authenticate,
  ProductHandler.addProduct
);

server.get(
  "/products",
  AuthenticationHandler.authenticate,
  ProductHandler.getAllProducts
);

server.get(
  "/products/user/:id",
  AuthenticationHandler.ownData,

  ProductHandler.getProductsByUserId
);

server.get(
  "/products/:id",
  AuthenticationHandler.authenticate,
  ProductHandler.getProductById
);

server.delete(
  "/products/:id",
  AuthenticationHandler.ownData,
  AuthenticationHandler.authenticate,
  ProductHandler.deleteProduct
);

server.get("/api/fakeproducts", FakeStoreHandler.getAllProducts);

server.get("/api/fakeproducts/:id", FakeStoreHandler.getProductById);

server.use(ErrorHandler.handleError);

server.listen(configuration.get("PORT"), () => {
  logger.info(
    `Server running on http://localhost:${configuration.get("PORT")}`
  );
});
