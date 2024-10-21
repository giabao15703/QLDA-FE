import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

import { T_Any } from '#shared/types';

interface I_LocalStorageSubject {
    key: string;
    oldValue: T_Any;
    newValue: T_Any;
}

@Injectable({
    providedIn: 'root',
})
export class LocalStorageService {
    constructor() {
        window.addEventListener('storage', (event: StorageEvent) => {
            this._storageChange$.next(event);
        });
    }

    private _storageChange$ = new BehaviorSubject<I_LocalStorageSubject>({
        key: null,
        oldValue: null,
        newValue: null,
    });

    get storageChange$(): Observable<I_LocalStorageSubject> {
        return this._storageChange$.asObservable();
    }

    onChange(key: string, callback: (oldValue, newValue) => void): void {
        this.storageChange$.subscribe((change: I_LocalStorageSubject) => {
            if (change.key === key && change.newValue !== change.oldValue) {
                callback(change.oldValue, change.newValue);
            }
        });
    }

    get(key: string) {
        return JSON.parse(localStorage.getItem(key));
    }

    set(key: string, value): void {
        const oldValue = this.get(key);
        localStorage.setItem(key, JSON.stringify(value));
        this._storageChange$.next({ key, oldValue, newValue: value });
    }

    remove(key: string): void {
        const oldValue = this.get(key);
        localStorage.removeItem(key);
        this._storageChange$.next({ key, oldValue, newValue: null });
    }

    clear(): void {
        localStorage.clear();
        this._storageChange$.next({ key: null, oldValue: null, newValue: null });
    }
}
