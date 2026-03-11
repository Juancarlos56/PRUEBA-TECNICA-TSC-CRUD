import { CommonModule, DatePipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Product } from '../../models/product.model';
import { ProductsService } from '../../services/products.service';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

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
  searchTerm = '';
  filteredProducts: Product[] = [];

  constructor() {}

  ngOnInit(): void {
    this.loadProducts();
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

  filterProducts(): void {
    const term = this.searchTerm.toLowerCase();
    // Filtro pot nombre y descripcion
    this.filteredProducts = this.products.filter(product =>
      product.name.toLowerCase().includes(term) ||
      product.description.toLowerCase().includes(term)
    );
  }

  goToCreate(): void {
    this.router.navigate(['/products/new']);
  }
}