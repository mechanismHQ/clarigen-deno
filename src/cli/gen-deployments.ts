import { getSession } from "./index.ts";
import { generateSingleFile } from "./single.ts";
// import * as path from "https://deno.land/std@0.144.0/path/mod.ts";
import { generateDeployments } from "./deployments.ts";

// const result = getSession();
// console.log("result", result);
// const singleFile = await generateSingleFile(result);
// console.log(singleFile);

// const baseDir = path.relative(Deno.cwd(), "./clarigen");
// await Deno.mkdir("./artifacts/clarigen", { recursive: true });
// await Deno.writeTextFile("./artifacts/clarigen/single.ts", singleFile);

await generateDeployments("./artifacts/clarigen");
