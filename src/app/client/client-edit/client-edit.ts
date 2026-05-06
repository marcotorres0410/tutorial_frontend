import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ClientService } from '../client.service';
import { Client } from '../model/Client';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';


@Component({
    selector: 'app-client-edit',
    standalone: true,
    imports: [FormsModule, MatFormFieldModule, MatInputModule, MatButtonModule],
    templateUrl: './client-edit.html',
    styleUrl: './client-edit.scss'
})
export class ClientEdit implements OnInit {
    client: Client;

    constructor(
        public dialogRef: MatDialogRef<ClientEdit>,
        @Inject(MAT_DIALOG_DATA) public data: { client: Client },
        private clientService: ClientService
    ) { }

    ngOnInit(): void {
        // Clonamos el objeto para no modificar directamente el listado hasta darle a guardar
        if (this.data.client != null) {
            this.client = Object.assign({}, this.data.client);
        } else {
            this.client = new Client();
        }
    }

    onSave() {
        this.clientService.saveClient(this.client).subscribe({
            next: () => {
                this.dialogRef.close(true); // Todo ha ido bien, cerramos
            },
            error: (err) => {
                // ¡AQUÍ SALTA NUESTRA REGLA DE NEGOCIO!
                alert("No se ha podido guardar: El nombre del cliente ya existe.");
            }
        });
    }

    onClose() {
        this.dialogRef.close(false); // Cerramos sin guardar
    }
}