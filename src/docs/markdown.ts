import { getTypeString } from '../encoder.ts';
import { basename } from '../deps.ts';
import {
  ClaridocContract,
  ClaridocFunction,
  ClaridocParam,
  // Comments,
  createContractDocInfo,
} from './index.ts';
import { Session, SessionContract } from '../session.ts';
import { getContractName, sortContracts } from '../cli/cli-utils.ts';

export function generateMarkdown(
  { contract, contractFile }: {
    contract: SessionContract;
    contractFile?: string;
  },
) {
  const contractName = getContractName(contract.contract_id, false);
  const doc = createContractDocInfo({
    contractSrc: contract.source,
    abi: contract.contract_interface,
  });

  const functions = doc.functions.map((fn) =>
    markdownFunction(fn, contractFile)
  );
  let fileLine = '';
  if (contractFile) {
    const fileName = basename(contractFile);
    fileLine = `\n[\`${fileName}\`](${contractFile})`;
  }

  return `
# ${contractName}
${fileLine}

${doc.comments.join('\n')}

${markdownTOC(doc)}

## Functions

${functions.join('\n\n')}
`;
}

export function markdownFunction(fn: ClaridocFunction, contractFile?: string) {
  const params = mdParams(fn);
  const returnType = getTypeString(fn.abi.outputs.type);
  const paramSigs = fn.abi.args.map((arg) => {
    return `(${arg.name} ${getTypeString(arg.type)})`;
  });

  const startLine = fn.startLine + 1;

  let link = '';
  if (contractFile) {
    link = `[View in file](${contractFile}#L${startLine})`;
  }

  const source = `<details>
  <summary>Source code:</summary>

\`\`\`clarity
${fn.source.join('\n')}
\`\`\`
</details>
`;

  const sig = `(define-${fn.abi.access.replace('_', '-')} (${fn.abi.name} (${
    paramSigs.join(
      ' ',
    )
  }) ${returnType})`;

  return `### ${fn.abi.name}

${link}

\`${sig}\`

${fn.comments.text.join('\n')}

${source}

${params}`;
}

function mdParams(fn: ClaridocFunction) {
  if (fn.abi.args.length === 0) return '';
  const params = Object.values(fn.comments.params).map(markdownParam);

  return `**Parameters:**

| Name | Type | Description |
| --- | --- | --- |
${params.join('\n')}`;
}

function markdownParam(param: ClaridocParam) {
  const typeString = getTypeString(param.abi.type);
  return `| ${param.abi.name} | ${typeString} | ${param.comments.join('\n')} |`;
}

function markdownTOC(contract: ClaridocContract) {
  const publics = contract.functions.filter((fn) => fn.abi.access === 'public');
  const readOnly = contract.functions.filter((fn) =>
    fn.abi.access === 'read_only'
  );
  const privates = contract.functions.filter((fn) =>
    fn.abi.access === 'private'
  );

  function tocLine(fn: ClaridocFunction) {
    const name = fn.abi.name;
    return `- [\`${name}\`](#${name})`;
  }

  return `**Public functions:**

${publics.map(tocLine).join('\n')}

**Read-only functions:**

${readOnly.map(tocLine).join('\n')}

**Private functions:**

${privates.map(tocLine).join('\n')}`;
}

export function generateReadme(session: Session) {
  const contractLines = sortContracts(session.contracts).map((contract) => {
    const name = getContractName(contract.contract_id, false);
    const fileName = `${name}.md`;
    return `- [\`${name}\`](${fileName})`;
  });
  const fileContents = `# Contracts
  
  ${contractLines.join('\n')}
  `;

  return fileContents;
}
