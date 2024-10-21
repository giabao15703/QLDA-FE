import { MaterialModules } from '#shared/modules';
import { Component } from '@angular/core';
import { MatStepperModule } from '@angular/material/stepper';
import { TranslateModule } from '@ngx-translate/core';

@Component({
    standalone: true,
    selector: 'nextpro-user-payment-guaranteed',
    imports: [MaterialModules, MatStepperModule, TranslateModule],
    templateUrl: './payment-guaranteed.component.html',
    styleUrl: './payment-guaranteed.component.scss',
})
export class PaymentGuaranteedComponent {}
