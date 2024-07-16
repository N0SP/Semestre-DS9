import { inject, signal } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { SessionService } from '../services/session.service';

export const authGuard: CanActivateFn = (route, state) => {

  const sessionService = inject(SessionService);
  const router = inject(Router);

  const userRol = signal<number>(0);
  sessionService.userRole$.subscribe(roleId =>  userRol.set(roleId));
  userRol.set(isNaN(parseInt(sessionService.getIdRolToken(), 10)) ? 0 : parseInt(sessionService.getIdRolToken(), 10));
  
  return userRol() !== 1 ? true : router.navigate(['/events']);  
};

export const authGuard2: CanActivateFn = (route, state) => {
  const sessionService = inject(SessionService);
  const router = inject(Router);

  const userRol = signal<number>(0);
  sessionService.userRole$.subscribe(roleId =>  userRol.set(roleId));
  userRol.set(isNaN(parseInt(sessionService.getIdRolToken(), 10)) ? 0 : parseInt(sessionService.getIdRolToken(), 10));
  
  return userRol() === 1 ? true : router.navigate(['/home']);  
};