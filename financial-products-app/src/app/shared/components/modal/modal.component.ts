import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ModalConfig, ModalService } from '../../services/modal.service';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.scss'
})
export class ModalComponent {

  visible = false;

  title = '';
  message = '';

  showCancel = true;
  confirmText = 'Confirmar';
  cancelText = 'Cancelar';

  constructor(private modalService: ModalService) {

    this.modalService.modalState$.subscribe((config: ModalConfig) => {

      this.title = config.title;
      this.message = config.message;

      this.showCancel = config.showCancel ?? true;
      this.confirmText = config.confirmText ?? 'Confirmar';
      this.cancelText = config.cancelText ?? 'Cancelar';

      this.visible = true;

    });

  }

  confirm() {
    this.modalService.resolve(true);
    this.visible = false;
  }

  cancel() {
    this.modalService.resolve(false);
    this.visible = false;
  }
}
