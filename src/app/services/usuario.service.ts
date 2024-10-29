import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Usuario } from '../models/usuario';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  private apiUrl = 'http://localhost:8080/api/usuarios';

  constructor(private http:HttpClient) { }

  getUsuarios():Observable<Usuario[]>{
    return this.http.get<Usuario[]>(this.apiUrl);
  }
  getUsuariosById(id:number):Observable<Usuario>{
    return this.http.get<Usuario>(`${this.apiUrl}/${id}`);
  }
  createUsuarios(usuario:Usuario):Observable<Usuario>{
    return this.http.post<Usuario>(this.apiUrl, usuario);
  }
  updateUsuarios(usuario:Usuario){
    return this.http.put(this.apiUrl, usuario);
  }
  deleteUsuarios(id:number){
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
