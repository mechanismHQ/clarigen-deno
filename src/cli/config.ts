import {
  parse,
  stringify,
} from 'https://deno.land/std@0.133.0/encoding/toml.ts';
import { dirname, join } from 'https://deno.land/std@0.144.0/path/mod.ts';
import { cwdResolve, fileExists } from './utils.ts';

export const CONFIG_FILE = 'Clarigen.toml' as const;

export interface ConfigFile {
  // output: {
  //   deno?: string;
  //   esm?: string;
  //   docs?: string;
  // };
  // hooks?: {
  //   afterESM?: string;
  //   afterDeno?: string;
  // };
  [OutputType.ESM]?: {
    output: string;
    after: string;
  };
  [OutputType.Deno]?: {
    output: string;
  };
  [OutputType.Docs]?: {
    output: string;
  };
  clarinet: string;
}

export enum OutputType {
  Deno = 'deno',
  ESM = 'esm',
  Docs = 'docs',
}

export const defaultConfigFile: ConfigFile = {
  clarinet: './Clarinet.toml',
};

export class Config {
  public configFile: ConfigFile;

  constructor(config: ConfigFile) {
    this.configFile = config;
  }

  public static async load() {
    const config = await getConfig();
    return new this(config);
  }

  outputResolve(type: OutputType, filePath?: string) {
    const path = this.configFile[type]?.output;
    if (typeof path === 'undefined') return null;
    const base = cwdResolve(path, filePath || '');
    if (base.endsWith('.ts')) return base;
    return join(base, './index.ts');
  }

  async writeOutput(type: OutputType, contents: string, filePath?: string) {
    const path = this.outputResolve(type, filePath);
    if (path === null) return null;
    const dir = dirname(path);
    await Deno.mkdir(dir, { recursive: true });
    await Deno.writeTextFile(path, contents);
  }

  supports(type: OutputType) {
    return !!this.configFile[type]?.output;
  }

  type(type: OutputType) {
    return this.configFile[type];
  }

  deno() {
    return this.configFile[OutputType.Deno];
  }
  esm() {
    return this.configFile[OutputType.ESM];
  }
  docs() {
    return this.configFile[OutputType.Docs];
  }
}

export function configFilePath() {
  return cwdResolve(CONFIG_FILE);
}

export async function saveConfig(config: ConfigFile) {
  const configToml = stringify({ ...config }, { keyAlignment: false });
  await Deno.writeTextFile(configFilePath(), configToml);
}

// memoize / singleton
let sessionConfig: ConfigFile | undefined;

export async function getConfig(): Promise<ConfigFile> {
  if (typeof sessionConfig !== 'undefined') return sessionConfig;
  const path = configFilePath();
  if (await fileExists(path)) {
    const toml = await Deno.readTextFile(configFilePath());
    sessionConfig = parse(toml) as unknown as ConfigFile;
  } else {
    sessionConfig = defaultConfigFile;
  }
  return sessionConfig;
}
