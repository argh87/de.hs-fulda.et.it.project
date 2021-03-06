import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

/* tslint:disable */
@Injectable()
export class GlobalRegistryService
{
    public isLoggedIn:boolean = false;

    public _isLoginActive:boolean = true;

    public gravatarHash:string;

    public currentUser:any;

    public toggled$:BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

    constructor()
    {

    }

    public get isLoginActive():boolean
    {
        return this._isLoginActive;
    }

    public set isLoginActive(value:boolean)
    {
        this._isLoginActive = value;
    }

    public setisLoggedIn(value:boolean)
    {
        this.isLoggedIn = value;
    }

    public getIsLoggedIn():boolean
    {
        return this.isLoggedIn
    }

    public setGravatarHash(hash:string):void
    {
        this.gravatarHash = hash;
    }

    public getGravatarHash():string
    {
        return this.gravatarHash;
    }

    public getCookie(name:string):any
    {
        let cookiename = name + '=';
        let decodedCookie = decodeURIComponent(document.cookie);
        let ca = decodedCookie.split(';');
        for(var i = 0; i < ca.length; i++)
        {
            var c = ca[i];
            while(c.charAt(0) == ' ')
            {
                c = c.substring(1);
            }
            if(c.indexOf(cookiename) == 0)
            {
                return c.substring(cookiename.length, c.length);
            }
        }
        return '';
    }
}
/* tslint:enable */
