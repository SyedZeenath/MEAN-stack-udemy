import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { Post } from "./post.model";
import { HttpClient } from '@angular/common/http';
import {map} from "rxjs/operators";
import { PortalHostDirective } from "@angular/cdk/portal";
import { Router } from "@angular/router";

@Injectable({providedIn: 'root'})
export class PostService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<Post[]>();

  constructor(private http: HttpClient, private router: Router) {}

  getPosts() {
    // return [...this.posts];
    this.http.get<{message: string, posts: any}>('http://localhost:3000/api/posts')
    .pipe(map((postData) => { //map from rxjs is used to map _id from the db to the id that we want to use
      return postData.posts.map(post => { //map from the js is used here to map the data
        return {
          title: post.title,
          content: post.content,
          id: post._id
        }
      })
    }))
    .subscribe((transformedPosts) => {
      this.posts = transformedPosts;
      this.postsUpdated.next([...this.posts]);
    });
  }

  getPostUpdateListener(){
    return this.postsUpdated.asObservable();
  }

  getPost(id:string) {
    //return {...this.posts.find((p => p.id === id))}; //to return locally
    return this.http.get<{_id;string, title: string, content: string}>("http://localhost:3000/api/posts/"+ id); //get observable and subscribe, to get value in the addpost
  }
  addPost(title:string, content: string) {
    const post: Post = {id: null, title: title, content: content};
    this.http.post<{message: string, postId: string}>('http://localhost:3000/api/posts', post)
    .subscribe((resData) => {
      // console.log(resData.message);
      const id = resData.postId;
      post.id = id;   //though it is const, we just overwriting one item in the object, not the entire object
      this.posts.push(post);
      this.postsUpdated.next([...this.posts]);
      this.router.navigate(["/"]);
    });
  }

  updatePost(id:string, title:string, content: string) {
    const post: Post = {id: id, title: title, content:content};
    this.http.put("http://localhost:3000/api/posts/"+ id, post)
    .subscribe(response => {
      const updatedPosts = [...this.posts];
      const oldPostIndex = updatedPosts.findIndex(p => p.id === post.id);
      updatedPosts[oldPostIndex] = post;  //this will not work unless we have visited post lists page, this is just to keep in mind
      this.posts = updatedPosts;
      this.postsUpdated.next([...this.posts]);
      this.router.navigate(["/"]);
    })
  }

  deletePost(postId: string) {
    this.http.delete("http://localhost:3000/api/posts/" + postId)
    .subscribe(() => {
      // console.log('Deleted!');
      const updatedPosts = this.posts.filter(post => post.id !== postId);
      this.posts = updatedPosts;
      this.postsUpdated.next([...this.posts]);
    })
  }
}
