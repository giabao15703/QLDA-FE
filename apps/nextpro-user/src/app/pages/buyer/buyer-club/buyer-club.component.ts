import { LoadingComponent } from '#shared/components';
import { MaterialModules } from '#shared/modules';
import { DetailedFooterComponent, NavbarComponent } from '#user/layout';
import { CartComponent } from '#user/pages/product/cart/cart.component';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

@Component({
    selector: 'nextpro-user-buyer-club',
    standalone: true,
    imports: [
        CommonModule,
        CartComponent,
        FormsModule,
        NavbarComponent,
        DetailedFooterComponent,
        TranslateModule,
        MaterialModules,
        LoadingComponent,
    ],
    templateUrl: './buyer-club.component.html',
    styleUrl: './buyer-club.component.scss',
})
export class BuyerClubPage {
    // constructor(
    //     public loadingService: LoadingService,
    //     private accountService: AccountService,
    //     private activatedRoute: ActivatedRoute,
    // ) {}
    // supplier: I_Supplier;
    // async ngOnInit() {
    //     const supplier = await this.accountService.getSupplier({
    //         id: this.activatedRoute.snapshot.paramMap.get('id'),
    //     });
    //     this.supplier = supplier;
    // }
}
