import {
  boolean,
  dirname,
  join,
  parseToml,
  Schema,
  string,
  stringifyToml,
  Type,
  unknown,
} from '../deps.ts';
import { ClarinetConfig, getClarinetConfig } from './clarinet-config.ts';
import { log } from './logger.ts';
import { cwdRelative, cwdResolve, fileExists } from './utils.ts';

export const CONFIG_FILE = 'Clarigen.toml' as const;

export enum OutputType {
  Deno = 'deno',
  ESM = 'esm',
  Docs = 'docs',
}

const ConfigFileSchema = Schema({
  clarinet: string,
  [OutputType.ESM]: Schema({
    output: string.optional(),
    include_accounts: boolean.optional(),
    after: string.optional(),
  }).optional(),
  [OutputType.Deno]: Schema({
    output: string.optional(),
  }).optional(),
  [OutputType.Docs]: Schema({
    output: string.optional(),
  }).optional(),
});

export type ConfigFile = Type<typeof ConfigFileSchema>;

export const defaultConfigFile: ConfigFile = {
  clarinet: './Clarinet.toml',
};

export class Config {
  public configFile: ConfigFile;
  public clarinet: ClarinetConfig;

  constructor(config: ConfigFile, clarinet: ClarinetConfig) {
    this.configFile = config;
    this.clarinet = clarinet;
  }

  public static async load() {
    const config = await getConfig();
    const clarinet = await getClarinetConfig(config.clarinet);
    return new this(config, clarinet);
  }

  outputResolve(type: OutputType, filePath?: string) {
    const path = this.configFile[type]?.output;
    if (typeof path === 'undefined') return null;
    const base = cwdResolve(path, filePath || '');
    if (typeof filePath === 'undefined') {
      if (base.endsWith('.ts')) return base;
      return join(base, './index.ts');
    } else {
      return base;
    }
  }

  async writeOutput(type: OutputType, contents: string, filePath?: string) {
    const path = this.outputResolve(type, filePath);
    if (path === null) return null;
    const dir = dirname(path);
    await Deno.mkdir(dir, { recursive: true });
    await Deno.writeTextFile(path, contents);
    log.debug(`Generated ${type} file at ${cwdRelative(path)}`);
    return path;
  }

  supports(type: OutputType) {
    return !!this.configFile[type]?.output;
  }

  type(type: OutputType) {
    return this.configFile[type];
  }

  get deno() {
    return this.configFile[OutputType.Deno];
  }
  get esm() {
    return this.configFile[OutputType.ESM];
  }
  get docs() {
    return this.configFile[OutputType.Docs];
  }

  clarinetFile() {
    return cwdResolve(this.configFile.clarinet);
  }

  joinFromClarinet(filePath: string) {
    const baseDir = dirname(this.clarinetFile());
    return join(baseDir, filePath);
  }
}

export function configFilePath() {
  return cwdResolve(CONFIG_FILE);
}

export async function saveConfig(config: ConfigFile) {
  const configToml = stringifyToml({ ...config }, { keyAlignment: false });
  await Deno.writeTextFile(configFilePath(), configToml);
}

// memoize / singleton
let sessionConfig: ConfigFile | undefined;

export async function getConfig(): Promise<ConfigFile> {
  if (typeof sessionConfig !== 'undefined') return sessionConfig;
  const path = configFilePath();
  if (await fileExists(path)) {
    const toml = await Deno.readTextFile(configFilePath());
    sessionConfig = unknown.schema(ConfigFileSchema)(parseToml(toml));
  } else {
    sessionConfig = defaultConfigFile;
  }
  return sessionConfig;
}
