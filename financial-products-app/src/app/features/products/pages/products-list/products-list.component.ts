import { CommonModule, DatePipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Product } from '../../models/product.model';
import { ProductsService } from '../../services/products.service';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { debounceTime, Subject } from 'rxjs';

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

  // PARA TABLA
  products: Product[] = [];
  loading = false;
  error = false;

  // PARA BUSQUEDA 
  searchSubject = new Subject<string>();
  searchTerm = '';
  filteredProducts: Product[] = [];

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

  goToCreate(): void {
    this.router.navigate(['/products/new']);
  }

  editProduct(id: string): void {
    this.router.navigate(['/products', id, 'edit']);
  }

  deleteProduct(id: string): void {

    const confirmDelete = confirm('¿Deseas eliminar este producto?');

    if (!confirmDelete) return;
    
    this.productsService.deleteProduct(id).subscribe(() => {
      this.loadProducts();
    });

  }
}