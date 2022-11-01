import {Component, Inject, AfterViewInit} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {MapPoint} from "../../models/map-point";
import {CropperPosition, Dimensions} from "ngx-image-cropper";
import {PageEvent} from "@angular/material/paginator";

@Component({
  selector: 'map-modal',
  templateUrl: './map-modal.component.html',
  styleUrls: ['./map-modal.component.scss']
})
export class MapModalComponent implements AfterViewInit {

  image: any;
  base64: string = "";
  initialCropper: CropperPosition = {x1: 0, x2: 0, y1: 0, y2: 0};

  constructor(
    public dialogRef: MatDialogRef<MapModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: MapPoint[]) {
  }

  index = 0;


  onNoClick(): void {
    this.dialogRef.close();
  }

  ngAfterViewInit() {

  }

  cropperReady($event: Dimensions) {
    this.initialCropper = {
      x1: +this.data[this.index].bbox[0],
      x2: +this.data[this.index].bbox[0] + +this.data[this.index].bbox[2],
      y1: +this.data[this.index].bbox[1],
      y2: +this.data[this.index].bbox[1] + +this.data[this.index].bbox[3],
    }
  }

  pageChanged($event: PageEvent) {
    this.index = $event.pageIndex;
  }

  imageError(test: any) {
    console.log("load fiale");
  }
}
