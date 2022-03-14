import { validate } from '@reactor-room/itopplus-back-end-helpers';
import { validateResponseVisitor, validateSetVisitorInput } from '../../validate/visitor.model';

export function validateVisitorResponse<T>(data: T): T {
  return validate(validateResponseVisitor, data);
}

export function validateSetVisitor<T>(data: T): T {
  return validate(validateSetVisitorInput, data);
}
