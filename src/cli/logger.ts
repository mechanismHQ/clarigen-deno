import {
  colors,
  ConsoleHandler,
  Kia,
  logger,
  LogRecord,
  Spinners,
  sprintf,
} from '../deps.ts';

const LEVEL_PREFIX: { [key: number]: string } = {
  [logger.LogLevels.INFO]: colors.blue('info'),
  [logger.LogLevels.WARNING]: colors.yellow('warn'),
  [logger.LogLevels.ERROR]: colors.red('error'),
  [logger.LogLevels.CRITICAL]: colors.bold.red('critical'),
  [logger.LogLevels.DEBUG]: colors.black('debug'),
};

await logger.setup({
  handlers: {
    console: new class extends ConsoleHandler {
      format(logRecord: LogRecord) {
        const prefix = LEVEL_PREFIX[logRecord.level];
        const base = `${colors.magenta('[Clarigen]')} ${
          prefix ? `${prefix}: ` : ''
        }${logRecord.msg}`;
        if (logRecord.args.length > 0) {
          return sprintf(base, ...logRecord.args);
        }
        return base;
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

export function makeSpinner(text: string) {
  return new Kia({
    spinner: Spinners.arc,
    text,
    prefixText: colors.magenta(`[Clarigen] `),
  });
}
