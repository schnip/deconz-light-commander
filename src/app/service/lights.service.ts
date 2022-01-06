import { Injectable } from '@angular/core';
import { Scene } from '../models/scene';
import { HttpClient } from '@angular/common/http';
import { get } from 'color-string';

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
    console.log(scene);
  }

  setAll(color: string) {
    this.lightIds.forEach(id => {
      console.log(get(color))
      this.httpClient.put(
        `${this.url}/lights/${id}/state`,
        {
          ct: 153,
          transitiontime: 0
        }
      ).subscribe(res => {
        console.log('Set bulb', id, 'to', color);
      })
    })
  }

}
