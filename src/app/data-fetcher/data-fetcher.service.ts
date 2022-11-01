import {Injectable} from '@angular/core';
import {MapPoint} from "../models/map-point";
import * as points from "../../assets/consolidated_sample_5M_images.json"
import {emotions} from "../models/emotions";

@Injectable({
  providedIn: 'root'
})
export class DataFetcherService {

  constructor() {

  }

  pointData(currentEmotion: emotions): MapPoint[] {
    const json: any = Array.from(points);
    console.log('points', json)
    const results: MapPoint[] = [];
    const extracted = json.map((y: any) => {
      const keys = Object.keys(y);
      let targetKeys;
      if(currentEmotion === emotions.all) {
        targetKeys = keys.filter(k => k.includes("Img"));
      } else {
        targetKeys = keys.filter(k => k.includes(currentEmotion + "Img"));
      }
      return targetKeys.map((z: any) => y[z])
    })

    extracted.forEach((y: any) => {
      y.forEach((k: any) => k.forEach((l: MapPoint) => {
        l.bbox = [(l as any).x, (l as any).y, (l as any).w, (l as any).h]
        delete (l as any).x
        delete (l as any).y
        delete (l as any).w
        delete (l as any).h
        results.push(l)
      }))
    })

    return results as any;
  }


  getGraticule(): any[] {
    const data = [];
    for (let x = -180; x <= 180; x += 15) {
      data.push({
        geometry: {
          type: 'LineString',
          coordinates: x % 90 === 0 ? [
            [x, -90],
            [x, 0],
            [x, 90]
          ] : [
            [x, -80],
            [x, 80]
          ]
        }
      });
    }
    for (let y = -90; y <= 90; y += 10) {
      const coordinates = [];
      for (let x = -180; x <= 180; x += 5) {
        coordinates.push([x, y]);
      }
      data.push({
        geometry: {
          type: 'LineString',
          coordinates
        },
        lineWidth: y === 0 ? 2 : undefined
      });
    }
    return data;
  }
}
