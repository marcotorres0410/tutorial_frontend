import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Client } from './model/Client';

@Injectable({
  providedIn: 'root'
})
export class ClientService {

  protected readonly http = inject(HttpClient);
  private baseUrl = 'http://localhost:8080/client';

  getClients(): Observable<Client[]> {
    return this.http.get<Client[]>(this.baseUrl);
  }

  saveClient(client: Client): Observable<Client> {
    const { id } = client;
    const url = id ? `${this.baseUrl}/${id}` : this.baseUrl;
    return this.http.put<Client>(url, client);
  }

  deleteClient(idClient: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${idClient}`);
  }
}