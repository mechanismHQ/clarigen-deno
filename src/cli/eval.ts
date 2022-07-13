// import { getSession } from './index.ts';
// import 'https://deno.land/x/clarinet@v0.31.0/index.ts';
// import { cvToValue } from '../encoder.ts';

// const _session = getSession();

// const [contract] = session.contracts;

// const result = JSON.parse((Deno as any).core.opSync("api/v1/eval_snippet", {
//   sessionId: session.session_id,
//   sender: "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM",
//   contract: "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.tester",
//   snippet: "(* u2 u2)",
// }));

// const valString = result.result as string;
// const value = cvToValue<bigint[]>(valString, {
//   list: { type: "uint128", length: 10 },
// });
// console.log(cvToValue(valString, { list: { type: "uint128", length: 10 } }));

// console.log(result);
