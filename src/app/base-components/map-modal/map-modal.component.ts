import {Component, OnInit, Inject, AfterViewInit} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {MapPoint} from "../../models/map-point";
import {CropperPosition, Dimensions} from "ngx-image-cropper";

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
    @Inject(MAT_DIALOG_DATA) public data: MapPoint) {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  getBase64Image(img: any) {
    var canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;
    var ctx = canvas.getContext("2d") as any;
    ctx.drawImage(img, 0, 0);
    var dataURL = canvas.toDataURL("image/png");
    return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
  }

  ngAfterViewInit() {

  }

  cropperReady($event: Dimensions) {
    this.initialCropper = {
      x1: +this.data.bbox[0],
      x2: +this.data.bbox[0] + +this.data.bbox[2],
      y1: +this.data.bbox[1],
      y2: +this.data.bbox[1] + +this.data.bbox[3],
    }
  }
}
