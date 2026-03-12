import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export interface ModalConfig {
  title: string;
  message: string;
  showCancel?: boolean;
  confirmText?: string;
  cancelText?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ModalService {

  private modalSubject = new Subject<ModalConfig>();
  modalState$ = this.modalSubject.asObservable();

  private responseSubject = new Subject<boolean>();

  confirm(config: ModalConfig) {
    this.modalSubject.next(config);
    return this.responseSubject.asObservable();
  }

  resolve(result: boolean) {
    this.responseSubject.next(result);
  }
}
