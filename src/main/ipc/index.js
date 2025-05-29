import { registerFileHandlers } from './files';
import { registerDatalogHandlers } from './datalog';
import { registerRenderHandlers } from './render';

export const registerHandlers = () => {
  registerFileHandlers();
  registerDatalogHandlers();
  registerRenderHandlers();
}
