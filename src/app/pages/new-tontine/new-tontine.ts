import { Component } from '@angular/core';
import {Haeder} from '../haeder/haeder';
import {Navbar} from '../navbar/navbar';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-new-tontine',
  imports: [
    CommonModule,
    FormsModule,
    Haeder,
    Navbar,
    RouterLink
  ],
  templateUrl: './new-tontine.html',
  styleUrl: './new-tontine.css',
})
export class NewTontine {
  regles: string[] = ['']; // première règle vide

  ajouterRegle() {
    this.regles.push('');
  }

  supprimerRegle(index: number) {
    this.regles.splice(index, 1);
  }

  trackByIndex(index: number, item: any): number {
    return index;
  }
}
