import { assertEquals } from '../src/deps.ts';
import { types } from '../src/deps.ts';
import { cvToValue, hexToBytes, valueToCV } from '../src/encoder.ts';
import { ClarityAbiType } from '../src/types.ts';
import { tupleMock, tupleType } from './mocks.ts';

function expectValue(input: string, type: ClarityAbiType, expected: any) {
  const decoded = cvToValue(input, type);
  assertEquals(decoded, expected);
  return expected;
}

function expectDecodeEncode(
  input: string,
  type: ClarityAbiType,
  expected: any,
) {
  expectValue(input, type, expected);
  const encoded = valueToCV(expected, type);
  assertEquals(encoded, input);
}

Deno.test('encoding and decoding cv', () => {
  expectDecodeEncode(
    types.ascii('asdf'),
    { 'string-ascii': { length: 1 } },
    'asdf',
  );
  expectDecodeEncode(
    types.utf8('asdf'),
    { 'string-utf8': { length: 1 } },
    'asdf',
  );

  expectDecodeEncode(types.bool(true), 'bool', true);
  expectDecodeEncode(types.bool(false), 'bool', false);

  expectDecodeEncode(types.uint(100), 'uint128', 100n);
  expectDecodeEncode(types.int(123), 'int128', 123n);

  expectDecodeEncode(types.principal('asdf'), 'principal', 'asdf');
  expectDecodeEncode(types.principal('asdf'), 'trait_reference', 'asdf');

  const buff = hexToBytes('aaff');
  expectDecodeEncode(types.buff(buff), { 'buffer': { length: 1 } }, buff);

  expectDecodeEncode(types.none(), { optional: 'bool' }, null);
  expectDecodeEncode(types.some(types.bool(true)), { optional: 'bool' }, true);

  expectDecodeEncode(types.none(), 'none', null);

  const list = '[u128, u233]';
  const listNative = [128n, 233n];
  const listType = { 'list': { type: 'uint128', length: 2 } } as const;
  expectValue(list, listType, listNative);

  const listEncoded = valueToCV(listNative, listType);
  assertEquals(types.list(listNative.map((n) => types.uint(n))), listEncoded);

  expectDecodeEncode(
    types.principal('ST123.example'),
    'principal',
    'ST123.example',
  );

  assertEquals(cvToValue('\'ST123.addr', 'principal'), 'ST123.addr');
  assertEquals(cvToValue('ST123.addr', 'principal'), 'ST123.addr');
  assertEquals(cvToValue('\'ST123.addr', 'trait_reference'), 'ST123.addr');
  assertEquals(cvToValue('ST123.addr', 'trait_reference'), 'ST123.addr');
});

Deno.test({
  name: 'tuples are camelized and kebabed correctly',
  // only: true,
  fn: () => {
    const jsValue = cvToValue(tupleMock.encoded, tupleType);
    assertEquals(jsValue, tupleMock.jsValue);

    const encoded = valueToCV(tupleMock.jsValue, tupleType);
    assertEquals(encoded, tupleMock.encoded);
  },
});
