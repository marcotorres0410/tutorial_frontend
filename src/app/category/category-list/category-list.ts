import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Category } from '../model/category';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CategoryService } from '../category';
import { MatDialog } from '@angular/material/dialog';
import { CategoryEdit } from '../category-edit/category-edit';

@Component({
    selector: 'app-category-list',
    standalone: true,
    imports: [
        MatButtonModule,
        MatIconModule,
        MatTableModule,
        CommonModule
    ],
    templateUrl: './category-list.html',
    styleUrl: './category-list.scss'
})
export class CategoryList implements OnInit{

    dataSource = new MatTableDataSource<Category>();
    displayedColumns: string[] = ['id', 'name', 'action'];

    constructor(
        private categoryService: CategoryService,
        public dialog: MatDialog,
    ) { }

    ngOnInit(): void {
        this.categoryService.getCategories().subscribe(
            categories => this.dataSource.data = categories
        );
    }

    createCategory() {    
    const dialogRef = this.dialog.open(CategoryEdit, {
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      this.ngOnInit();
    });    
  }  

  editCategory(category: Category) {
    const dialogRef = this.dialog.open(CategoryEdit, {
      data: { category }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.ngOnInit();
    });
  }

  deleteCategory(category: Category) {
    // Llamamos al servicio pasándole el ID de la categoría a borrar
    this.categoryService.deleteCategory(category.id).subscribe(() => {
      // Cuando el servidor nos avisa de que lo ha borrado, refrescamos la tabla
      this.ngOnInit(); 
    });
  }

  
}