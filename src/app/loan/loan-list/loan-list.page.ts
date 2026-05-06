import { Component, OnInit, inject } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Loan } from '../model/Loan';
import { Game } from '../../game/model/Game';
import { Client } from '../../client/model/Client';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { provideNativeDateAdapter } from '@angular/material/core';
import { LoanService } from '../loan.service';
import { GameService } from '../../game/game.service';
import { ClientService } from '../../client/client.service';
import { Pageable } from '../../core/model/page/Pageable';
import { MatDialog } from '@angular/material/dialog';
import { DialogConfirmation } from '../../core/dialog-confirmation/dialog-confirmation';
import { LoanEdit } from '../loan-edit/loan-edit';

@Component({
    selector: 'app-loan-list',
    standalone: true,
    providers: [provideNativeDateAdapter()], 
    imports: [
        MatButtonModule,
        MatIconModule,
        MatTableModule,
        MatPaginatorModule,
        MatSelectModule,
        MatDatepickerModule,
        MatInputModule,
        MatFormFieldModule,
        FormsModule,
        CommonModule
    ],
    templateUrl: './loan-list.page.html',
    styleUrl: './loan-list.page.scss'
})
export class LoanListPage implements OnInit {

    dataSource = new MatTableDataSource<Loan>();
    displayedColumns: string[] = ['id', 'game', 'client', 'startDate', 'endDate', 'action'];

    pageNumber: number = 0;
    pageSize: number = 5;
    totalElements: number = 0;

    // Variables para los filtros
    games: Game[] = [];
    clients: Client[] = [];
    filterGame: Game;
    filterClient: Client;
    filterDate: Date;

    protected readonly loanService = inject(LoanService);
    protected readonly gameService = inject(GameService);
    protected readonly clientService = inject(ClientService);
    protected readonly dialog = inject(MatDialog);

    constructor() { }

    ngOnInit(): void {
        this.gameService.getGames().subscribe(games => {
            setTimeout(() => this.games = games);
        });
        
        this.clientService.getClients().subscribe(clients => {
            setTimeout(() => this.clients = clients);
        });
        
        this.loadPage();
    }

    loadPage(event?: PageEvent) {
        let pageable: Pageable = {
            pageNumber: this.pageNumber,
            pageSize: this.pageSize,
            sort: [{
                property: 'id',
                direction: 'ASC'
            }]
        }

        if (event != null) {
            pageable.pageSize = event.pageSize;
            pageable.pageNumber = event.pageIndex;
        }

         let gameId = this.filterGame != null ? this.filterGame.id : null;
        let clientId = this.filterClient != null ? this.filterClient.id : null;

        // FIX DE LA ZONA HORARIA: Convertimos a texto YYYY-MM-DD
        let dateStr = null;
        if (this.filterDate != null) {
            dateStr = this.filterDate.getFullYear() + "-" + 
                      ("0" + (this.filterDate.getMonth() + 1)).slice(-2) + "-" + 
                      ("0" + this.filterDate.getDate()).slice(-2);
        }

        // Le pasamos el dateStr al servicio
        this.loanService.getLoans(pageable, gameId, clientId, dateStr).subscribe(data => {
            // Metemos un pequeño tiempo para que Angular no se maree con el cambio a 0 elementos
            setTimeout(() => {
                this.dataSource.data = data.content;
                this.pageNumber = data.pageable.pageNumber;
                this.pageSize = data.pageable.pageSize;
                this.totalElements = data.totalElements;
            });
        });
    }

    onSearch() {
        this.pageNumber = 0; // Volvemos a la página 1 al buscar
        this.loadPage();
    }

    onCleanFilter() {
        this.filterGame = null;
        this.filterClient = null;
        this.filterDate = null;
        this.onSearch();
    }

    createLoan() {
        const dialogRef = this.dialog.open(LoanEdit, {
            data: {}
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.onSearch();
            }
        });
    }

    editLoan(loan: Loan) {
        const dialogRef = this.dialog.open(LoanEdit, {
            data: { loan: loan }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.onSearch();
            }
        });
    }

    deleteLoan(loan: Loan) {
        const dialogRef = this.dialog.open(DialogConfirmation, {
            data: { title: "Eliminar préstamo", description: "Atención, si borra el préstamo se perderán sus datos.<br> ¿Desea eliminar el préstamo?" }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.loanService.deleteLoan(loan.id).subscribe(() => {
                    this.loadPage();
                });
            }
        });
    }
}