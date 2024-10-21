import { Component, Input } from '@angular/core';

@Component({
    standalone: true,
    selector: 'app-video',
    templateUrl: './video.component.html',
    styleUrls: ['./video.component.scss'],
})
export class VideoComponent {
    @Input() contentClass: string;
    @Input() src: string;
    @Input() type: string;
    @Input() loop: boolean;
    @Input() muted: boolean;
    @Input() autoplay: boolean;

    handleCanPlay(video: HTMLVideoElement) {
        if (this.autoplay) {
            video.play();
        }
    }
}
