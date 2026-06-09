import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { LoanService } from '../loan.service';
import { GameService } from '../../game/game.service';
import { ClientService } from '../../client/client.service';
import { Loan } from '../model/Loan';
import { Game } from '../../game/model/Game';
import { Client } from '../../client/model/Client';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar'; 

@Component({
    selector: 'app-loan-edit',
    standalone: true,
    providers: [
        provideNativeDateAdapter(),
        { provide: MAT_DATE_LOCALE, useValue: 'es-ES' }
    ],
    imports: [FormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatSelectModule, MatDatepickerModule, MatSnackBarModule],
    templateUrl: './loan-edit.html',
    styleUrl: './loan-edit.scss'
})
export class LoanEdit implements OnInit {
    loan!: Loan;
    games: Game[] = [];
    clients: Client[] = [];

    constructor(
        public dialogRef: MatDialogRef<LoanEdit>,
        @Inject(MAT_DIALOG_DATA) public data: { loan: Loan },
        private loanService: LoanService,
        private gameService: GameService,
        private clientService: ClientService,
        private snackBar: MatSnackBar 
    ) { }

    ngOnInit(): void {
        if (this.data.loan != null) {
            this.loan = Object.assign({}, this.data.loan);
        } else {
            this.loan = new Loan();
        }

        this.gameService.getGames().subscribe(games => {
            setTimeout(() => {
            this.games = games;
            if (this.loan.game != null) {
                let gameFilter: Game[] = games.filter(game => game.id == this.data.loan.game.id);
                if (gameFilter != null) {
                    this.loan.game = gameFilter[0];
                }
            }
            });
        });

        this.clientService.getClients().subscribe(clients => {
             setTimeout(() => {
            this.clients = clients;
            if (this.loan.client != null) {
                let clientFilter: Client[] = clients.filter(client => client.id == this.data.loan.client.id);
                if (clientFilter != null) {
                    this.loan.client = clientFilter[0];
                }
            }
            });
        });
    }

    onSave() {
        
        if (!this.loan.game || !this.loan.client || !this.loan.startDate || !this.loan.endDate) {
            this.snackBar.open("Todos los campos son obligatorios.", "Cerrar", { duration: 5000 });
            return;
        }

        if (this.loan.endDate < this.loan.startDate) {
            this.snackBar.open("La fecha de fin no puede ser anterior a la de inicio.", "Cerrar", { duration: 5000 });
            return;
        }

        const start = new Date(this.loan.startDate);
        const end = new Date(this.loan.endDate);
        const diffTime = Math.abs(end.getTime() - start.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 

        if (diffDays > 14) {
            this.snackBar.open("El periodo de préstamo no puede ser superior a 14 días.", "Cerrar", { duration: 5000 });
            return;
        }

        this.loanService.saveLoan(this.loan).subscribe({
            next: () => {
                this.dialogRef.close(true);
            },
            error: (err) => {
                this.snackBar.open(err.error?.message || "Error al guardar. Comprueba las validaciones en base de datos.", "Cerrar", { duration: 5000 });
            }
        });
    }

    onClose() {
        this.dialogRef.close(false);
    }
}