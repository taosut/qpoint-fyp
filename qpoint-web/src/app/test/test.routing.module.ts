import {RouterModule, Routes} from "@angular/router";
import {NgModule} from "@angular/core";
import {TestComponent} from "./component/test/test.component";
import {AuthGuard} from "../core/service/auth-guard.service";

const routes: Routes = [
  {
    path: '',
    component: TestComponent,
    canActivate: [AuthGuard]
  },
  {
    path: '**',
    redirectTo: ''
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TestRoutingModule { }
