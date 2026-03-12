import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';

import { ProductsListComponent } from './products-list.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { Router, provideRouter } from '@angular/router';
import { of, throwError } from 'rxjs';
import { ProductsService } from '../../services/products.service';
import { ModalService } from '../../../../shared/services/modal.service';


const mockProducts = [
  { id: '1', name: 'Product A', description: 'Description A', logo: 'a.png', date_release: '2024-01-01', date_revision: '2025-01-01' },
  { id: '2', name: 'Product B', description: 'Description B', logo: 'b.png', date_release: '2024-02-01', date_revision: '2025-02-01' },
];

describe('ProductsListComponent', () => {
  let component: ProductsListComponent;
  let fixture: ComponentFixture<ProductsListComponent>;
  let productsServiceMock: jest.Mocked<ProductsService>;
  let modalServiceMock: jest.Mocked<ModalService>;
  let router: Router;

  beforeEach(async () => {
    productsServiceMock = {
      getProducts: jest.fn().mockReturnValue(of({ data: mockProducts })),
      deleteProduct: jest.fn().mockReturnValue(of(null)),
    } as any;

    modalServiceMock = {
      confirm: jest.fn().mockReturnValue(of(true)),
    } as any;

    await TestBed.configureTestingModule({
      imports: [ProductsListComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
        { provide: ProductsService, useValue: productsServiceMock },
        { provide: ModalService, useValue: modalServiceMock },
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ProductsListComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load products on init', () => {
    expect(productsServiceMock.getProducts).toHaveBeenCalled();
    expect(component.products).toEqual(mockProducts);
    expect(component.filteredProducts).toEqual(mockProducts);
    expect(component.loading).toBe(false);
  });

  it('should set error=true when loadProducts fails', () => {
    productsServiceMock.getProducts.mockReturnValue(throwError(() => new Error('error')));
    component.loadProducts();
    expect(component.error).toBe(true);
    expect(component.loading).toBe(false);
  });

  it('should filter products by search term', fakeAsync(() => {
    component.searchSubject.next('Product A');
    tick(300);
    expect(component.filteredProducts.length).toBe(1);
    expect(component.filteredProducts[0].name).toBe('Product A');
  }));

  it('should return all products when search term is empty', fakeAsync(() => {
    component.searchSubject.next('');
    tick(300);
    expect(component.filteredProducts.length).toBe(2);
  }));

  it('goToCreate() should navigate to /products/new', () => {
    const navigateSpy = jest.spyOn(router, 'navigate');
    component.goToCreate();
    expect(navigateSpy).toHaveBeenCalledWith(['/products/new']);
  });

  it('editProduct() should navigate to edit route', () => {
    const navigateSpy = jest.spyOn(router, 'navigate');
    component.editProduct('1');
    expect(navigateSpy).toHaveBeenCalledWith(['/products', '1', 'edit']);
  });

  it('toggleMenu() should open menu for a product', () => {
    component.toggleMenu('1');
    expect(component.openMenuId).toBe('1');
  });

  it('toggleMenu() should close menu if same product clicked again', () => {
    component.openMenuId = '1';
    component.toggleMenu('1');
    expect(component.openMenuId).toBeNull();
  });

  it('deleteProduct() should call modalService.confirm', () => {
    component.deleteProduct('1');
    expect(modalServiceMock.confirm).toHaveBeenCalledWith(expect.objectContaining({
      title: 'Eliminar producto',
    }));
  });

  it('deleteProduct() should call deleteProduct and reload when confirmed', () => {
    modalServiceMock.confirm.mockReturnValue(of(true));
    component.deleteProduct('1');
    expect(productsServiceMock.deleteProduct).toHaveBeenCalledWith('1');
    expect(productsServiceMock.getProducts).toHaveBeenCalledTimes(2); // init + reload
  });

  it('deleteProduct() should NOT call deleteProduct when cancelled', () => {
    modalServiceMock.confirm.mockReturnValue(of(false));
    component.deleteProduct('1');
    expect(productsServiceMock.deleteProduct).not.toHaveBeenCalled();
  });

});
