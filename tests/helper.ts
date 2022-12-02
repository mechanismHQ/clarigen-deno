export {
  Chain,
  err,
  factory,
  hexToBytes,
  ok,
  tx,
  txErr,
  txOk,
  // } from "../../deno-clarigen/src/index.ts";
} from 'https://deno.land/x/clarigen@v0.4.8/mod.ts';
import { factory } from 'https://deno.land/x/clarigen@v0.4.8/mod.ts';
import { simnet } from './../artifacts/clarigen/index.ts';

export const { test, contracts } = factory(simnet);

export const {
  counter,
  ftTrait,
  tester,
} = contracts;
