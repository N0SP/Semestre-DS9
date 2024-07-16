import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private readonly apiUrl = 'http://localhost:4000/api';  
  private readonly http = inject(HttpClient);

  get(endpoint: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${endpoint}`);
  }

  post(endpoint: string, formData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/${endpoint}`, formData);
  }

  getUsers(endpoint: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${endpoint}`);
  }

  postUsuario(endpoint: string, formData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/${endpoint}`, formData);
  }

  postUsuarioPorId(endpoint: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/${endpoint}`, {});
  }

  updateUsuario(endpoint: string, formData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/${endpoint}`, formData);
  }

  deleteUser(endpoint: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/${endpoint}`, {});
  }

  postLogin(endpoint: string, formData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/${endpoint}`, formData);
  }

  getEventos(endpoint: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${endpoint}`);
  }

  postEventoId(endpoint: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/${endpoint}`, {});
  }

  getEventoId(endpoint: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${endpoint}`);
  }

  getBoletos(endpoint: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${endpoint}`);
  }

  putStatusEvento(endpoint: string, formData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/${endpoint}`, formData);
  }

  postContact(endpoint: string, formData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/${endpoint}`, formData);
  }

  getMessages(endpoint: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${endpoint}`);
  }

  postMessagePorId(endpoint: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/${endpoint}`, {});
  }

  getFaqs(endpoint: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${endpoint}`);
  }

  getEventoPorId(endpoint: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${endpoint}`);
  }

  getBoletoPorIdEvento(endpoint: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${endpoint}`);
  }

  registrarTransaccion(data: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/transaccion`, data);
  }

  obtenerTransacciones(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/transaccion`);
  }

  obtenerTransaccionPorId(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/transaccion/${id}`);
  }

  postMessage(endpoint: string, formData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/${endpoint}`, formData);
  }

  postMessagePorIdUser(endpoint: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/${endpoint}`, {});
  }

  getHistorialPorUsuario(endpoint: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${endpoint}`);
  }
}