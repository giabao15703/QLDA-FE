import { Injectable, InjectionToken } from '@angular/core';
import {
    MissingTranslationHandler,
    TranslateCompiler,
    TranslateLoader,
    TranslateParser,
    TranslateService as TranslateServiceRaw,
    TranslateStore,
} from '@ngx-translate/core';

export const ISOLATE_TOKEN = new InjectionToken<boolean>('ISOLATE');
export const EXTEND_TOKEN = new InjectionToken<boolean>('EXTEND');
export const DEFAULT_LANG_TOKEN = new InjectionToken<string>('DEFAULT_LANG');

@Injectable({
    providedIn: 'root',
})
export class TranslateService extends TranslateServiceRaw {
    constructor(
        store: TranslateStore,
        currentLoader: TranslateLoader,
        compiler: TranslateCompiler,
        parser: TranslateParser,
        missingTranslationHandler: MissingTranslationHandler,
        useDefaultLang: boolean,
        isolate: boolean,
        extend: boolean,
        defaultLanguage: string,
    ) {
        super(
            store,
            currentLoader,
            compiler,
            parser,
            missingTranslationHandler,
            useDefaultLang,
            isolate,
            extend,
            defaultLanguage,
        );
    }

    translate(key: string): string {
        if (!key) {
            return '';
        }

        return this.instant(key);
    }
}
