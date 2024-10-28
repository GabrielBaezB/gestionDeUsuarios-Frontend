import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { UserFormComponent } from './user-form/user-form.component';

export const routes: Routes = [
    {
        path:'',
        component:HomeComponent,
        title: 'Pagina de inicio'
    },
    {
        path:'user-form/:id',
        component:UserFormComponent,
        title:'Formulario de usuarios'
    },
    {
        path:'**',
        redirectTo:'',
        pathMatch:'full'
    }

];
