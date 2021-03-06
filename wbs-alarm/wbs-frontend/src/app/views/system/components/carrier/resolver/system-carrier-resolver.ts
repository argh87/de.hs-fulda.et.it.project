import {
    ActivatedRouteSnapshot,
    Resolve,
    Router
} from '@angular/router';
import { Injectable } from '@angular/core';
import { UsersService } from '../../../../../core/service/rest/users/users.service';
import { SystemGlobalSettingsService } from '../../../system-global-settings.service';
import { isNullOrUndefined } from 'util';
import {
    L10nTranslationService
} from 'angular-l10n';
import { SystemCarrierInterface } from '../data/system-carrier.interface';

@Injectable()
export class SystemCarrierResolver implements Resolve<SystemCarrierInterface>
{
    constructor(public translation:L10nTranslationService,
                public userService:UsersService,
                public systemGloabalSettingsService:SystemGlobalSettingsService,
                public router:Router)
    {
    }

    public resolve(route:ActivatedRouteSnapshot):SystemCarrierInterface
    {
        let carrierId:number = +route.params['carrierId'];

        if(isNullOrUndefined(carrierId) || isNaN(carrierId))
        {
            return;
        }

        let carrier:SystemCarrierInterface = this.systemGloabalSettingsService.getSingleTraeger(carrierId);

        return this.systemGloabalSettingsService.getSingleTraeger(carrierId);
    }
}
