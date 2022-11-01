import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {HighchartsChartModule} from "highcharts-angular";
import {MatSlideToggleModule} from "@angular/material/slide-toggle";
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatButtonToggleModule} from "@angular/material/button-toggle";
import {MatSelectModule} from "@angular/material/select";
import {MatIconModule} from "@angular/material/icon";
import {MatSidenavModule} from "@angular/material/sidenav";
import {MatListModule} from "@angular/material/list";
import {MapModalComponent} from './base-components/map-modal/map-modal.component';
import {MatDialogModule} from "@angular/material/dialog";
import {ImageCropperModule} from "ngx-image-cropper";
import {MatPaginatorModule} from "@angular/material/paginator";

@NgModule({
  declarations: [
    AppComponent,
    MapModalComponent
  ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        HighchartsChartModule,
        MatSlideToggleModule,
        MatToolbarModule,
        MatButtonToggleModule,
        MatSelectModule,
        MatIconModule,
        MatSidenavModule,
        MatListModule,
        MatDialogModule,
        ImageCropperModule,
        MatPaginatorModule
    ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
