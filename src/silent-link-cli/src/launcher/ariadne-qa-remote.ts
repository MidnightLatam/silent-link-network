import { createLogger } from '../logger-utils.js';
import { run } from '../index.js';
import { AriadneQaRemoteConfig } from '../config.js';

const config = new AriadneQaRemoteConfig();
config.setNetworkId();
const logger = await createLogger(config.logDir);
await run(config, logger);
