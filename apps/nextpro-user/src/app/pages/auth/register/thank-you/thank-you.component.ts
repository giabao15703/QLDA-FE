import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { NavbarLoginComponent } from 'apps/nextpro-user/src/app/layout';

@Component({
    standalone: true,
    selector: 'nextpro-user-auth-register-thank-you',
    templateUrl: './thank-you.component.html',
    styleUrl: './thank-you.component.scss',
    imports: [NavbarLoginComponent, CommonModule],
})
export class ThankYouPage {}
