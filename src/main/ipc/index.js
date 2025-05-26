import { registerFileHandlers } from './files';
import { registerDatalogHandlers } from './datalog';

export const registerHandlers = () => {
  registerFileHandlers();
  registerDatalogHandlers();
}
