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
      id: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(10)
        ]
      ],
      name: [
        '',
        [
          Validators.required,
          Validators.minLength(5),
          Validators.maxLength(100)
        ]
      ],
      description: [
        '',
        [
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(200)
        ]
      ],
      logo: ['', Validators.required],
      date_release: ['', Validators.required],
      date_revision: [{ value: '', disabled: true }]
    });

    this.productId = this.route.snapshot.paramMap.get('id')!;

    if (this.productId) {
      this.isEditMode = true;
      this.loadProduct();
    }

    this.form.get('date_release')?.valueChanges.subscribe((date) => {
      if (!date) return;
      const releaseDate = new Date(date);
      const revisionDate = new Date(releaseDate);
      revisionDate.setFullYear(releaseDate.getFullYear() + 1); //fecha revisión = fecha liberación + 1 año

      this.form.patchValue({
        date_revision: revisionDate.toISOString().substring(0, 10)
      });

    });

  }

  loadProduct(): void {
    this.productsService.getProductById(this.productId)
      .subscribe((product: any) => {
        this.form.patchValue(product);
      });
  }
  
  validateId(): void {
    const id = this.form.get('id')?.value;

    if (!id || this.isEditMode) return;

    this.productsService.verifyProductId(id)
      .subscribe((exists: boolean) => {
        if (exists) {
          this.form.get('id')?.setErrors({ idExists: true });
        }
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

  cancel(){
    this.router.navigate(['/products']);
  }
}