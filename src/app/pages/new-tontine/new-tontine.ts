import { Component } from '@angular/core';
import {Haeder} from '../haeder/haeder';
import {Navbar} from '../navbar/navbar';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-new-tontine',
  imports: [
    CommonModule,
    FormsModule,
    Haeder,
    Navbar
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
