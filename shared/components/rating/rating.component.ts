import { Component, Input, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { MaterialModules } from '#shared/modules';
import { CommonModule } from '@angular/common';

@Component({
    standalone: true,
    selector: 'app-rating',
    templateUrl: './rating.component.html',
    styleUrls: ['./rating.component.scss'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => RatingComponent),
            multi: true,
        },
    ],
    imports: [CommonModule, MaterialModules],
})
export class RatingComponent implements ControlValueAccessor {
    @Input() rating: number;
    stars: boolean[] = Array(5).fill(true);

    @Input() disabled: boolean;

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    onChange = (e?: number) => {};

    onTouched = () => {};

    get value(): number {
        return this.stars.reduce((total, starred) => {
            return total + (starred ? 1 : 0);
        }, 0);
    }

    ngOnInit() {
        if (this.rating) {
            this.stars = Array(this.rating).fill(true);
        }
    }

    onRate(rating: number) {
        if (!this.disabled) {
            this.writeValue(rating);
        }
    }

    writeValue(rating: number): void {
        if (!this.disabled) {
            this.stars = this.stars.map((_, i) => rating > i);
            this.onChange(this.value);
        }
    }

    registerOnChange(fn: (rating: number) => void): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: () => void): void {
        this.onTouched = fn;
    }

    setDisabledState(isDisabled: boolean): void {
        this.disabled = isDisabled;
    }

    trackByIndex(index: number): number {
        return index;
    }
}
