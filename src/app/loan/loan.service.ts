import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Pageable } from '../core/model/page/Pageable';
import { Loan } from './model/Loan';
import { PaginatedData } from '../core/model/page/PaginatedData';

@Injectable({
  providedIn: 'root'
})
export class LoanService {
  protected readonly http = inject(HttpClient);
  private baseUrl = 'http://localhost:8080/loan';

  getLoans(pageable: Pageable, gameId?: number, clientId?: number, date?: string): Observable<PaginatedData<Loan>> {
    return this.http.post<PaginatedData<Loan>>(this.baseUrl, { 
      pageable: pageable,
      gameId: gameId,
      clientId: clientId,
      date: date 
    });
  }

  deleteLoan(idLoan: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${idLoan}`);
  }

  saveLoan(loan: Loan): Observable<Loan> {
    const { id } = loan;
    const url = id ? `${this.baseUrl}/${id}` : this.baseUrl;
    
    let loanToSave = Object.assign({}, loan);
    
    if (loanToSave.startDate instanceof Date) {
        loanToSave.startDate = new Date(loanToSave.startDate.getTime() - loanToSave.startDate.getTimezoneOffset() * 60000).toISOString().split('T')[0] as any;
    }
    if (loanToSave.endDate instanceof Date) {
        loanToSave.endDate = new Date(loanToSave.endDate.getTime() - loanToSave.endDate.getTimezoneOffset() * 60000).toISOString().split('T')[0] as any;
    }

    return this.http.put<Loan>(url, loanToSave);
  }
}