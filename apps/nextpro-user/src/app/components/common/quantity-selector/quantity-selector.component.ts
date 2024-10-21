import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
    standalone: true,
    selector: 'nextpro-user-quantity-selector',
    templateUrl: './quantity-selector.component.html',
    styleUrl: './quantity-selector.component.scss',
    imports: [CommonModule, FormsModule],
})
export class QuantitySelectorComponent {
    @Input() label: string;
    @Input() customClass: string;
    @Input() quantity: number = 1;
    @Output() quantityChange = new EventEmitter<number>();

    increase() {
        this.quantity += 1;
        this.quantityChange.emit(this.quantity);
    }

    decrease() {
        if (this.quantity > 0) {
            this.quantity -= 1;
            this.quantityChange.emit(this.quantity);
        }
    }
}
