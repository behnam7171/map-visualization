import {Component, OnInit, ViewChild} from '@angular/core';
import * as Highcharts from "highcharts/highmaps";
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
    colorAxis: {
      tickPixelInterval: 0.1,
      minColor: '#BFCFAD',
      maxColor: '#31784B',
      min: 0,
      max: 1
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
    console.log(Highcharts);
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
      events: {
        click: (event: any) => {
          this.drillDown(event)
        }
      },
      dataLabels: {
        enabled: true,
        format: "{point.name}"
      },
      joinBy: ['hc-key', 'countryCode'],
      allAreas: false,
      data: this.applyEmotionFilters()// [["ir", 2]]
    } as Highcharts.SeriesMapDataOptions,)
  }

  preparePointsData() {
    console.log(this.applyEmotionFilters());
    (this.chartOptions.series as any[]).push({
      // Specify points using lat/lon
      type: "mappoint",
      name: "Images",
      tooltip: {
        pointFormat: "lat: <b>{point.lat}</b><br/>lon: <b>{point.lon}</b><br/>"
      },
      marker: {
        radius: 5,
        fillColor: "tomato"
      },
      events: {
        click: (event: any) => {
          this.initializePointInfoModal(event)
        }
      },
      data: this.dataFetcher.pointData()
    })
  }

  applyEmotionFilters(): EmotionHCRow[] {
    const allData = this.dataFetcher.emotionData();
    let result: EmotionHCRow[] = [];
    allData.forEach((x) => {
      const row: EmotionHCRow = {countryCode: x.countryCode, value: null}
      if (this.currentEmotion == emotions.all) {
        (result as any) = [...result, ...x.emotions.map((y) => {
          return {countryCode: x.countryCode, value: y.ratio}
        })]
      } else {
        const foundRelevantEmotion = x.emotions.find(y => y.emotion == this.currentEmotion)
        if (foundRelevantEmotion) {
          row.value = +foundRelevantEmotion.ratio;
        }
        result.push(row);
      }
    })
    return result;
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

    this.chartOptions.plotOptions = {
      series: {
        animation: {
          duration: 750
        },
        clip: false
      }
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
    this.destroyChart();
    this.initiateRender();
    this.updateFlag = true;
  }

  emotionChanged($event: MatButtonToggleChange) {
    console.log($event.value)

  }

  ageChanged($event: Event) {
    console.log($event)
  }

  drillDown(event: any) {
    console.log(event);
    const mapKey = ""
    const topojsonPath = this.baseMapPath + mapKey + '.topo.json';
  }

  initializePointInfoModal(event: any) {
    console.log(event);
    const dialogRef = this.dialog.open(MapModalComponent, {
      width: 'auto',
      height: "auto",
      data: event.point.options,
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      console.log(result)
    });
  }

}
