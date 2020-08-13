import log from 'loglevel';
import remote from 'loglevel-plugin-remote';

const host = process.env.SERVER_URL;

const url =
  process.env.NODE_ENV === 'production'
    ? `https://${host}/logserver`
    : `http://${host}:9000`;

const customJSON = (logg) => ({
  msg: logg.message,
  level: logg.level.label,
  stacktrace: logg.stacktrace,
});

remote.apply(log, {
  format: customJSON,
  url: `${url}/seva32/log`,
});

export default log;
