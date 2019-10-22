import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { UsusarioModel } from "../../models/usuario.model";
import { NgForm } from "@angular/forms";
import { AuthService } from "../../services/auth.service";
import Swal from "sweetalert2";

@Component({
  selector: "app-registro",
  templateUrl: "./registro.component.html",
  styleUrls: ["./registro.component.css"]
})
export class RegistroComponent implements OnInit {
  usuario: UsusarioModel;
  recordarme = false;
  constructor(private auth: AuthService, private router: Router) {}

  ngOnInit() {
    this.usuario = new UsusarioModel();
    // this.usuario.email = "dbc@iti.es";
  }
  onSubmit(form: NgForm) {
    if (form.invalid) {
      return;
    }
    Swal.fire({
      allowOutsideClick: false,
      type: "info",
      text: "Espere por favor"
    });
    this.auth.nuevoUsuario(this.usuario).subscribe(
      resp => {
        console.log(resp);
        Swal.close();
        if (this.recordarme) {
          localStorage.setItem("email", this.usuario.email);
        }
        this.router.navigateByUrl("/home");
      },
      err => {
        console.log(err.error.error.message);
        Swal.fire({
          type: "error",
          title: "Error al crear.",
          text: err.error.error.message
        });
      }
    );
    // console.log("Form Enviado");
    // console.log(this.usuario);
    // console.log(form);
  }
}
