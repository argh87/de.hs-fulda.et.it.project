import {Component, OnInit} from '@angular/core';
import { Language,
         TranslationService } from 'angular-l10n';
import {TerraAlertComponent, TerraSelectBoxValueInterface} from "@plentymarkets/terra-components";
import {LoginService} from "../../core/service/rest/login/login.service";
import {WbsSitemapHelper} from "../../core/service/rest/sitemap/data/wbs-sitemap.helper";
import {Router} from "@angular/router";
import { GlobalRegistryService } from '../../core/global-registry/global-registry.service';
import { FormGroup } from '@angular/forms';
import { UsersService } from '../../core/service/rest/users/users.service';
import { UserDataInterface } from '../../core/service/rest/users/user-data.interface';


@Component({
    selector: 'app-login',
    templateUrl: './app-login.component.html',
    styleUrls: ['./app-login.component.scss']
})
export class AppLoginComponent implements OnInit
{
    private alert:TerraAlertComponent = TerraAlertComponent.getInstance();

    @Language()
    public lang:string;

    protected user:Object =
        {
            name: '',
            password: '',
            language: 'de'
        };

    protected languages:Array<TerraSelectBoxValueInterface> = [];

    protected username:string;
    protected password:string;

    protected languageCaption:string;

    constructor(private translation:TranslationService,
                private loginService:LoginService,
                private globalRegistryService:GlobalRegistryService,
                private sitemapHelper:WbsSitemapHelper,
                private userService:UsersService,
                private router:Router)
    {
    }

    public ngOnInit():void
    {
        this.globalRegistryService.isLoginActive = true;

        this.initTranslations();
        // this.initLanguageValues();
    }

    private initTranslations():void
    {
        this.username = this.translation.translate('login.username', this.lang);
        this.password = this.translation.translate('login.password', this.lang);
        this.languageCaption = this.translation.translate('login.language', this.lang);
    }

    // private initLanguageValues():void
    // {
    //     this.languages =
    //         [
    //             {
    //                 caption: 'Deutsch',
    //                 value: 'de'
    //             },
    //             {
    //                 caption: 'English',
    //                 value: 'en'
    //             }
    //         ];
    // }

    protected login():void
    {
       this.loginService.login(this.user).subscribe(
           (result:string) =>
       {
           this.alert.addAlert({
               msg:              'Sie werden eingeloggt',
               type:             'success',
               dismissOnTimeout: null,
               identifier:       'login'
           });


           localStorage.setItem('accessToken', result);
           this.sitemapHelper.Bearer = result;
           this.globalRegistryService.setisLoggedIn(true);
           this.router.navigate(['plugin', 'start']);

           this.globalRegistryService.isLoginActive = false;

           this.userService.getCurrentUsers().subscribe(
               (result:any) =>
               {
                   this.globalRegistryService.setGravatarHash(result.gravatar)
               }
           )
       },
       (error:any) =>
       {
           console.log(error);

           this.alert.addAlert({
               msg:              'Falscher Benutzername oder Passwort',
               type:             'danger',
               dismissOnTimeout: null,
               identifier:       'loginError'
           });
       });
    }
}
