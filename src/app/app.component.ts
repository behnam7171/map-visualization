import {Component, OnInit, ViewChild} from '@angular/core';
import * as Highcharts from "highcharts/highmaps";
import markerClusters from 'highcharts/modules/marker-clusters';

markerClusters(Highcharts)
import {Chart, ChartOptions} from "highcharts/highmaps";
import * as worldMap from "@highcharts/map-collection/custom/world.topo.json";
import {DataFetcherService} from "./data-fetcher/data-fetcher.service";
import {ThreeDimentionUtilService} from "./three-dimention-util/three-dimention-util.service";
import {MatSlideToggleChange} from "@angular/material/slide-toggle";
import {MapNavigationOptions} from "highcharts";
import {emotions} from "./models/emotions";
import {MatButtonToggleChange} from "@angular/material/button-toggle";
import {ages} from "./models/age";
import {genders} from "./models/gender";
import {MatDialog} from "@angular/material/dialog";
import {MapModalComponent} from "./base-components/map-modal/map-modal.component";
import {EmotionHCRow} from "./models/emotionHCRow";
import * as emotionData from "../assets/consolidated_sample_5M.json"

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  constructor(private dataFetcher: DataFetcherService,
              private threeDimentionUtilService: ThreeDimentionUtilService,
              private dialog: MatDialog) {

  }

  is3D: boolean = false;

  currentEmotion: emotions = emotions.happy;
  emotions = emotions;
  ages = ages;
  genders = genders;

  selectedAge: ages = ages.all;
  selectedGender: genders = genders.all;
  opened: boolean = false;
  maxRatio: number = 0;

  baseMapPath = 'https://code.highcharts.com/mapdata/'

  title = 'map-visualization';
  @ViewChild('chart') componentRef: any;
  Highcharts: typeof Highcharts = Highcharts; // required
  chartConstructor: string = 'mapChart'; // optional string, defaults to 'chart'
  chartOptions: Highcharts.Options = {} // required
  baseChartOptions: Highcharts.Options = {
    chart: {
      map: worldMap, // "/custom/world.js",//countries/ir/ir-all.js
      events: {}
    },
    tooltip: {
      valuePrefix: '%',
      clusterFormat: "Number of images in this cluster: {point.clusterPointsAmount}"
    },
    plotOptions: {
      mappoint: {
        cluster: {
          enabled: true,
          allowOverlap: false,
          animation: {
            duration: 450
          },
          layoutAlgorithm: {
            type: 'grid',
            gridSize: 50
          },
          zones: [{
            from: 1,
            to: 4,
            marker: {
              radius: 13
            }
          }, {
            from: 5,
            to: 9,
            marker: {
              radius: 15
            }
          }, {
            from: 10,
            to: 15,
            marker: {
              radius: 17
            }
          }, {
            from: 16,
            to: 20,
            marker: {
              radius: 19
            }
          }, {
            from: 21,
            to: 100,
            marker: {
              radius: 21
            }
          }]
        }
      }
    },
    title: {
      text: "Emotion Visualization",
    },
    subtitle: {
      text: "Brought to you by Group 21: Behnam, River, Daniel"
    },
    mapNavigation: {
      enabled: true,
      buttonOptions: {
        alignTo: "spacingBox"
      }
    },
    legend: {
      enabled: true
    },
    series: [],
    credits: {
      text: 'LSDE 2022 - Group 21',
      href: ''
    },
  };
  updateFlag: boolean = false; // optional boolean
  oneToOneFlag: boolean = true; // optional boolean, defaults to false
  runOutsideAngular: boolean = false; // optional boolean, defaults to false

  ngOnInit() {
    this.initiateRender();
  }

  initiateRender() {
    this.chartOptions = JSON.parse(JSON.stringify(this.baseChartOptions))
    this.dataGenerator();
    if (this.is3D) {
      this.threeDimentionPipeline();
    } else {
      this.twoDimentionPipeline();
    }
    this.commonConfig()
  }

  dataGenerator() {
    this.prepareBaseMapData();
    this.prepareEmotionData();
    this.preparePointsData();
  }

  prepareBaseMapData() {
    (this.chartOptions.series as any[]).push({
      name: 'Basemap',
      id: 'basemap',
      borderColor: '#A0A0A0',
      nullColor: 'rgba(200, 200, 200, 0.3)',
      showInLegend: false
    });
  }

  prepareEmotionData() {
    (this.chartOptions.series as any[]).push({
      name: "Emotion data",
      // color: "rgb(124,181,236)",
      states: {
        hover: {
          color: "#BADA55"
        }
      },
      tooltip: {
        pointFormat: "{point.name}: {point.value}<br/>Continent: {point.continent}<br/>Average Age: {point.avgAge}<br/>Men: {point.percentMan}%<br/>Women: {point.percentWoman}%<br/>Number of faces: {point.numFaces}"
      },
      dataLabels: {
        enabled: true,
        format: "{point.name}"
      },
      joinBy: ['hc-key', 'country'],
      allAreas: false,
      data: this.applyEmotionFilters()// [["ir", 2]]
    } as Highcharts.SeriesMapDataOptions,)
  }

  preparePointsData() {
    (this.chartOptions.series as any[]).push({
      // Specify points using lat/lon
      type: "mappoint",
      name: "Images",
      turboThreshold: 0,
      accessibility: {
        point: {
          descriptionFormatter: function (point: any) {
            if (point.isCluster) {
              return 'Grouping of ' + point.clusterPointsAmount + ' points.';
            }
            return point.name + ', country code: ' + point.country + '.';
          }
        }
      },
      tooltip: {
        pointFormat: "lat: <b>{point.lat}</b><br/>lon: <b>{point.lon}</b><br/>",
      },
      marker: {
        states: {
          hover: {
            enabled: true
          }
        },
        fillColor: "tomato"
      },
      events: {
        click: (event: any) => {
          this.initializePointInfoModal(event)
        }
      },
      data: this.dataFetcher.pointData(this.currentEmotion)
    })
  }

  applyEmotionFilters(): EmotionHCRow[] {
    this.maxRatio = 0;
    const allData = Array.from(emotionData);
    let result: EmotionHCRow[] = [];
    allData.forEach((x: any) => {
      const row: EmotionHCRow = {country: x.country, value: null, avgAge: x.avgAge, percentMan: +((x.numMan/x.numFaces)*100).toFixed(2), percentWoman: +((x.numWoman/x.numFaces)*100).toFixed(2), numFaces: x.numFaces, continent: x.continent.toUpperCase()}
      if (this.currentEmotion == emotions.all) {
        (result as any) = [...result, ...x.emotions.map((y: any) => {
          return {country: x.country, value: y.ratio}
        })]
      } else {
        const foundRelevantEmotion = x.emotions.find((y: any) => y.emotion == this.currentEmotion)
        if (foundRelevantEmotion) {
          if (+foundRelevantEmotion.ratio > this.maxRatio)
            this.maxRatio = +foundRelevantEmotion.ratio;
          row.value = +foundRelevantEmotion.ratio * 100;
        }
        result.push(row);
      }
    })
    this.maxRatio = this.maxRatio * 100;
    return result;
  }

  commonConfig() {
    this.chartOptions.colorAxis = {
      minColor: '#BFCFAD',
      maxColor: '#31784B',
      min: 0,
      max: this.maxRatio,
      labels: {
        formatter: function () {
          return '<b>%' +
            this.value + '</b>';
        }
      }
    };
  }

  twoDimentionPipeline() {
    (this.chartOptions.chart as ChartOptions).events = {};
    // (this.chartOptions.chart as ChartOptions).plotBackgroundColor = '#4b96af'
  }

  threeDimentionPipeline() {
    (this.chartOptions.chart as ChartOptions).events = {
      redraw: this.threeDimentionUtilService.renderSea,
      load: this.threeDimentionUtilService.renderSea
    }

    this.chartOptions.mapView = {
      maxZoom: 30,
      projection: {
        name: 'Orthographic',
        rotation: [60, -30]
      }
    };

    (this.chartOptions.plotOptions as any).series = {
      animation: {
        duration: 750
      },
      clip: false
    };

    (this.chartOptions.mapNavigation as MapNavigationOptions).enabled = false;

    this.chartOptions.series?.unshift({
      name: 'Graticule',
      id: 'graticule',
      type: 'mapline',
      data: this.dataFetcher.getGraticule(),
      nullColor: 'rgba(0, 0, 0, 0.05)',
      accessibility: {
        enabled: false
      },
      enableMouseTracking: false
    })

  }

  destroyChart() {
    this.componentRef.chart.destroy();
    this.componentRef.chart = null;
  }

  chartCallback(chart: Chart) {

  }

  displayModeChanged($event: MatSlideToggleChange) {
    this.is3D = $event.checked;
    this.restartRendering();
  }

  restartRendering() {
    this.destroyChart();
    this.initiateRender();
    this.updateFlag = true;
  }

  emotionChanged($event: MatButtonToggleChange) {
    this.currentEmotion = $event.value;
    this.restartRendering();

  }

  ageChanged($event: Event) {
    console.log($event)
  }

  initializePointInfoModal(event: any) {

    const dialogRef = this.dialog.open(MapModalComponent, {
      width: 'auto',
      height: "auto",
      data: event.point.clusteredData ? event.point.clusteredData.map((y: any) => y.options) : [event.point.options],
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      console.log(result)
    });
  }

}
