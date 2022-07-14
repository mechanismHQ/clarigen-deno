import { array, parseToml, Schema, string, Type, unknown } from '../deps.ts';
import { cwdResolve } from './utils.ts';

export const ClarinetSchema = Schema({
  project: {
    requirements: array.of({ contract_id: string }).optional(),
  },
});

export type ClarinetConfig = Type<typeof ClarinetSchema>;

export async function getClarinetConfig(path: string): Promise<ClarinetConfig> {
  const file = await Deno.readTextFile(path);
  const config = unknown.schema(ClarinetSchema)(parseToml(file));
  return config;
}

if (import.meta.main) {
  const config = await getClarinetConfig(cwdResolve('Clarinet.toml'));
  console.log(config);
}
