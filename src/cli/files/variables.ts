import { ClarinetChain, Tx } from '../../clarinet-deps.ts';
import { cvToValue } from '../../encoder.ts';
import { Session, SessionContract } from '../../session.ts';
import { ClarityAbiTypeTuple } from '../../types.ts';
import { getContractName } from '../../utils.ts';

export function getVariables(contract: SessionContract, sessionId: number) {
  const chain = new ClarinetChain(sessionId);

  const deployer = 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM';
  const fakeId = `${getContractName(contract.contract_id)}-vars`;

  if (contract.contract_interface.variables.length === 0) return '{}';

  let varFn = `{\n`;

  const varLines = contract.contract_interface.variables.map((variable) => {
    let varLine = `${variable.name}: `;
    if (variable.access === 'constant') {
      varLine += `${variable.name}`;
    } else {
      varLine += `(var-get ${variable.name})`;
    }
    return varLine;
  });
  varFn += varLines.map((l) => ` ${l},`).join('\n');

  varFn += '\n}';

  const fullSrc = contract.source + `\n\n${varFn}`;
  chain.switchEpoch('2.1');

  const deploy = Tx.deployContract(fakeId, fullSrc, deployer);
  (deploy.deployContract as any).clarityVersion = 2;

  const { receipts } = chain.mineBlock([deploy]);
  const result = receipts[0].result;

  return result;
}

export function convertVariables(contract: SessionContract, vars: string) {
  const varsAbi: ClarityAbiTypeTuple = {
    tuple: [],
  };
  contract.contract_interface.variables.forEach((v) => {
    varsAbi.tuple.push({
      type: v.type,
      name: v.name,
    });
  });

  return cvToValue(vars, varsAbi);
}

export function mapVariables(session: Session) {
  return session.contracts.map((contract) => {
    try {
      const varString = getVariables(contract, session.session_id);
      return convertVariables(contract, varString);
    } catch (_error) {
      return '{}';
    }
  });
}
