import { Component, OnInit } from '@angular/core';
import { Pulser } from 'src/app/models/pulser';
import { Scene } from 'src/app/models/scene';
import { LightsService } from 'src/app/service/lights.service';

@Component({
  selector: 'app-scene',
  templateUrl: './scene.component.html',
  styleUrls: ['./scene.component.scss']
})
export class SceneComponent implements OnInit {
  model: Scene = new Scene();

  constructor(private readonly lightsService: LightsService) { }

  ngOnInit(): void {
    this.addPulser();
  }

  activate() {
    this.lightsService.clearScene();
    this.lightsService.startScene(this.model);
  }

  addPulser() {
    this.model.pulsers.push(new Pulser());
  }

}
