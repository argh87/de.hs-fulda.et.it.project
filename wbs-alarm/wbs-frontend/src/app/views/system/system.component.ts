import {
    ChangeDetectorRef,
    Component,
    OnInit
} from '@angular/core';
import { TerraNodeTreeConfig } from "@plentymarkets/terra-components";
import { TranslationService } from "angular-l10n";
import { CarrierService } from "../../core/service/rest/carrier/carrier.service";
import { Observable } from "rxjs";
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import {SystemGlobalSettingsService} from "./system-global-settings.service";
import {MediaMatcher} from "@angular/cdk/layout";

export interface resultData
{
    _embedded:embeddedData;
    _links:Object;
}

export interface embeddedData
{
    elemente:Array<traegerData>;
}

export interface traegerData
{
    id:number;
    name:string;
    _embedded:any;
    _links:Object;
}

export interface ExampleTreeData
{
    id:number;
}

@Component({
    selector: 'system',
    templateUrl: './system.component.html',
    styleUrls:   ['./system.component.scss']
})
export class SystemComponent implements OnInit
{
    public mobileQuery:MediaQueryList;

    public fillerNav = Array.from({length: 50}, (_, i) => `Nav Item ${i + 1}`);

    public fillerContent = Array.from({length: 50}, () =>
        `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
       labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
       laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in
       voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
       cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.`);

    private _mobileQueryListener: () => void;
    
    constructor(public nodeTreeConfig:TerraNodeTreeConfig<ExampleTreeData>,
                public translation:TranslationService,
                public router:Router,
                public carrierService:CarrierService,
                public systemsGlobalSettingsService:SystemGlobalSettingsService,
                public changeDetectorRef:ChangeDetectorRef,
                public media:MediaMatcher)
    {
        this.mobileQuery = media.matchMedia('(max-width: 600px)');
        this._mobileQueryListener = () => changeDetectorRef.detectChanges();
        this.mobileQuery.addListener(this._mobileQueryListener);
    }

    public ngOnInit():void
    {
        this.createCompleteTree();
    }

    public createCompleteTree():void
    {
        this.nodeTreeConfig.list = [
            {
                id:         0,
                name:       this.translation.translate('system.village.village'),
                isVisible:  true,
                children:   [],
                onClick: ():void => { this.router.navigateByUrl('plugin/system/carrier') },
                onLazyLoad: ():Observable<any> =>
                            {
                                return this.getCarriers();
                            }
            }];
    }

    public getCarriers():Observable<any>
    {
        return this.carrierService.getCarriers().pipe(
            tap((result:resultData) =>
            {
                this.systemsGlobalSettingsService.setTraegers(result._embedded.elemente);

                    result._embedded.elemente.forEach((element:any) =>
                    {
                        this.nodeTreeConfig.addChildToNodeById(0, {
                            id:        element.id,
                            name:      element.name,
                            isVisible: true,
                            onClick: ():void =>
                            {
                                this.router.navigateByUrl('plugin/system/carrier/' + element.id);

                                this.systemsGlobalSettingsService.setTraegerId(element.id);
                            },
                            onLazyLoad: ():Observable<any> =>
                            {
                                return this.getCarrierDetailForId(element.id, element.name);
                            },
                            children: [
                                {
                                    id:        element.name + 11,
                                    name:      this.translation.translate('system.user.user'),
                                    isVisible: true,
                                    children:  [],
                                    onClick: ():void =>
                                    {
                                        this.router.navigateByUrl('plugin/system/carrier/' + element.id + '/user');
                                    }
                                },
                                {
                                    id:        element.name + 12,
                                    name:      this.translation.translate('system.targetPlaces.targetPlaces'),
                                    isVisible: true,
                                    children:  [],
                                    onClick: ():void =>
                                    {
                                        this.router.navigateByUrl('plugin/system/carrier/' + element.id + '/targetplace')
                                    }
                                },
                                {
                                    id:        element.name + 13,
                                    name:      this.translation.translate('system.clothes.clothes'),
                                    isVisible: true,
                                    children:  [],
                                    onClick: ():void =>
                                    {
                                        this.router.navigateByUrl('plugin/system/carrier/' + element.id + '/category')
                                    }
                                }
                            ]
                        });
                    })
            }));
    }

    public getCarrierDetailForId(id:number, name:string):Observable<any>
    {
        return this.carrierService.getDetailsForCarrier(id).pipe(
            tap((result:any) =>
            {
                console.log(result);

                this.systemsGlobalSettingsService.setBenutzer(result._embedded.benutzer);
                this.systemsGlobalSettingsService.setKategorien(result._embedded.kategorien);
                this.systemsGlobalSettingsService.setZielOrte(result._embedded.zielorte);

                result._embedded.benutzer.forEach((benutzer:any) =>
                {
                    this.nodeTreeConfig.addChildToNodeById(name + 11,
                        {
                            id: 'benutzer ' + benutzer.id,
                            name: benutzer.username,
                            isVisible: true,
                            onClick: ():void =>
                            {
                                this.router.navigateByUrl('plugin/system/carrier/' + id + '/user/' + benutzer.id)
                            },
                            children:
                            [
                                {
                                    id: 'benutzer ' + benutzer.id + '/authority/' + benutzer.id,
                                    name: 'Berechtigungen',
                                    isVisible: true,
                                    onClick: ():void =>
                                        {
                                            this.router.navigateByUrl('plugin/system/carrier/' + id + '/user/' + benutzer.id + '/authority/' + benutzer.id)
                                        },
                                }
                            ]
                        })
                });

                result._embedded.zielorte.forEach((zielort:any) =>
                {
                    this.nodeTreeConfig.addChildToNodeById(name + 12,
                        {
                            id: 'zielort ' + zielort.id,
                            name: zielort.name,
                            isVisible: true,
                            onClick: ():void =>
                                       {
                                           this.router.navigateByUrl('plugin/system/carrier/' + id + '/targetplace/' + zielort.id)
                                       }
                        })
                });

                result._embedded.kategorien.forEach((kategorie:any) =>
                {
                    this.nodeTreeConfig.addChildToNodeById(name + 13,
                        {
                            id: 'kategorie ' + kategorie.id,
                            name: kategorie.name,
                            isVisible: true,
                            onClick: ():void =>
                            {
                                this.router.navigateByUrl('plugin/system/carrier/' + id + '/category/' + kategorie.id)
                            }
                        })
                });
            })
        )
    }
}