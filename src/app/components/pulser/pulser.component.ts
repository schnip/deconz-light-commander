import { Component, Input, OnInit } from '@angular/core';
import { Pulser } from 'src/app/models/pulser';

@Component({
  selector: 'app-pulser',
  templateUrl: './pulser.component.html',
  styleUrls: ['./pulser.component.scss']
})
export class PulserComponent implements OnInit {
  @Input() model: Pulser = new Pulser();

  constructor() { }

  ngOnInit(): void {
  }

}
