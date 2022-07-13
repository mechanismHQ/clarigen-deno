import {
  blue,
  bold,
  ConsoleHandler,
  logger,
  LogRecord,
  red,
  yellow,
} from '../deps.ts';

const LEVEL_PREFIX: { [key: number]: string } = {
  [logger.LogLevels.INFO]: blue('info'),
  [logger.LogLevels.WARNING]: yellow('warn'),
  [logger.LogLevels.ERROR]: red('error'),
  [logger.LogLevels.CRITICAL]: bold(red('critical')),
};

await logger.setup({
  handlers: {
    console: new class extends ConsoleHandler {
      format(logRecord: LogRecord) {
        const prefix = LEVEL_PREFIX[logRecord.level];
        return `[Clarigen] ${prefix ? `${prefix}: ` : ''}${logRecord.msg}`;
      }
    }('DEBUG'),
  },
  loggers: {
    default: {
      level: 'INFO',
      handlers: ['console'],
    },
  },
});

export const log = logger.getLogger();
