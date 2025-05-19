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

//Serves Swagger UI
server.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerOutput));

//logs in a registered user
server.post("/login", AuthenticationHandler.login);

//adds a new user
server.post("/users/register", UserHandler.registerUser);
//gets all users
server.get("/users", AuthenticationHandler.authenticate, UserHandler.getAllUsers);
//gets a user by id
server.get("/users/:id", AuthenticationHandler.authenticate, UserHandler.getUserById);
//updates a user
server.put("/users", AuthenticationHandler.authenticate, UserHandler.updateUser);
//deletes a user
server.delete("/users/:id", AuthenticationHandler.authenticate, UserHandler.deleteUser);

//adds a new product if it does not exist in the database after validating its existence in
//the fake store API. Adds a UserProduct relation in the database for the newly created product
server.post("/products", AuthenticationHandler.authenticate, ProductHandler.addProduct);
//gets all products from the database
server.get("/products", AuthenticationHandler.authenticate, ProductHandler.getAllProducts);
//gets all products from the database that belong to a user
server.get("/products/user/:id", AuthenticationHandler.authenticate, ProductHandler.getProductsByUserId);
//gets a product by id from the database
server.get("/products/:id", AuthenticationHandler.authenticate, ProductHandler.getProductById);
//deletes a userproduct relation from the database
server.delete("/products/:id", AuthenticationHandler.authenticate, ProductHandler.deleteProduct);


//gets all products from the fake store API
server.get("/api/fakeproducts", AuthenticationHandler.authenticate, FakeStoreHandler.getAllProducts);
//gets a product by id from the fake store API
server.get("/api/fakeproducts/:id", AuthenticationHandler.authenticate, FakeStoreHandler.getProductById);


server.listen(configuration.get('PORT'), () => {
  logger.info(`Server running on http://localhost:${configuration.get('PORT')}`);
});
