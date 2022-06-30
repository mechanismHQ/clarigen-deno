import { getSession } from "./index.ts";
import { generateSingleFile } from "./single.ts";

const result = getSession();
const singleFile = await generateSingleFile(result);

await Deno.mkdir("./artifacts/clarigen", { recursive: true });
await Deno.writeTextFile("./artifacts/clarigen/index.ts", singleFile);

// const info = JSON.parse((Deno as any).core.opSync("/api/v1/load_deployment", {
//   // session_id: result.session_id,
//   // name: "deployment",
//   deployment_path: "default.simnet-plan.yaml",
// }));

// ["simnet", "simnet", "testnet", "mainnet"].forEach((network) => {
//   const deployment = `default.${network}-plan.yaml`;
//   const info = JSON.parse((Deno as any).core.opSync("/api/v1/new_session", {
//     // session_id: result.session_id,
//     load_deployment: false,
//     name: "deployment",
//     deployment_path: "default.simnet-plan",
//   }));
//   console.log(network, info);
// });

// await generateDeployments(baseDir);
