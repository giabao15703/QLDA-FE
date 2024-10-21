import { MaterialModules } from '#shared/modules';
import { Component } from '@angular/core';

@Component({
    standalone: true,
    selector: 'nextpro-user-recommendation',
    templateUrl: './recommendation.component.html',
    styleUrl: './recommendation.component.scss',
    imports: [MaterialModules],
})
export class RecommendationComponent {}
