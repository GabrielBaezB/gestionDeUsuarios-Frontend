import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { UsuarioService } from '../services/usuario.service';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MessageService } from 'primeng/api';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormsModule,
    ButtonModule,
    ToastModule,
    RouterModule,
    InputTextModule,
    InputNumberModule,
    CardModule
  ],
  templateUrl: './user-form.component.html',
  styleUrl: './user-form.component.css'
})
export class UserFormComponent {

  formUsuario!: FormGroup;
  isSaveInProgress: boolean = false;
  edit: boolean = false;

  constructor(private fb: FormBuilder,
    private usuarioService: UsuarioService,
    private activatedRoute: ActivatedRoute,
    private messageService: MessageService,
    private router: Router
  ) {
    this.formUsuario = this.fb.group({
      id: [null],
      name: ['', Validators.required],
      email: ['', Validators.required],
      phone: ['', Validators.required],
      address: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    let id = this.activatedRoute.snapshot.paramMap.get('id');
    if (id !== 'new') {
      this.edit = true;
      this.getUsuarioById(+id!)
    }
  }

  getUsuarioById(id: number) {
    this.usuarioService.getUsuariosById(id).subscribe({
      next: (foundUsuario) => {
        this.formUsuario.patchValue(foundUsuario);
      },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No encontrado' });
        this.router.navigateByUrl('/')
      },
    });
  }

  createUsuario() {
    if (this.formUsuario.invalid) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Revisa los campos e intente nuevamente',
      });
      return
    }
    this.isSaveInProgress=true
    this.usuarioService.createUsuarios(this.formUsuario.value).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Guardado',
          detail: 'Usuario agregado correctamente',
        });
        this.isSaveInProgress=false
        this.router.navigateByUrl('/')
      },
      error: () => {
        this.isSaveInProgress=false
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Revisa los campos e intente nuevamente',
        });
      }
    })
  }
  updateUsuarios() {
    if (this.formUsuario.invalid) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Revisa los campos e intente nuevamente',
      });
      return
    }
    this.isSaveInProgress=true
    this.usuarioService.updateUsuarios(this.formUsuario.value).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Guardado',
          detail: 'Usuario actualizado correctamente',
        });
        this.isSaveInProgress=false
        this.router.navigateByUrl('/')
      },
      error: () => {
        this.isSaveInProgress=false
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Revisa los campos e intente nuevamente',
        });
      }
    })
  }
}
