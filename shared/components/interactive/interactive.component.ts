import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { MaterialModules } from '#shared/modules';
import { MatIconModule } from '@angular/material/icon';

@Component({
    standalone: true,
    selector: 'app-interactive',
    templateUrl: './interactive.component.html',
    styleUrls: ['./interactive.component.scss'],
    imports: [CommonModule, MaterialModules, TranslateModule, MatIconModule],
})
export class InteractiveComponent {
    TotalnumberofLikes: number = 100;
    TotalnumberofDisLikes: number = 25;
    flag: number = 0; // 0: neutral, 1: liked, 2: disliked
    dislikeS: string = 'dislike-button';
    likeS: string = 'like-button';

    increment() {
        if (this.flag !== 1) {
            this.likeS = 'like-button liked';
            this.TotalnumberofLikes += this.flag === 2 ? 2 : 1;
            this.TotalnumberofDisLikes -= this.flag === 2 ? 1 : 0;
            this.flag = 1;
        } else {
            this.likeS = 'like-button';
            this.TotalnumberofLikes--;
            this.flag = 0;
        }
        this.dislikeS = 'dislike-button';
    }

    decrement() {
        if (this.flag !== 2) {
            this.dislikeS = 'dislike-button disliked';
            this.TotalnumberofDisLikes += this.flag === 1 ? 2 : 1;
            this.TotalnumberofLikes -= this.flag === 1 ? 1 : 0;
            this.flag = 2;
        } else {
            this.dislikeS = 'dislike-button';
            this.TotalnumberofDisLikes--;
            this.flag = 0;
        }
        this.likeS = 'like-button';
    }
}
