import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { Usuario } from '../models/usuario';
import { UsuarioService } from '../services/usuario.service';
import { RouterModule } from '@angular/router';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ButtonModule, CardModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

  usuarios: Usuario[] = []
  isDeleteInProgress:boolean = false

  constructor(private usuarioService: UsuarioService, private messageService:MessageService) { }

  ngOnInit(): void {
    this.getAllUsuarios()
  }

  getAllUsuarios() {
    this.usuarioService.getUsuarios().subscribe((data) => {
      this.usuarios = data;
    });
  }

  deleteUsuarios(id:number) {
    this.isDeleteInProgress=true
    this.usuarioService.deleteUsuarios(id).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Guardado',
          detail: 'Usuario eliminado',
        });
        this.isDeleteInProgress=false
        this.getAllUsuarios();
      },
      error: () => {
        this.isDeleteInProgress=false
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se puede eliminar',
        });
      },
    });
  }
}
