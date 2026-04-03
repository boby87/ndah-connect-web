import { Component } from '@angular/core';
import {Haeder} from "../haeder/haeder";
import {Navbar} from "../navbar/navbar";
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-join-tontine',
  imports: [
    Haeder,
    Navbar,
    RouterLink
  ],
  templateUrl: './join-tontine.html',
  styleUrl: './join-tontine.css',
})
export class JoinTontine {

}
