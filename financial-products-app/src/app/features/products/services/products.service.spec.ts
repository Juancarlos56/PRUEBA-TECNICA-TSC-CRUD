import { TestBed } from '@angular/core/testing';

import { ProductsService } from './products.service';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { environment } from '../../../../environments/environment';
import { Product } from '../models/product.model';

const API = `${environment.apiUrl}/bp/products`;

const mockProduct: Product = {
  id: 'test-1',
  name: 'Test Product',
  description: 'Test Description',
  logo: 'logo.png',
  date_release: new Date('2024-01-01'),
  date_revision: new Date('2025-01-01')
};


describe('ProductsService', () => {
  let service: ProductsService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ProductsService,
        provideHttpClient(),
        provideHttpClientTesting(), // intercepta las llamadas HTTP
      ]
    });
    service = TestBed.inject(ProductsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // verifica que no haya requests pendientes
  });


  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('getProducts() should return product list', () => {
    const mockResponse = { data: [mockProduct] };

    service.getProducts().subscribe(res => {
      expect(res).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(API);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('getProductById() should return a single product', () => {
    service.getProductById('test-1').subscribe(product => {
      expect(product).toEqual(mockProduct);
    });

    const req = httpMock.expectOne(`${API}/test-1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockProduct);
  });


  it('createProduct() should POST and return created product', () => {
    service.createProduct(mockProduct).subscribe(product => {
      expect(product).toEqual(mockProduct);
    });

    const req = httpMock.expectOne(API);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockProduct);
    req.flush(mockProduct);
  });

  it('updateProduct() should PUT and return updated product', () => {
    const updated = { ...mockProduct, name: 'Updated' };

    service.updateProduct('test-1', updated).subscribe(product => {
      expect(product).toEqual(updated);
    });

    const req = httpMock.expectOne(`${API}/test-1`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(updated);
    req.flush(updated);
  });

  it('deleteProduct() should send DELETE request', () => {
    service.deleteProduct('test-1').subscribe(res => {
      expect(res).toBeNull();
    });

    const req = httpMock.expectOne(`${API}/test-1`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });

  it('verifyProductId() should return true if ID exists', () => {
    service.verifyProductId('test-1').subscribe(exists => {
      expect(exists).toBe(true);
    });

    const req = httpMock.expectOne(`${API}/verification/test-1`);
    expect(req.request.method).toBe('GET');
    req.flush(true);
  });

  it('verifyProductId() should return false if ID does not exist', () => {
    service.verifyProductId('new-id').subscribe(exists => {
      expect(exists).toBe(false);
    });

    const req = httpMock.expectOne(`${API}/verification/new-id`);
    req.flush(false);
  });
});
