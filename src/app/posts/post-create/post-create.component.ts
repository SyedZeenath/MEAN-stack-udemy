import { Component, Output, EventEmitter, OnInit } from "@angular/core";
import { NgForm } from "@angular/forms";
import { ActivatedRoute, ParamMap } from "@angular/router";
import { Post } from "../post.model";
import { PostService } from "../post.service";

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ["./post-create.component.css"]
})
export class PostCreateComponent implements OnInit {
  enteredTitle = '';
  enteredPost = '';
  private mode = 'create';
  private postId: string;
  post: Post;
  isLoading =false;

  constructor(public postsService: PostService, public route: ActivatedRoute) {

  }
ngOnInit() {
  //observable that can be subscribed; can listen to changes in the route url parameter
  this.route.paramMap.subscribe((paramMap: ParamMap) => {
    if(paramMap.has('postId')){    //postId defined in the app-routing file
      this.mode = 'edit';
      this.postId = paramMap.get('postId');
      this.isLoading = true;
      //this.post = this.postsService.getPost(this.postId);
      this.postsService.getPost(this.postId).subscribe(postData => {
        this.isLoading = false;
        this.post = {id: postData._id, title: postData.title, content: postData.content};
      });
    }
    else{
      this.mode = 'create';
      this.postId = null;
    }
  });
}
  onAddPost(form: NgForm){
    if(form.invalid) {
      return;
    }
    this.isLoading = true;
    //basic form of adding
    // const post: Post = {
    //   title: form.value.title,
    //   content: form.value.content
    // };
    // this.postCreated.emit(post);

    //using a service
    if(this.mode === 'create') {
      this.postsService.addPost(form.value.title, form.value.content);
    }else{
      this.postsService.updatePost(this.postId, form.value.title, form.value.content);
    }

    form.resetForm();
  }
}
