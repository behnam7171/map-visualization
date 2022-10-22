import {Injectable} from '@angular/core';
import {MapPoint} from "../models/map-point";

@Injectable({
  providedIn: 'root'
})
export class DataFetcherService {

  constructor() {

  }

  emotionData() {
    return [
      {
        "countryCode": "ir",
        "continentCode": "as",
        "numFaces": "500",
        "numWoman": "100",
        "numMan": "400",
        "aveAge": "34",
        "emotions": [
          {"emotion": "angry", "ratio": "0.4", "n_emotion_faces": "200", "aveConfidence": ".76"},
          {"emotion": "disgust", "ratio": "0.3", "n_emotion_faces": "150", "aveConfidence": ".58"},
          {"emotion": "fear", "ratio": "0.1", "n_emotion_faces": "50", "aveConfidence": ".80"},
          {"emotion": "happy", "ratio": "0.02", "n_emotion_faces": "10", "aveConfidence": ".96"},
          {"emotion": "sad", "ratio": "0.04", "n_emotion_faces": "20", "aveConfidence": ".83"},
          {"emotion": "surprise", "ratio": "0.05", "n_emotion_faces": "25", "aveConfidence": ".44"},
          {"emotion": "neutral", "ratio": "0.09", "n_emotion_faces": "45", "aveConfidence": ".29"}
        ]
      }
    ]
  }

  pointData(): MapPoint[] {
    const json: any = [{
      "countryCode" : "ir",
      "happyImg": [
        {name: "", "url":"http://farm4.staticflickr.com/3311/4583737074_69c1b1268e.jpg", "lat":38, "lon":-122, "bbox":["166","56","65","65"]},
      ],
      "sadImg": [],
      "angerImg": []
    }]
    const results: MapPoint[] = [];
    const extracted = json.map((y: any) => {
      const keys = Object.keys(y);
      const targetKeys = keys.filter(k => k.includes("Img"));
      return targetKeys.map((z: any) => y[z])
    })

    extracted.forEach((y: any) => {
      y.forEach((k: any) => k.forEach((l: MapPoint) => results.push(l)))
    })

    return results;
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
