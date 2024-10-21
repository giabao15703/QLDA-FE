import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

import { T_Any } from '#shared/types';

interface I_StoreSubject {
    key: string;
    oldValue: T_Any;
    newValue: T_Any;
}

@Injectable({
    providedIn: 'root',
})
export class StoreService {
    private _storageMap = new Map<string, BehaviorSubject<T_Any>>();
    private _storageChange$ = new BehaviorSubject<I_StoreSubject>({
        key: null,
        oldValue: null,
        newValue: null,
    });

    get storageChange$(): Observable<I_StoreSubject> {
        return this._storageChange$.asObservable();
    }

    onChange(key: string, callback: (oldValue, newValue) => void): void {
        this.storageChange$.subscribe((change: I_StoreSubject) => {
            if (change.key === key && change.newValue !== change.oldValue) {
                callback(change.oldValue, change.newValue);
            }
        });
    }

    get(key: string) {
        return this._storageMap.get(key);
    }

    set(key: string, value) {
        const oldValue = this.get(key);
        this._storageMap.set(key, value);
        this._storageChange$.next({ key, oldValue, newValue: value });
    }

    remove(key: string) {
        const oldValue = this.get(key);
        this._storageMap.delete(key);
        this._storageChange$.next({ key, oldValue, newValue: null });
    }

    clear() {
        this._storageMap.clear();
        this._storageChange$.next({ key: null, oldValue: null, newValue: null });
    }
}
