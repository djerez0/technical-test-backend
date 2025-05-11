import app from "./app";
import { config } from "./config/env";
import { initDB } from "./db/db";

const port = config.port;
initDB()
  .then(() => {
    app.listen(port, () => {
      console.info(`Server listening in port ${port}`);
    });
  })
  .catch((error) => {
    console.error("An error occurred while starting the database.", error);
  });
