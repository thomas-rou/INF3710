import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { AppComponent } from "./app.component";
import { BirdComponent } from "./bird/bird.component";

const routes: Routes = [
  { path: "app", component: AppComponent },
  { path: "birds", component: BirdComponent },
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule { }