import { web } from "./application/web.js";
import { logger } from "./application/logging.js";

web.listen(8080, () => {
  logger.info(`App start, listening on port 8080`);
});
