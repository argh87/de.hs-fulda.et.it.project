import {
    Component,
    Input,
    OnInit
} from '@angular/core';
import { Observable } from 'rxjs';
import {
    ActivatedRoute,
    Data
} from '@angular/router';
import { AlertService, } from '@plentymarkets/terra-components';
import { GroesseService } from '../../../../core/service/rest/groesse/groesse.service';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import {
    MatDialog,
    MatDialogRef
} from '@angular/material/dialog';
import { GroessenUpdateDialogComponent } from './dialog/groessen-update-dialog.component';

export interface GroesseRow
{
    groesse:any;
}

@Component({
    // tslint:disable-next-line:component-selector
    selector:    'system-groessen',
    templateUrl: './system-groessen.component.html',
    styleUrls:   ['./system-groessen.component.scss']
})
export class SystemGroessenComponent implements OnInit
{
    public _groesse:string;
    public bestandswarnung:number = 0;

    public routeData$:Observable<Data>;

    public groessen:any;

    @Input()
    public categoryId:number;

    public tableData:Array<GroesseRow> = [];

    public displayedColumns:Array<string> = ['select',
                                             'name',
                                             'bestandsgrenze'];
    public dataSource:MatTableDataSource<GroesseRow> = new MatTableDataSource<GroesseRow>(this.tableData);
    public selection:SelectionModel<GroesseRow> = new SelectionModel<GroesseRow>(false, []);


    constructor(public route:ActivatedRoute,
                public groessenService:GroesseService,
                public dialog:MatDialog,
                private alert:AlertService)
    {
    }

    /** Whether the number of selected elements matches the total number of rows. */
    public isAllSelected():boolean
    {
        let numSelected:number = this.selection.selected.length;
        let numRows:number = this.dataSource.data.length;
        return numSelected === numRows;
    }

    /** Selects all rows if they are not all selected; otherwise clear selection. */
    public masterToggle():void
    {
        this.isAllSelected() ?
            this.selection.clear() :
            // tslint:disable-next-line:typedef
            this.dataSource.data.forEach(row => this.selection.select(row));
    }

    public ngOnInit():void
    {
        this.routeData$ = this.route.data;

        this.route.data.subscribe((data:any):any =>
        {
            this.groessen = data.groesse._embedded.elemente;

            this.tableData = [];
            this.dataSource = new MatTableDataSource<GroesseRow>(this.tableData);

            this.groessen.forEach((groesse:any):any =>
            {
                this.groessenZurTabelleHinzufuegen(groesse);
            });
        });


    }

    public addGroesse():void
    {
        this.groessenService.addGroesseForTraeger(this.categoryId,
            {
                name:           this._groesse,
                bestandsgrenze: this.bestandswarnung
            }).subscribe((result:any):any =>
            {
                this.alert.success('Die Größe wurde gespeichert.');

                let url:string = result.headers.get('Location');

                this.groessenService.getSingleGroesse(url).subscribe((groesse:any):any =>
                {
                    this.groessenZurTabelleHinzufuegen(groesse);
                });
            },
            (error:any):any =>
            {
                this.alert.error('Die Größe konnte nicht gespeichert werden! ' + error.error.message);
            });
    }

    public groessenZurTabelleHinzufuegen(groesse:any):void
    {
        this.tableData.push(
            {
                groesse: groesse
            }
        );

        this.dataSource._updateChangeSubscription();
    }

    public saveGroesse(groesse:any):void
    {
        this.groessenService.updateGroesse(groesse).subscribe(():any =>
            {
                this.alert.success('Die Größe wurde erfolgreich gespeichert');
            },
            (error:any):any =>
            {
                this.alert.error('Beim Speichern der Größe ist ein Fehler aufgetreten. ' + error.error.message);
            });
    }

    public deleteGroesse():any
    {
        this.groessenService.deleteGroesse(this.selection.selected[0].groesse).subscribe(():any =>
            {
                this.alert.success('Die Größe wurde gelöscht.');

                let idx:number = this.tableData.indexOf(this.selection.selected[0]);

                this.tableData.splice(idx, 1);
                this.selection.clear();
                this.dataSource._updateChangeSubscription();
            },
            (error:any):any =>
            {
                this.alert.error('Die Größe wurde nicht gelöscht. ' + error.error.message);
            });
    }

    public createBestandWarnung():void
    {
        let selected:any = this.selection.selected;

        const editDialog:MatDialogRef<GroessenUpdateDialogComponent> = this.dialog.open(GroessenUpdateDialogComponent,
            {
                autoFocus: true,
                data:      selected
            });

        editDialog.afterClosed().subscribe((neueGroesse:any):any =>
        {
            if(neueGroesse)
            {
                let saveGroesse:any = this.selection.selected[0].groesse;

                saveGroesse.name = neueGroesse.name;
                saveGroesse.bestandsgrenze = neueGroesse.bestandsgrenze;

                this.saveGroesse(saveGroesse);

                this.selection.selected[0] = saveGroesse;
                this.selection.clear();
                this.dataSource._updateChangeSubscription();
            }
        });
    }
}
