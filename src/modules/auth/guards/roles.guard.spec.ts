import { ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RolEnum } from '../enums/rol.enum';
import { RolesGuard } from './roles.guard';

// Arma un contexto falso: solo lo que el guard realmente usa
function crearContexto(roles: string[]): ExecutionContext {
  return {
    getHandler: () => ({}),
    getClass: () => ({}),
    switchToHttp: () => ({
      getRequest: () => ({ user: { id: 1, usuario: 'prueba', roles } }),
    }),
  } as unknown as ExecutionContext;
}

describe('RolesGuard', () => {
  let reflector: Reflector;
  let guard: RolesGuard;

  beforeEach(() => {
    reflector = new Reflector();
    guard = new RolesGuard(reflector);
  });

  it('deja pasar si la ruta no exige ningun rol', () => {
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(undefined);

    expect(guard.canActivate(crearContexto([RolEnum.CLIENTE]))).toBe(true);
  });

  it('rechaza a un CLIENTE en una ruta de ADMIN o GERENTE', () => {
    jest
      .spyOn(reflector, 'getAllAndOverride')
      .mockReturnValue([RolEnum.ADMIN, RolEnum.GERENTE]);

    expect(guard.canActivate(crearContexto([RolEnum.CLIENTE]))).toBe(false);
    expect(guard.canActivate(crearContexto([RolEnum.GERENTE]))).toBe(true);
  });
});