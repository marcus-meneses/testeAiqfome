import express from "express";
import { Config } from "@common/services/Config";
import { Logger } from "@common/services/Logger";

import { AuthenticationHandler } from "@common/handlers/AuthenticationHandler";
import { UserHandler } from "@user/handlers/UserHandler";

const logger = Logger.Instance;
const configuration = Config.Instance;
console.log("Configuration:", configuration.data);

const server = express();
server.use(express.json());

server.post("/api/login", AuthenticationHandler.login);
server.post("/api/register", UserHandler.registerUser);




logger.info("Server is starting...");
logger.debug("Debugging information");
logger.warning("This is a warning message");
logger.error("This is an error message");

server.listen(configuration.get('PORT'), () => {
  console.log(`Server running on http://localhost:${configuration.get('PORT')}`);
});
