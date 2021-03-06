import { Component } from '@angular/core';
import { UserDataInterface } from '../../../../../core/service/rest/users/user-data.interface';
import { UsersService } from '../../../../../core/service/rest/users/users.service';
import { SystemGlobalSettingsService } from '../../../system-global-settings.service';
import {
    AlertService,
    TerraNodeTreeConfig
} from '@plentymarkets/terra-components';
import { ExampleTreeData } from '../../../system.component';
import { Router } from '@angular/router';


@Component({
    // tslint:disable-next-line:component-selector
    selector:    'system-new-user',
    templateUrl: './system-new-user.component.html',
    styleUrls:   ['./system-new-user.component.scss']
})
export class SystemNewUserComponent
{
    public newUser:UserDataInterface =
        {
            username: '',
            password: ''
        };

    constructor(public usersService:UsersService,
                public alert:AlertService,
                public systemGlobalSettings:SystemGlobalSettingsService,
                public systemTreeConfig:TerraNodeTreeConfig<ExampleTreeData>,
                public router:Router)
    {

    }

    public save():void
    {
        let traegerId:number = this.systemGlobalSettings.getTraegerId();

        this.usersService.registerUser(traegerId, this.newUser).subscribe(
            (result:any):any =>
            {
                this.usersService.getOneUser(undefined, result.headers.get('Location')).subscribe((user:any):any =>
                {
                    this.systemTreeConfig.addChildToNodeById(this.systemTreeConfig.currentSelectedNode.id,
                        {
                            id:        user.id,
                            name:      user.username,
                            isVisible: true,
                            onClick:   ():void =>
                                       {
                                           this.router.navigateByUrl('plugin/system/carrier/' + traegerId + '/user/' + user.id);
                                       },
                            children:
                                       [
                                           {
                                               id:        'benutzer ' + user.id + '/authority/' + user.id,
                                               name:      'Berechtigungen',
                                               isVisible: true,
                                               onClick:   ():void =>
                                                          {
                                                              this.router.navigateByUrl('plugin/system/carrier/' +
                                                                                        traegerId + '/user/' + user.id +
                                                                                        '/authority/' + user.id);
                                                          },
                                           }
                                       ]
                        }
                    );

                    this.newUser.username = '';
                    this.newUser.password = '';
                });

                this.alert.success('Der Benutzer wurde angelegt!');


            },
            (error:any):any =>
            {
                this.alert.error('Der Benutzer konnte nicht angelegt werden! ' + error.error.message);
            });
    }
}
