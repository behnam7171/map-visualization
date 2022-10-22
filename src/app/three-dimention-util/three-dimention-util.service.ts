import { Injectable } from '@angular/core';
import {ChartRedrawCallbackFunction} from "highcharts/highmaps";

@Injectable({
  providedIn: 'root'
})
export class ThreeDimentionUtilService {

  constructor() { }

  renderSea(event: ChartRedrawCallbackFunction | any) {
    const chart = event.target;
    let verb = 'animate';
    if (!chart.sea) {
      chart.sea = chart.renderer
        .circle()
        .attr({
          fill: {
            radialGradient: {
              cx: 0.4,
              cy: 0.4,
              r: 1
            },
            stops: [
              [0, 'white'],
              [1, 'lightblue']
            ]
          },
          zIndex: -1
        })
        .add(chart.get('graticule').group);
      verb = 'attr';
    }

    const bounds = chart.get('graticule').bounds,
      p1 = chart.mapView.projectedUnitsToPixels({
        x: bounds.x1,
        y: bounds.y1
      }),
      p2 = chart.mapView.projectedUnitsToPixels({
        x: bounds.x2,
        y: bounds.y2
      });
    chart.sea[verb]({
      cx: (p1.x + p2.x) / 2,
      cy: (p1.y + p2.y) / 2,
      r: Math.min(p2.x - p1.x, p1.y - p2.y) / 2
    });
  };
}
