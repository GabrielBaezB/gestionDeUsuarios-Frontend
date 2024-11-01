import { Component, OnInit } from '@angular/core';
import { MessageService, SelectItem  } from 'primeng/api';
import { Usuario } from '../models/usuario';
import { UsuarioService } from '../services/usuario.service';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { TagModule } from 'primeng/tag';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms'; // Asegúrate de esto

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ButtonModule, TableModule, RouterModule, CommonModule, TagModule, DropdownModule, InputTextModule, FormsModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'] // corrected property name from 'styleUrl' to 'styleUrls'
})
export class HomeComponent implements OnInit {

  usuarios: Usuario[] = [];
  clonedUsuarios: { [s: string]: Usuario } = {};
  isDeleteInProgress: boolean = false;

  constructor(private usuarioService: UsuarioService, private messageService: MessageService) {}

  ngOnInit(): void {
    this.getAllUsuarios();
  }

  onRowEditInit(usuario: Usuario) {
    // Clone the row data when editing starts
    this.clonedUsuarios[usuario.id as number] = { ...usuario };
  }

  onRowEditSave(usuario: Usuario) {
    if (usuario.id > 0) {
        // Actualiza el usuario existente
        this.usuarioService.updateUsuarios(usuario).subscribe({
            next: (response) => {
                // Manejo de la respuesta exitosa
                delete this.clonedUsuarios[usuario.id as number];
                this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Usuario actualizado' });
                this.getAllUsuarios(); // Actualiza la lista después de la actualización
            },
            error: (error) => {
                // Manejo de error en la actualización
                console.error('Error al actualizar el usuario', error);
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al actualizar el usuario' });
            }
        });
    } else {
        // Crea un nuevo usuario
        this.usuarioService.createUsuarios(usuario).subscribe({
            next: (newUsuario) => {
                // Manejo de la respuesta exitosa al crear
                this.usuarios.push(newUsuario); // Agrega el nuevo usuario a la lista
                this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Usuario creado' });
                this.getAllUsuarios(); // Actualiza la lista después de la creación
            },
            error: (error) => {
                // Manejo de error en la creación
                console.error('Error al crear el usuario', error);
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al crear el usuario' });
            }
        });
    }
}


  onRowEditCancel(usuario: Usuario, index: number) {
    // Restore the original row data from the clone
    this.usuarios[index] = this.clonedUsuarios[usuario.id as number];
    delete this.clonedUsuarios[usuario.id as number];
  }

  validateUsuario(usuario: Usuario): boolean {
    // Simple validation logic
    return !!usuario.name && !!usuario.email && !!usuario.phone && !!usuario.address;
  }

  getAllUsuarios() {
    this.usuarioService.getUsuarios().subscribe((data) => {
      this.usuarios = data;
    });
  }

  deleteUsuarios(id: number) {
    this.isDeleteInProgress = true;
    this.usuarioService.deleteUsuarios(id).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Deleted',
          detail: 'User deleted successfully.'
        });
        this.isDeleteInProgress = false;
        this.getAllUsuarios();
      },
      error: () => {
        this.isDeleteInProgress = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Unable to delete user.'
        });
      }
    });
  }
}
