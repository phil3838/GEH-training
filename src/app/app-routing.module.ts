import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AudioVersionComponent } from './audio-version/audio-version.component';
import { AppComponent } from './app.component';

const routes: Routes = [
  {
    path: '',
    component: AppComponent
  },
  {
    path: 'audio',
    component: AudioVersionComponent
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
