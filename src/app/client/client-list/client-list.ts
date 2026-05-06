import { Component, OnInit, inject } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Client } from '../model/Client';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ClientService } from '../client.service';
import { MatDialog } from '@angular/material/dialog';
import { ClientEdit } from '../client-edit/client-edit';
import { DialogConfirmation } from '../../core/dialog-confirmation/dialog-confirmation';

@Component({
    selector: 'app-client-list',
    standalone: true,
    imports: [
        MatButtonModule,
        MatIconModule,
        MatTableModule,
        CommonModule
    ],
    templateUrl: './client-list.html',
    styleUrl: './client-list.scss'
})
export class ClientList implements OnInit {

    dataSource = new MatTableDataSource<Client>();
    displayedColumns: string[] = ['id', 'name', 'action'];

    protected readonly clientService = inject(ClientService);
    protected readonly dialog = inject(MatDialog);

    constructor() { }

    ngOnInit(): void {
        this.loadData();
    }

    loadData() {
        this.clientService.getClients().subscribe(clients => {
            this.dataSource.data = clients;
        });
    }

    createClient() {
        const dialogRef = this.dialog.open(ClientEdit, {
            data: {}
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.loadData();
            }
        });
    }

    editClient(client: Client) {
        const dialogRef = this.dialog.open(ClientEdit, {
            data: { client: client }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.loadData();
            }
        });
    }

    deleteClient(client: Client) {
        const dialogRef = this.dialog.open(DialogConfirmation, {
            data: { 
                title: "Eliminar cliente", 
                description: "Atención, si borra el cliente se perderán sus datos.<br> ¿Desea eliminar el cliente?" 
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.clientService.deleteClient(client.id).subscribe(() => {
                    this.loadData();
                });
            }
        });
    }
}