import { TestBed } from '@angular/core/testing';
import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';

import { errorInterceptor } from './error.interceptor';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ModalService } from '../../shared/services/modal.service';
import { of } from 'rxjs';

describe('errorInterceptor', () => {
  let http: HttpClient;
  let httpMock: HttpTestingController;
  let modalServiceMock: jest.Mocked<ModalService>;

  beforeEach(() => {
    modalServiceMock = {
      confirm: jest.fn().mockReturnValue(of(true)),
    } as any;

    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([errorInterceptor])),
        provideHttpClientTesting(),
        { provide: ModalService, useValue: modalServiceMock },
      ]
    });

    http = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should pass through successful requests', () => {
    http.get('/test').subscribe(res => {
      expect(res).toEqual({ ok: true });
    });

    const req = httpMock.expectOne('/test');
    req.flush({ ok: true });
    expect(modalServiceMock.confirm).not.toHaveBeenCalled();
  });

  it('should show "Bad request" on 400 error', () => {
    http.get('/test').subscribe({ error: () => {} });

    const req = httpMock.expectOne('/test');
    req.flush({ message: 'Bad request' }, { status: 400, statusText: 'Bad Request' });

    expect(modalServiceMock.confirm).toHaveBeenCalledWith(expect.objectContaining({
      message: 'Bad request'
    }));
  });

  it('should show "Resource not found" on 404 error', () => {
    http.get('/test').subscribe({ error: () => {} });

    const req = httpMock.expectOne('/test');
    req.flush({ message: 'Resource not found' }, { status: 404, statusText: 'Not Found' });

    expect(modalServiceMock.confirm).toHaveBeenCalledWith(expect.objectContaining({
      message: 'Resource not found'
    }));
  });

  it('should show "Internal server error" on 500 error', () => {
    http.get('/test').subscribe({ error: () => {} });

    const req = httpMock.expectOne('/test');
    req.flush({}, { status: 500, statusText: 'Server Error' });

    expect(modalServiceMock.confirm).toHaveBeenCalledWith(expect.objectContaining({
      message: 'Internal server error'
    }));
  });

  it('should show custom message from error.error.message', () => {
    http.get('/test').subscribe({ error: () => {} });

    const req = httpMock.expectOne('/test');
    req.flush({ message: 'Custom error message' }, { status: 400, statusText: 'Bad Request' });

    expect(modalServiceMock.confirm).toHaveBeenCalledWith(expect.objectContaining({
      message: 'Custom error message'
    }));
  });

  it('should show "Unexpected error" when no status matches', () => {
    http.get('/test').subscribe({ error: () => {} });

    const req = httpMock.expectOne('/test');
    req.flush({}, { status: 503, statusText: 'Service Unavailable' });

    expect(modalServiceMock.confirm).toHaveBeenCalledWith(expect.objectContaining({
      message: 'Unexpected error'
    }));
  });

  it('should always use title "Error" and no cancel button', () => {
    http.get('/test').subscribe({ error: () => {} });

    const req = httpMock.expectOne('/test');
    req.flush({}, { status: 500, statusText: 'Server Error' });

    expect(modalServiceMock.confirm).toHaveBeenCalledWith(expect.objectContaining({
      title: 'Error',
      showCancel: false,
      confirmText: 'Cerrar'
    }));
  });
});
