import { getSession } from "./index.ts";
import { generateSingleFile } from "./single.ts";

const result = getSession();

console.log(JSON.stringify(result));
