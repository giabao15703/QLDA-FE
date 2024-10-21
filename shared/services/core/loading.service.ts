import { Injectable } from '@angular/core';
import { Subject, Subscription } from 'rxjs';

import { E_LoadingType } from '#shared/types';

const DEBUG = false;

@Injectable({
    providedIn: 'root',
})
export class LoadingService {
    loadingSubject = new Subject<boolean>();
    globalSubject = new Subject<boolean>();
    onGoingCalls = 0;
    onGoingCallsName = [];

    isLoading = this.loadingSubject.asObservable();
    isGlobal = this.globalSubject.asObservable();
    isLoadingSubscription: Subscription;
    isGlobalSubscription: Subscription;

    show = (name?: string, type: E_LoadingType = E_LoadingType.LOCAL) => {
        this.onGoingCalls++;

        if (name) {
            this.onGoingCallsName.push(name);
        }

        this.loadingSubject.next(true);
        this.globalSubject.next(type === E_LoadingType.GLOBAL);

        if (DEBUG) {
            console.log(`Calling ${this.onGoingCalls} api(s)`);
            console.log('Stack', this.onGoingCallsName);
        }
    };

    hide = (name?: string, type: E_LoadingType = E_LoadingType.LOCAL) => {
        this.onGoingCalls--;

        if (name) {
            this.onGoingCallsName = this.onGoingCallsName.filter((onGoingCallName) => onGoingCallName !== name);
        }

        if (this.onGoingCalls <= 0) {
            this.loadingSubject.next(false);
            this.globalSubject.next(type === E_LoadingType.GLOBAL);
            this.onGoingCalls = 0;
            this.onGoingCallsName = [];
        }

        if (DEBUG) {
            console.log(`Calling ${this.onGoingCalls} api(s)`);
            console.log('Stack', this.onGoingCallsName);
        }
    };

    subscribe = (context) => {
        if (typeof context.isLoading !== 'undefined') {
            this.isLoadingSubscription = this.isLoading.subscribe((isLoading) => {
                setTimeout(() => {
                    context.isLoading = isLoading;
                });
            });
        }

        if (typeof context.isGlobal !== 'undefined') {
            this.isGlobalSubscription = this.isGlobal.subscribe((isGlobal) => {
                setTimeout(() => {
                    context.isGlobal = isGlobal;
                });
            });
        }
    };

    unsubscribe = () => {
        if (this.isLoadingSubscription) {
            this.isLoadingSubscription.unsubscribe();
        }

        if (this.isGlobalSubscription) {
            this.isGlobalSubscription.unsubscribe();
        }
    };

    checkLoading = (names?: string[]) => {
        if (!names) {
            return false;
        }

        return names.length > 0 ? this.onGoingCallsName.some((name) => names.includes(name)) : this.onGoingCalls > 0;
    };
}
