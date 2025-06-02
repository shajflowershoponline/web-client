import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProductService } from 'src/app/services/product.service';
import { Modal } from 'bootstrap';
import { Product } from 'src/app/model/product';

@Component({
  selector: 'app-quick-product-view-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './quick-product-view-modal.component.html',
  styleUrl: './quick-product-view-modal.component.scss',
})
export class QuickProductViewModalComponent {
  @ViewChild('modalRef', { static: true }) modalRef!: ElementRef;
  product: Product;
  private modalInstance!: Modal;

  ngAfterViewInit(): void {
    this.modalInstance = new Modal(this.modalRef.nativeElement);
  }

  public showModal(product: Product): void {
    this.product = product;
    this.modalInstance.show();
  }

  public hideModal(): void {
    this.modalInstance.hide();
  }
}
