import { Injectable } from '@angular/core';
import { ActivatedRoute, NavigationEnd, NavigationExtras, Router } from '@angular/router';
import { combineLatest } from 'rxjs';
import { filter, map } from 'rxjs/operators';

import { E_Form_Mode, T_Any } from '#shared/types';

@Injectable({
    providedIn: 'root',
})
export class RouteService {
    constructor(
        private router: Router,
        private activatedRoute: ActivatedRoute,
    ) {}

    onChange = (
        callback: (changes: {
            route: string | null;
            hash: string | null;
            prefix: string | null;
            id: string | null;
            mode: string | null;
        }) => void,
    ): void => {
        const routeChanges$ = this.router.events.pipe(
            filter((event) => event instanceof NavigationEnd),
            map(() => this.router.url),
        );

        const hashChanges$ = this.activatedRoute.fragment.pipe(map((fragment) => fragment || null));

        combineLatest([routeChanges$, hashChanges$]).subscribe(([route, hash]) => {
            const { prefix, mode, id } = this.parseHash(hash);
            callback({ route: route || null, hash, prefix, mode, id });
        });
    };

    toHash = ({ prefix, mode, id }: { prefix?: string; mode: E_Form_Mode; id?: string }) => {
        const prefixString = prefix ? `${prefix.toLowerCase()}-` : '';
        const modeString = `${mode.toLowerCase()}`;
        const idString = id ? `-${id}` : '';

        return { fragment: `${prefixString}${modeString}${idString}` };
    };

    parseHash = (hash: string) => {
        if (!hash) {
            return { mode: E_Form_Mode.CREATE, id: null };
        }

        const splittedHash = hash.split('-');
        const FORM_MODES = Object.values(E_Form_Mode) as string[];
        let mode = splittedHash[0].toUpperCase();
        let id = splittedHash[1];

        if (!FORM_MODES.includes(mode)) {
            mode = splittedHash?.[1]?.toUpperCase();
            id = splittedHash?.[2];

            return {
                prefix: splittedHash[0],
                mode,
                id,
            };
        }

        return { mode, id };
    };

    navigate = (commands, extras?: NavigationExtras): void => {
        this.router.navigate(commands, extras);
    };

    getHash = () => {
        return this.activatedRoute.snapshot.fragment;
    };

    goTo = ({ prefix, mode, id }: { prefix?: string; mode: E_Form_Mode; id?: string }) => {
        this.router.navigate([], this.toHash({ prefix, mode, id }));
    };

    removeHash = ({ prefix }: { prefix?: string } = {}) => {
        this.router.navigate([], { fragment: prefix || null });
    };

    getDetail = async ({
        tab,
        hash = this.getHash(),
        detail,
    }: {
        tab?: string;
        hash?: string;
        detail: (params: { id: string }) => Promise<T_Any>;
    }) => {
        if (hash) {
            const { prefix, mode, id } = this.parseHash(hash);

            if (mode === E_Form_Mode.CREATE) {
                return { mode: E_Form_Mode.CREATE, data: null };
            }

            if (id && ((!tab && !prefix) || tab === prefix)) {
                const data = await detail({ id });

                return { mode, data };
            }
        }

        return null;
    };
}
