import { runClarinet } from '../src/cli/clarinet-wrapper.ts';
import { Config } from '../src/cli/config.ts';
import { getContractName } from '../src/cli/cli-utils.ts';
import { assert, assertEquals, assertStringIncludes } from '../src/dev-deps.ts';
import { createContractDocInfo } from '../src/docs/index.ts';
import { generateMarkdown, generateReadme } from '../src/docs/markdown.ts';

Deno.test({
  name: 'Generating contract docs',
  async fn(t) {
    const config = await Config.load();
    const session = await runClarinet(config);
    const contract = session.contracts.find((c) =>
      c.contract_id.includes('tester')
    )!;

    await t.step('Can parse comments', () => {
      const contractDoc = createContractDocInfo({
        contractSrc: contract.source,
        abi: contract.contract_interface,
      });

      assertEquals(contractDoc.comments, [
        'Test contract for testing Clarigen',
      ]);

      const numFn = contractDoc.functions.find((f) => f.abi.name === 'num')!;
      const nParam = numFn.comments.params.n;

      assertEquals(nParam.comments, ['the number, of course']);

      const tupleFn = contractDoc.functions.find((f) =>
        f.abi.name === 'merge-tuple'
      )!;

      assertEquals(tupleFn.source, [
        '(define-read-only (merge-tuple (i { min-height: uint }))',
        '  (merge i { max-height: u100000 })',
        ')',
      ]);

      const mergeFn = contractDoc.functions.find((f) =>
        f.abi.name === 'merge-tuple'
      )!;
      const iParam = mergeFn.comments.params.i;
      assertEquals(
        iParam.comments.join(' '),
        'a tuple with a key that has a dash in it',
      );
    });

    await t.step('Can parse var/map comments', () => {
      const contractDoc = createContractDocInfo({
        contractSrc: contract.source,
        abi: contract.contract_interface,
      });

      const map = contractDoc.maps[0];
      assertEquals(map.comments.text[0], 'A map for storing stuff');
    });

    await t.step('Can generate markdown file', () => {
      const md = generateMarkdown({
        contract,
        contractFile: 'contracts/tester.clar',
      });

      assertStringIncludes(
        md,
        `### num

[View in file](contracts/tester.clar#L36)

\`(define-public (num ((n uint)) (response uint none))\`

Return a number`,
      );
      assertStringIncludes(md, '# tester');
      assertStringIncludes(md, '### square');
    });

    await t.step('Can generate markdown without contractFile', () => {
      const md = generateMarkdown({ contract });
      const contractName = getContractName(contract.contract_id, false);

      assert(!md.includes(`[${contractName}]`));
      assert(!md.includes('[View in file]'));
    });
  },
});

Deno.test({
  name: 'Ordering is always the same for README',
  async fn() {
    let file: string | undefined;
    const count = 10;
    const config = await Config.load();
    async function testReadme() {
      const session = await runClarinet(config);
      const readme = generateReadme(session, {});
      if (file) {
        assertEquals(readme, file);
      }
      file = readme;
    }
    const runs: Promise<void>[] = [];
    for (let i = 0; i < count; i++) {
      runs.push(testReadme());
    }
    await Promise.all(runs);
  },
});
