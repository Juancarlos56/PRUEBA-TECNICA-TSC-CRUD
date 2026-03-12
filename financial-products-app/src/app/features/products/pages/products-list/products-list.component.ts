import { CommonModule, DatePipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Product } from '../../models/product.model';
import { ProductsService } from '../../services/products.service';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { debounceTime, Subject } from 'rxjs';
import { ModalComponent } from '../../../../shared/components/modal/modal.component';
import { ModalService } from '../../../../shared/services/modal.service';

@Component({
  selector: 'app-products-list',
  standalone: true,
  imports: [CommonModule, DatePipe, FormsModule],
  templateUrl: './products-list.component.html',
  styleUrl: './products-list.component.scss'
})
export class ProductsListComponent implements OnInit {

  private readonly productsService = inject(ProductsService);
  private readonly router = inject(Router);
  private readonly modalService = inject(ModalService);

  // PARA TABLA
  products: Product[] = [];
  loading = false;
  error = false;

  // PARA BUSQUEDA 
  searchSubject = new Subject<string>();
  searchTerm = '';
  filteredProducts: Product[] = [];

  // PAGINACION
  pageSizeOptions = [5, 10, 20];
  pageSize = 5;

  // MENU
  openMenuId: string | null = null;

  // MODAL DE ELIMINACION
  modalVisible = false;
  productToDelete: string | null = null;

  constructor() {}

  ngOnInit(): void {
    this.loadProducts();

    // rendimiento en llamadas
    this.searchSubject.pipe(debounceTime(300)).subscribe(term => {
      const value = term.toLowerCase();
      this.filteredProducts = this.products.filter(product =>
        product.name.toLowerCase().includes(value) ||
        product.description.toLowerCase().includes(value)
      );
    });

  }

  loadProducts(): void {
    this.loading = true;
    this.productsService.getProducts().subscribe({
      next: (response: any) => {
        console.log({response});        
        this.products = response.data;
        this.filteredProducts = [...this.products];
        this.loading = false;
      },
      error: () => {
        this.error = true;
        this.loading = false;
      }
    });
  }

  toggleMenu(productId: string): void {
    if (this.openMenuId === productId) {
      this.openMenuId = null;
    } else {
      this.openMenuId = productId;
    }

  }

  goToCreate(): void {
    this.router.navigate(['/products/new']);
  }

  editProduct(id: string): void {
    this.router.navigate(['/products', id, 'edit']);
  }

  deleteProduct(id: string): void {
    this.modalService.confirm({
      title: 'Eliminar producto',
      message: `¿Estas seguro de eliminar el producto?`,
      confirmText: 'Confirmar',
      cancelText: 'Cancelar'
    })
    .subscribe(result => {
      if (result) {
        this.productsService.deleteProduct(id)
          .subscribe(() => {
            this.loadProducts();
          });
      }
    });
  }

}