import { NgOptimizedImage } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
    standalone: true,
    selector: 'app-image',
    templateUrl: './image.component.html',
    styleUrls: ['./image.component.scss'],
    imports: [NgOptimizedImage],
})
export class ImageComponent {
    @Input() fill: boolean;
    @Input() width: string = '100%';
    @Input() height: string = '100%';
    @Input() contentClass: string;
    @Input() src: string;
    @Input() alt: string;
}
