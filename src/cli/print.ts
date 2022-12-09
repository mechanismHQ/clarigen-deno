import { getSession } from '../session.ts';
import { PRINT_LABEL } from './clarinet-wrapper.ts';
import { mapVariables } from './files/variables.ts';
import { serialize } from './files/base.ts';

function printSession() {
  const result = getSession();

  const variables = mapVariables(result);

  const varStrings = variables.map(serialize);

  console.log([
    PRINT_LABEL,
    JSON.stringify({
      variables: varStrings,
      ...result,
    }),
  ].join(''));
}

printSession();
