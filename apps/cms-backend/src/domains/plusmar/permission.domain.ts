import type { IGQLContext } from '@reactor-room/itopplus-model-lib';
import { AuthError } from '@reactor-room/itopplus-services-lib';
import { EnumAuthError } from '@reactor-room/itopplus-model-lib';

export function requireAdmin(target: unknown, propertyName: string, propertyDesciptor: PropertyDescriptor): PropertyDescriptor {
  const method = propertyDesciptor.value;
  propertyDesciptor.value = function (...args: any[]) {
    const context: IGQLContext = args[2];
    const { page } = context.payload;
    if (page.page_role === 'STAFF') throw new AuthError(EnumAuthError.PERMISSION_DENIED);
    const result = method.apply(this, args);
    return result;
  };
  return propertyDesciptor;
}

export function requireOwner(target: unknown, propertyName: string, propertyDesciptor: PropertyDescriptor): PropertyDescriptor {
  const method = propertyDesciptor.value;
  propertyDesciptor.value = function (...args: any[]) {
    const context: IGQLContext = args[2];
    const { subscription } = context.payload;
    if (subscription.role !== 'OWNER') throw new AuthError(EnumAuthError.PERMISSION_DENIED);
    const result = method.apply(this, args);
    return result;
  };
  return propertyDesciptor;
}
