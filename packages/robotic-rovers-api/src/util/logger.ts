import bunyan, { LogLevelString } from 'bunyan';
import { config } from '../config';
import PrettyStream from 'bunyan-prettystream';

const bunyanConfig = config.get('bunyan');
const env = config.get('env');

const prettyStdOut = new PrettyStream();
prettyStdOut.pipe(process.stdout);

const logger = bunyan.createLogger({
  name: `${env}-${bunyanConfig.name}`,
  version: process.env.npm_package_version,
  level: bunyanConfig.level as LogLevelString,
  streams: [
    {
      stream: env === 'development' ? prettyStdOut : process.stdout,
      level: bunyanConfig.level as LogLevelString,
      type: undefined,
    },
  ],
});

export { logger };
