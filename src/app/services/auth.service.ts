import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { UsusarioModel } from "../models/usuario.model";
import { map } from "rxjs/operators";

@Injectable({
  providedIn: "root"
})
export class AuthService {
  private url = "https://identitytoolkit.googleapis.com/v1/accounts:";
  private apikey = "AIzaSyA3wuCANJt6aIWbbjcWyCHra-OtdvHCnts";

  userToken: string = "";
  // Crear nuevo usuario
  // https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=[API_KEY]

  // LogIn
  // https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=[API_KEY]

  constructor(private http: HttpClient) {}
  logout() {
    localStorage.removeItem("token");
  }
  login(usuario: UsusarioModel) {
    const authData = {
      ...usuario,

      returnSecureToken: true
    };
    return this.http
      .post(`${this.url}signInWithPassword?key=${this.apikey}`, authData)
      .pipe(
        map(resp => {
          this.guardarToken(resp["idToken"]);
          return resp;
        })
      );
  }
  nuevoUsuario(usuario: UsusarioModel) {
    const authData = {
      // email: usuario.email,
      // password: usuario.password,

      // Esto es lo mismo que arriba
      ...usuario,

      returnSecureToken: true
    };

    return this.http
      .post(`${this.url}signUp?key=${this.apikey}`, authData)
      .pipe(
        map(resp => {
          this.guardarToken(resp["idToken"]);
          return resp;
        })
      );
  }

  private guardarToken(idToken: string) {
    this.userToken = idToken;
    localStorage.setItem("token", idToken);
    let hoy = new Date();
    hoy.setSeconds(3600);
    localStorage.setItem("expira", hoy.getTime().toString());
  }
  leerToken() {
    if (localStorage.getItem("token")) {
      this.userToken = localStorage.getItem("token");
    } else {
      this.userToken = "";
    }
    return this.userToken;
  }
  autenticado(): boolean {
    if (this.userToken.length < 2) {
      return false;
    }
    const expira = Number(localStorage.getItem("expira"));
    const expriraDate = new Date();
    expriraDate.setTime(expira);
    if (expriraDate > new Date()) {
      return true;
    } else {
      return false;
    }
    // return this.userToken != null;
  }
}
