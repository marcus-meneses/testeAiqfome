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


//done
server.post(
  "/login", 
  AuthenticationHandler.login
);

//done
server.post(
  "/users/register",
  UserHandler.registerUser
);

//done
server.get(
  "/users",
  UserHandler.getAllUsers
);
//done
server.get(
  "/users/:id",
  AuthenticationHandler.ownData("id"),
  AuthenticationHandler.authenticate,
  UserHandler.getUserById
);

//done
server.put(
  "/users/:id",
  AuthenticationHandler.ownData("id"),
  AuthenticationHandler.authenticate,
  UserHandler.updateUser
);

server.delete(
  "/users/:id", //124348a1-3d42-41cb-b202-e8893e1dd992
 AuthenticationHandler.ownData("id"),
  AuthenticationHandler.authenticate,
  UserHandler.deleteUser
);

server.post(
  "/products",
 AuthenticationHandler.ownData("id"),
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
  AuthenticationHandler.ownData("id"),
  ProductHandler.getProductsByUserId
);

server.get(
  "/products/:id",
  AuthenticationHandler.authenticate,
  ProductHandler.getProductById
);

server.delete(
  "/products/:id",
 AuthenticationHandler.ownData("id"),
  AuthenticationHandler.authenticate,
  ProductHandler.deleteProduct
);


server.get("/fakeproducts", FakeStoreHandler.getAllProducts);
server.get("/fakeproducts/:id", FakeStoreHandler.getProductById);



server.use(ErrorHandler.handleError);




server.listen(configuration.get("PORT"), () => {
  logger.info(
    `Server running on http://localhost:${configuration.get("PORT")}`
  );
});
