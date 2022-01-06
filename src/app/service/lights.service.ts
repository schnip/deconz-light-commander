import { Injectable } from '@angular/core';
import { Scene } from '../models/scene';
import { HttpClient } from '@angular/common/http';
import { get } from 'color-string';
import { Pulser } from '../models/pulser';
import { combineLatest, Observable } from 'rxjs';

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
    const bulbId = this.getRandomBulbId();
    const xy = this.convertColorToXY(pulser.color);
    const xyReturn = this.convertColorToXY(this.activeScene?.baseColor || '#ffffff');
    const onFunction = this.activeScene?.syncronize ? this.setAll(pulser.color, timeIn) : this.setBulb(xy, bulbId, timeIn);
    const offFunction = this.activeScene?.syncronize ? this.setAll(this.activeScene.baseColor, timeOut) : this.setBulb(xyReturn, bulbId, timeOut);
    if (this.activeScene?.id === id) {
      setTimeout((_: any) => {
        if (this.activeScene?.id === id) {
          console.log('Set color of bulbs', bulbId, 'to', pulser.color)
          onFunction.subscribe(_ => {
            setTimeout((_: any) => {
              if (this.activeScene?.id === id) {
                console.log('Set color of bulbs', bulbId, 'back to', this.activeScene.baseColor)
                offFunction.subscribe(_ => {
                  if (this.activeScene?.id === id) {
                    console.warn('making a new one')
                    this.triggerPulser(pulser, id);
                  }
                })
              }
            }, duration)
          })
        }
      }, delay);
    }
    // setTimeout((_: any) => {
    //   if (this.activeScene?.id === id) {
    //     if (this.activeScene.syncronize) {
    //       this.setAll(pulser.color, timeIn);
    //     } else {
    //       // this.setRandom(pulser.color, timeIn);
    //       this.setBulb(xy, bulbId, timeIn);
    //     }
    //   }
    // }, delay);
    // setTimeout((_: any) => {
    //   if (this.activeScene?.id === id) {
    //     if (this.activeScene.syncronize) {
    //       this.setAll(this.activeScene.baseColor, timeOut);
    //     } else {
    //       // this.setRandom(this.activeScene.baseColor, timeOut);
    //       this.setBulb(xyReturn, bulbId, timeOut)
    //     }
    //   }
    // }, delay + timeIn + duration);
    // setTimeout((_: any) => {
    //   if (this.activeScene?.id === id) {
    //     console.warn('making a new one')
    //     this.triggerPulser(pulser, id);
    //   }
    // }, Math.floor((delay + timeIn + duration + timeOut) / pulser.concurrent));
  }

  setAll(color: string, transitiontime: number = 0): Observable<any> {
    const xy = this.convertColorToXY(color);
    return combineLatest(this.lightIds.map(id => this.setBulb(xy, id, transitiontime)));
  }

  setRandom(color: string, transitiontime: number = 0) {
    const indexId = this.getRandomInt(0, this.lightIds.length);
    this.setBulb(this.convertColorToXY(color), this.lightIds[indexId], transitiontime).subscribe(a => console.log('random'));
  }

  setBulb(xy: number[], id: number, transitiontime: number = 0): Observable<any> {
    return this.httpClient.put(
      `${this.url}/lights/${id}/state`,
      {
        xy,
        transitiontime
      }
    )
  }

  getRandomBulbId(): number {
    return this.lightIds[this.getRandomInt(0, this.lightIds.length)];
  }

  convertColorToXYold(color: string): number[] {
    console.log('color in', color)
    const v = get(color)?.value;
    const r = v?.[0] || 0;
    const g = v?.[1] || 0;
    const b = v?.[2] || 0;
    const x = r * .649926 + g * .103455 + b * .197109;
    const y = r * .234327 + g * .743075 + b * .022598;
    const z = r * 0 + g * .053077 + b * 1.035763;
    const xx = x / (x + y + z) || 0;
    const yy = y / (x + y + z) || 0;
    return [xx, yy]
  }

  convertColorToXY(color: string): number[] {
    // console.log('color in', color)
    const v = get(color)?.value;
    // console.log(v)
    const r = v?.[0] || 0;
    const g = v?.[1] || 0;
    const b = v?.[2] || 0;
    // const x = r * .649926 + g * .103455 + b * .197109;
    // const y = r * .234327 + g * .743075 + b * .022598;
    // const z = r * 0 + g * .053077 + b * 1.035763;
    // const xx = x/(x+y+z) || 0;
    // const yy = y/(x+y+z) || 0;

    let red = r
    let green = g
    let blue = b

    let redC = (red / 255)
    let greenC = (green / 255)
    let blueC = (blue / 255)
    // console.log(redC, greenC, blueC)


    let redN = (redC > 0.04045) ? Math.pow((redC + 0.055) / (1.0 + 0.055), 2.4) : (redC / 12.92)
    let greenN = (greenC > 0.04045) ? Math.pow((greenC + 0.055) / (1.0 + 0.055), 2.4) : (greenC / 12.92)
    let blueN = (blueC > 0.04045) ? Math.pow((blueC + 0.055) / (1.0 + 0.055), 2.4) : (blueC / 12.92)
    // console.log(redN, greenN, blueN)

    let X = redN * 0.664511 + greenN * 0.154324 + blueN * 0.162028;

    let Y = redN * 0.283881 + greenN * 0.668433 + blueN * 0.047685;

    let Z = redN * 0.000088 + greenN * 0.072310 + blueN * 0.986039;
    // console.log(X, Y, Z)

    let x = X / (X + Y + Z);

    let y = Y / (X + Y + Z);

    // X = x * 65536 
    // Y = y * 65536
    return [x, y]
  }

  getRandomInt(min: number, max: number) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
  }

}
