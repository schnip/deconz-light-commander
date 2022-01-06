import { Injectable } from '@angular/core';
import { Scene } from '../models/scene';
import { HttpClient } from '@angular/common/http';
import { get } from 'color-string';
import { Pulser } from '../models/pulser';

@Injectable({
  providedIn: 'root'
})
export class LightsService {

  private url: string = 'http://192.168.2.79:40850/api/34D3292FFF';
  private lightIds: number[] = [];
  private activeScene: Scene | null = null;

  constructor(
    private readonly httpClient: HttpClient
  ) { }

  setup(u: string, l: number[]) {
    this.url = u;
    this.lightIds = l;
  }

  clearScene() {
    this.activeScene = null;
  }

  startScene(scene: Scene) {
    this.activeScene = scene;
    this.setAll(this.activeScene.baseColor);
    this.triggerAllPulsers(this.activeScene.pulsers);
    console.log(scene);
  }

  triggerAllPulsers(pulsers: Pulser[]) {
    pulsers.forEach(p => this.triggerPulser(p, this.activeScene?.id || ''));
  }

  triggerPulser(pulser: Pulser, id: string) {
    const delay = this.getRandomInt(pulser.frequency - pulser.frequencyRange, pulser.frequency + pulser.frequencyRange);
    const duration = this.getRandomInt(pulser.duration - pulser.durationRange, pulser.duration + pulser.durationRange);
    const timeIn = this.getRandomInt(pulser.transitionSpeed - pulser.transitionSpeedRange, pulser.transitionSpeed + pulser.transitionSpeedRange);
    const timeOut = this.getRandomInt(pulser.transitionSpeed - pulser.transitionSpeedRange, pulser.transitionSpeed + pulser.transitionSpeedRange);
    setTimeout(_ => {
      if (this.activeScene?.id === id) {
        if (this.activeScene.syncronize) {
          this.setAll(pulser.color, timeIn);
        } else {
          this.setRandom(pulser.color, timeIn);
        }
      }
    }, delay);
    setTimeout(_ => {
      if (this.activeScene?.id === id) {
        if (this.activeScene.syncronize) {
          this.setAll(pulser.color, timeOut);
        } else {
          this.setRandom(pulser.color, timeOut);
        }
      }
    }, delay + timeIn + duration);
    setTimeout(_ => {
      if (this.activeScene?.id === id) {
        this.triggerPulser(pulser, id);
      }
    }, Math.floor((delay + timeIn + duration + timeOut) / pulser.concurrent));
  }

  setAll(color: string, transitiontime: number = 0) {
    const xy = this.convertColorToXY(color);
    this.lightIds.forEach(id => this.setBulb(xy, id, transitiontime))
  }

  setRandom(color: string, transitiontime: number = 0) {
    const indexId = this.getRandomInt(0, this.lightIds.length);
    this.setBulb(this.convertColorToXY(color), this.lightIds[indexId], transitiontime);
  }

  setBulb(xy: number[], id: number, transitiontime: number = 0) {
    this.httpClient.put(
      `${this.url}/lights/${id}/state`,
      {
        xy,
        transitiontime
      }
    ).subscribe(res => {
      console.log('Set bulb', id, 'to', xy);
    })
  }

  convertColorToXY(color: string): number[] {
    const v = get(color)?.value;
    const r = v?.[0] || 0;
    const g = v?.[1] || 0;
    const b = v?.[2] || 0;
    const x = r * .649926 + g * .103455 + b * .197109;
    const y = r * .234327 + g * .743075 + b * .022598;
    const z = r * 0 + g * .053077 + b * 1.035763;
    const xx = x/(x+y+z);
    const yy = y/(x+y+z);
    return [xx, yy]
  }

  getRandomInt(min: number, max: number) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
  }

}
