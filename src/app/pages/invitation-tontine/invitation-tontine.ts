import { Component } from '@angular/core';
import {Haeder} from "../haeder/haeder";
import {Navbar} from "../navbar/navbar";

@Component({
  selector: 'app-invitation-tontine',
    imports: [
        Haeder,
        Navbar
    ],
  templateUrl: './invitation-tontine.html',
  styleUrl: './invitation-tontine.css',
})
export class InvitationTontine {
  progress = 20; // exemple

  fileName: string = '';

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.fileName = file.name;
      console.log(file);
    }
  }
}
