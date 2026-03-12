import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';

import { ProductFormComponent } from './product-form.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ActivatedRoute, provideRouter, Router } from '@angular/router';
import { ProductsService } from '../../services/products.service';
import { of } from 'rxjs';
const mockProduct = {
  id: 'test-1',
  name: 'Test Product',
  description: 'Test Description Long Enough',
  logo: 'logo.png',
  date_release: '2024-01-01',
  date_revision: '2025-01-01'
};

describe('ProductFormComponent', () => {
  let component: ProductFormComponent;
  let fixture: ComponentFixture<ProductFormComponent>;
  let productsServiceMock: jest.Mocked<ProductsService>;
  let router: Router;

  const createComponent = async (paramId: string | null = null) => {
    productsServiceMock = {
      getProductById: jest.fn().mockReturnValue(of(mockProduct)),
      createProduct: jest.fn().mockReturnValue(of(mockProduct)),
      updateProduct: jest.fn().mockReturnValue(of(mockProduct)),
      verifyProductId: jest.fn().mockReturnValue(of(false)),
    } as any;

    await TestBed.configureTestingModule({
      imports: [ProductFormComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
        { provide: ProductsService, useValue: productsServiceMock },
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { paramMap: { get: () => paramId } } }
        },
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ProductFormComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    // Prevent actual navigation — avoids NG04002 "cannot match routes"
    jest.spyOn(router, 'navigate').mockResolvedValue(true);
    fixture.detectChanges();
  };

  describe('Create mode (no id)', () => {
    beforeEach(async () => await createComponent(null));

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should initialize form with empty values', () => {
      expect(component.isEditMode).toBe(false);
      expect(component.form.get('id')?.value).toBe('');
      expect(component.form.get('name')?.value).toBe('');
    });

    it('should auto-calculate date_revision when date_release changes', fakeAsync(() => {
      component.form.get('date_release')?.setValue('2024-03-15');
      tick();
      expect(component.form.get('date_revision')?.value).toBe('2025-03-15');
    }));

    it('validateId() should check if ID exists', () => {
      component.form.get('id')?.setValue('abc');
      component.validateId();
      expect(productsServiceMock.verifyProductId).toHaveBeenCalledWith('abc');
    });

    it('validateId() should set idExists error when ID already exists', fakeAsync(() => {
      productsServiceMock.verifyProductId.mockReturnValue(of(true));
      component.form.get('id')?.setValue('existing-id');
      component.validateId();
      tick();
      expect(component.form.get('id')?.errors).toEqual({ idExists: true });
    }));

    it('validateId() should skip check when form is in edit mode', () => {
      component.isEditMode = true;
      component.validateId();
      expect(productsServiceMock.verifyProductId).not.toHaveBeenCalled();
    });

    it('saveProduct() should not call createProduct if form is invalid', () => {
      component.saveProduct();
      expect(productsServiceMock.createProduct).not.toHaveBeenCalled();
    });

    it('saveProduct() should call createProduct and navigate when form is valid', fakeAsync(() => {
      component.form.setValue({
        id: 'abc123',
        name: 'Valid Name',
        description: 'Valid description long enough',
        logo: 'logo.png',
        date_release: '2024-01-01',
        date_revision: '2025-01-01'
      });
      component.saveProduct();
      tick();
      expect(productsServiceMock.createProduct).toHaveBeenCalled();
      expect(router.navigate).toHaveBeenCalledWith(['/products']);
    }));

    it('cancel() should navigate to /products', () => {
      component.cancel();
      expect(router.navigate).toHaveBeenCalledWith(['/products']);
    });
  });

  describe('Edit mode (with id)', () => {
    beforeEach(async () => await createComponent('test-1'));

    it('should set isEditMode to true', () => {
      expect(component.isEditMode).toBe(true);
    });

    it('should call getProductById and patch form', () => {
      expect(productsServiceMock.getProductById).toHaveBeenCalledWith('test-1');
    });

    it('saveProduct() should call updateProduct and navigate when form is valid', fakeAsync(() => {
      component.form.setValue({
        id: 'test-1',
        name: 'Updated Name',
        description: 'Updated description long enough',
        logo: 'logo.png',
        date_release: '2024-01-01',
        date_revision: '2025-01-01'
      });
      component.saveProduct();
      tick();
      expect(productsServiceMock.updateProduct).toHaveBeenCalledWith('test-1', expect.any(Object));
      expect(router.navigate).toHaveBeenCalledWith(['/products']);
    }));
  });
});
