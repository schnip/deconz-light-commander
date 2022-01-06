import { Pulser } from "./pulser";
import { v4 as uuidv4 } from 'uuid';

export class Scene {
    id: string = uuidv4();
    baseColor: string = '#ffffff'
    syncronize: boolean = false;
    pulsers: Pulser[] = [];
}