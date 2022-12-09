// simple script for testing variable eval
import { getSession } from '../src/session.ts';
import { convertVariables, getVariables } from '../src/cli/files/variables.ts';

const session = getSession();

session.contracts.forEach((c) => {
  const vars = getVariables(c, session.session_id);
  console.log(c.contract_id, '\n', vars);
  const converted = convertVariables(c, vars);
  console.log(converted);
});
