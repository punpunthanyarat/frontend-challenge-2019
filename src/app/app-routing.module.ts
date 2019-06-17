import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { environment } from '../environments/environment';
// import { LayoutModule } from './layout/layout.module';
const routes: Routes = [
  {
    path: '',
    data: {
      domain: environment.API_HOST,
      path: environment.AUTH_PATH
    },
    children: [
      {
        path: '', loadChildren: './layout/layout.module#LayoutModule'
      }
    ]
  },
  {
    path: '**', redirectTo: '', pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
