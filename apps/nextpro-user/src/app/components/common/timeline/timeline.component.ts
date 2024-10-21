import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
    standalone: true,
    selector: 'nextpro-user-timeline',
    templateUrl: './timeline.component.html',
    styleUrl: './timeline.component.scss',
    imports: [CommonModule],
})
export class TimelineComponent {
    @Input() timelineStatuses: { title: string; date: string; time: string }[] = [];
}
