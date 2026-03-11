import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductsService } from '../../services/products.service';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './product-form.component.html',
  styleUrl: './product-form.component.scss'
})
export class ProductFormComponent implements OnInit {

  private readonly fb = inject(FormBuilder);
  private readonly productsService = inject(ProductsService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  form!: FormGroup;

  isEditMode = false;
  productId!: string;

  constructor(){}

  ngOnInit(): void {

    this.form = this.fb.group({
      id: ['', Validators.required],
      name: ['', Validators.required],
      description: ['', Validators.required],
      logo: ['', Validators.required],
      date_release: ['', Validators.required],
      date_revision: ['', Validators.required]
    });

    this.productId = this.route.snapshot.paramMap.get('id')!;

    if (this.productId) {
      this.isEditMode = true;
      this.loadProduct();
    }

  }

  loadProduct(): void {
    this.productsService.getProductById(this.productId)
      .subscribe((product: any) => {
        this.form.patchValue(product);
      });
  }

  saveProduct(): void {
    if (this.form.invalid) return;

    const product = this.form.value;

    if (this.isEditMode) {

      this.productsService.updateProduct(this.productId, product)
        .subscribe(() => {
          this.router.navigate(['/products']);
        });

    } else {

      this.productsService.createProduct(product)
        .subscribe(() => {
          this.router.navigate(['/products']);
        });
    }
  }
}