import { Injectable, inject } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class SessionService {

  private readonly cookieService = inject(CookieService);

  private userRoleSubject = new BehaviorSubject<number>(0);
  userRole$ = this.userRoleSubject.asObservable();

  private userIDSubject = new BehaviorSubject<number>(0);
  userID$ = this.userIDSubject.asObservable();

  setSessionToken(formData: any): | void {
    this.cookieService.set('loggedToken', 'true');
    this.cookieService.set('idUserToken', formData.ID);
    this.cookieService.set('nameUserToken', formData.Nombre + ' ' + formData.Apellido);
    this.cookieService.set('idRolToken', formData.ID_RolUsuario);

    this.userRoleSubject.next(formData.ID_RolUsuario);
    this.userIDSubject.next(formData.ID);
  }

  getLoggedToken = (): string => this.cookieService.get('loggedToken');
  getIdUserToken = (): string => this.cookieService.get('idUserToken');
  getNameUserToken = (): string => this.cookieService.get('nameUserToken');
  getIdRolToken = (): string => this.cookieService.get('idRolToken');

  clearSession(): void {
    this.cookieService.delete('loggedToken');
    this.cookieService.delete('idUserToken');
    this.cookieService.delete('nameUserToken');
    this.cookieService.delete('idRolToken');

    this.userRoleSubject.next(0);
    this.userIDSubject.next(0);
  }
}
