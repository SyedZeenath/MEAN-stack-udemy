//good practice to keep routing in separate class and call it in main module

import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { PostCreateComponent } from "./posts/post-create/post-create.component";
import { PostListComponent } from "./posts/post-list/post-list.component";

const routes: Routes = [
  {path: '', component: PostListComponent }, //path empty means starting page
  {path: 'create', component: PostCreateComponent },  //localhost:4200/create
  {path: 'edit/:postId', component: PostCreateComponent }
]
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule] // to enable to use in module
})

export class AppRoutingModule {}
