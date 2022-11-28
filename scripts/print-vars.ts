import { contracts } from '../artifacts/clarigen/index.ts';
import { getSession } from '../src/session.ts';
import { ClarinetChain, Tx } from '../src/clarinet-deps.ts';

const session = getSession();

console.log(session.contracts.map(c => c.contract_id));

// const [contract] = session.contracts;
const contract = session.contracts.find(c => c.contract_id === 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.counter');
if (!contract) throw 'Fail'

const [deployer, contractName] = contract.contract_id.split('.');
const fakeId = `${contractName}-print-vars`;
console.log(fakeId);

let varFn = `(define-read-only (get-all-vars-clarigen) {\n`;

const varLines = contract.contract_interface.variables.map((variable) => {
  let varLine = `${variable.name}: `;
  if (variable.access === 'constant') {
    varLine += `${variable.name}`;
  } else {
    varLine += `(var-get ${variable.name})`
  }
  return varLine;
});
varFn += varLines.map(l => ` ${l},`).join('\n')

varFn += '\n})';

const chain = new ClarinetChain(session.session_id);

const fullSrc = contract.source + `\n\n${varFn}\ntrue`;

console.log(varFn);

// console.log(fullSrc);

const testFn = '\nu1'
// const deploy = Tx.deployContract(fakeId, testFn, deployer);
const deploy = Tx.deployContract(fakeId, fullSrc, deployer);

console.log('deploying');
const block = chain.mineBlock([deploy]);
console.log(block.receipts[0]);

const fullId = `${deployer}.${fakeId}`;

const result = chain.callReadOnlyFn(fullId, 'get-all-vars-clarigen', [], deployer);
console.log(result.result);
// console.log(varFn);
// 

