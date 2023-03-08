import { ClarinetChain, Tx } from '../../clarinet-deps.ts';
import { cvToValue } from '../../encoder.ts';
import { Session, SessionContract } from '../../session.ts';
import { ClarityAbiTypeTuple } from '../../types.ts';
import { getContractName } from '../../utils.ts';
import { log } from '../logger.ts';

function deployContract({
  chain,
  source,
  name,
  deployer,
}: {
  chain: ClarinetChain;
  source: string;
  name: string;
  deployer: string;
}) {
  const deploy = Tx.deployContract(name, source, deployer);
  (deploy.deployContract as any).clarityVersion = 2;
  (deploy.deployContract as any).epoch = '2.1';
  return chain.mineBlock([deploy]);
}

export function getVariables(contract: SessionContract, sessionId: number) {
  const chain = new ClarinetChain(sessionId);

  const [deployer] = contract.contract_id.split('.');
  const fakeId = `${getContractName(contract.contract_id)}-vars`;
  log.info(`Deploying ${contract.contract_id} for variables.`);

  if (contract.contract_interface.variables.length === 0) {
    log.info(
      `Contract ${
        getContractName(
          contract.contract_id,
          false,
        )
      } has no variables`,
    );
    return '{}';
  }

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

  const { receipts } = deployContract({
    chain,
    deployer,
    name: fakeId,
    source: fullSrc,
  });
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
    const varString = getVariables(contract, session.session_id);
    return convertVariables(contract, varString);
  });
}
