import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { MaterialModules } from '#shared/modules';
import { LocalStorageService } from '#shared/services';

const LANGUAGE_FLAGS = {
    vi: 'VIE',
    en: 'ENG',
};

@Component({
    standalone: true,
    selector: 'app-language-switch',
    templateUrl: './language-switch.component.html',
    styleUrls: ['./language-switch.component.scss'],
    imports: [MaterialModules],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LanguageSwitchComponent {
    constructor(
        private translateService: TranslateService,
        private localStorageService: LocalStorageService,
    ) {}

    currentLanguageFlag: string;

    ngOnInit(): void {
        const language = this.localStorageService.get('languageCode');
        this.translateService.use(language ?? 'vi');
        this.currentLanguageFlag = LANGUAGE_FLAGS[language ?? 'vi'];

        this.translateService.onLangChange.subscribe((lang) => {
            this.localStorageService.set('languageCode', lang.lang);
            this.currentLanguageFlag = LANGUAGE_FLAGS[lang.lang];
        });
    }

    changeLanguage(language: string) {
        this.translateService.use(language);
    }
}
