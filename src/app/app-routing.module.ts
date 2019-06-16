import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { environment } from '../environments/environment';
import { LayoutModule } from './layout/layout.module';
const routes: Routes = [
  {
    path: '',
    data: {
      domain: environment.API_HOST,
      frontkey: environment.AUTH_FRONTKEY,
      path: environment.AUTH_PATH
    },
    children: [
      {
        path: '', loadChildren: () => LayoutModule
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
