import { Component, OnInit } from '@angular/core';
import { Scene } from 'src/app/models/scene';
import { LightsService } from 'src/app/service/lights.service';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss']
})
export class MainPageComponent implements OnInit {
  scenes: Scene[] = [];
  url: string = 'http://192.168.2.79:40850/api/34D3292FFF';
  lightIds: string = '1,3,4,5,6,7';

  constructor(private readonly lightsService: LightsService) { }

  ngOnInit(): void {
    this.loadService();
    this.addScene();
  }

  addScene() {
    this.scenes.push(new Scene());
  }

  get parsedLightIds(): number[] {
    return this.lightIds.split(',').map(li => Number.parseInt(li.trim()));
  }

  loadService() {
    this.lightsService.setup(this.url, this.parsedLightIds);
  }

  stop() {
    this.lightsService.clearScene();
  }

}
