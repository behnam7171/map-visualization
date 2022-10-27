import {Injectable} from '@angular/core';
import {MapPoint} from "../models/map-point";

@Injectable({
  providedIn: 'root'
})
export class DataFetcherService {

  countryCodes = ["fo","um","us","jp","sc","in","fr","fm","cn","pt","sw","sh","br","ki","ph","mx","es","bu","mv","sp","gb","gr","as","dk","gl","gu","mp","pr","vi","ca","st","cv","dm","nl","jm","ws","om","vc","tr","bd","lc","nr","no","kn","bh","to","fi","id","mu","se","tt","my","pa","pw","tv","mh","cl","th","gd","ee","ag","tw","bb","it","mt","vu","sg","cy","lk","km","fj","ru","va","sm","kz","az","tj","ls","uz","ma","co","tl","tz","ar","sa","pk","ye","ae","ke","pe","do","ht","pg","ao","kh","vn","mz","cr","bj","ng","ir","sv","sl","gw","hr","bz","za","cf","sd","cd","kw","de","be","ie","kp","kr","gy","hn","mm","ga","gq","ni","lv","ug","mw","am","sx","tm","zm","nc","mr","dz","lt","et","er","gh","si","gt","ba","jo","sy","mc","al","uy","cnm","mn","rw","so","bo","cm","cg","eh","rs","me","tg","la","af","ua","sk","jk","bg","qa","li","at","sz","hu","ro","ne","lu","ad","ci","lr","bn","iq","ge","gm","ch","td","kv","lb","dj","bi","sr","il","ml","sn","gn","zw","pl","mk","py","by","cz","bf","na","ly","tn","bt","md","ss","bw","bs","nz","cu","ec","au","ve","sb","mg","is","eg","kg","np"];

  constructor() {

  }

  emotionData() {
    return this.countryCodes.map((x) => {
      return {
        "countryCode": x,
        "continentCode": "as",
        "numFaces": "500",
        "numWoman": "100",
        "numMan": "400",
        "aveAge": "34",
        "emotions": [
          {"emotion": "angry", "ratio": Math.random(), "n_emotion_faces": "200", "aveConfidence": ".76"},
          {"emotion": "disgust", "ratio": Math.random(), "n_emotion_faces": "150", "aveConfidence": ".58"},
          {"emotion": "fear", "ratio": Math.random(), "n_emotion_faces": "50", "aveConfidence": ".80"},
          {"emotion": "happy", "ratio": Math.random(), "n_emotion_faces": "10", "aveConfidence": ".96"},
          {"emotion": "sad", "ratio": Math.random(), "n_emotion_faces": "20", "aveConfidence": ".83"},
          {"emotion": "surprise", "ratio": Math.random(), "n_emotion_faces": "25", "aveConfidence": ".44"},
          {"emotion": "neutral", "ratio": Math.random(), "n_emotion_faces": "45", "aveConfidence": ".29"}
        ]
      }
    })
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
