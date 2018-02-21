import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  apellidoP: String;
  apellidoM: String;
  nombre: String;
  telefonoF: Number;
  telefonoC: Number;
  username: String;
  bachillerato: String;
  preparatoria: String;
  municipio: String;
  turnoActual: String;
  turnoCurso: String;
  carreraUno: String;
  carreraDos: String;
  carreraTres: String;
  password: String;

  constructor() { }

  ngOnInit() {
  }

}
