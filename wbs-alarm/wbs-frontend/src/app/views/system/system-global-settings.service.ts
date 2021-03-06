import { UserDataInterface } from '../../core/service/rest/users/user-data.interface';
import { SystemZielortInterface } from './components/targetplaces/data/system-zielort.interface';
import { SystemCarrierInterface } from './components/carrier/data/system-carrier.interface';
import { SystemCategoryInterface } from './components/categories/data/system-category.interface';
import { UsersService } from '../../core/service/rest/users/users.service';
import { Injectable } from '@angular/core';

@Injectable()
export class SystemGlobalSettingsService
{
    public traegerId:number;

    public traegers:Array<any> = [];
    public benutzer:Array<any> = [];
    public zielorte:Array<any> = [];
    public kategorien:Array<any> = [];

    constructor(public userService:UsersService)
    {

    }

    public getTraegerId():number
    {
        return this.traegerId;
    }

    public setTraegerId(id:number):void
    {
        this.traegerId = id;
    }

    public getSingleTraeger(id:number):SystemCarrierInterface
    {
        return this.traegers.find((traeger:SystemCarrierInterface):any => id === traeger.id);
    }

    public setBenutzer(benutzer:Array<any>):void
    {
        if(this.benutzer.indexOf(benutzer) === -1)
        {
            this.benutzer = this.benutzer.concat(benutzer);

            console.log('Benutzer:');
            console.log(this.benutzer);

        }
    }

    public setTraegers(traegers:Array<any>):void
    {
        if(this.traegers.indexOf(traegers) === -1)
        {
            this.traegers = this.traegers.concat(traegers);
        }
    }

    public setZielOrte(zielorte:Array<any>):void
    {
        if(this.zielorte.indexOf(zielorte) === -1)
        {
            this.zielorte = this.zielorte.concat(zielorte);
        }
    }

    public getSingleZielort(id:number):SystemZielortInterface
    {
        console.log(this.zielorte.find((zielort:any):any => id === zielort.id));

        return this.zielorte.find((zielort:any):any => id === zielort.id);
    }

    public setKategorien(kategorien:Array<any>):void
    {
        if(this.kategorien.indexOf(kategorien) === -1)
        {
            this.kategorien = this.kategorien.concat(kategorien);
        }
    }

    public getSingleCategory(categoryId:number):SystemCategoryInterface
    {
        return this.kategorien.find((kategorie:any):any => kategorie.id === categoryId);
    }

    public getSingleUser(userId:number):UserDataInterface
    {
        return this.benutzer.find((benutzer:any):any =>
        {
            return benutzer.id === userId;
        });
    }
}
