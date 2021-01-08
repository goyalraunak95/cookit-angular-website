import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Params } from '@angular/router';
import { AuthenticationService } from 'src/app/authentication/authentication.service';
import { DataStoreService } from 'src/app/shared/data-store.service';

import { Comment } from '../../comment.model'
import { Recipe } from '../../recipe.model'
import { RecipeService } from '../../recipe.service';
@Component({
  selector: 'app-comment-list',
  templateUrl: './comment-list.component.html',
  styleUrls: ['./comment-list.component.css']
})
export class CommentListComponent implements OnInit {

  comments: Comment[] = []
  @ViewChild('f') slsForm: NgForm;
  commentNum: number;
  recipeDetail: Recipe

  constructor(private dataStoreService: DataStoreService, 
              private recipeService: RecipeService,  
              private route: ActivatedRoute, 
              private authenticationService: AuthenticationService) { }

  ngOnInit(): void {
    this.route.params.subscribe(
      (params: Params) => {
        let id = params['id'];
        this.recipeDetail = this.recipeService.getRecipeByid(id);
        this.comments = this.recipeDetail.comments
        this.commentNum = this.comments.length
      }
    )
    
     this.recipeService.recipeCommentUpdated.subscribe(
       (postedComments: Comment[]) => {
          this.comments = postedComments
          this.commentNum = this.comments.length 
       }
     )
  }
  onSubmit(form: NgForm){
    const value = form.value
    const comment = new Comment('',this.authenticationService.user.name, value.data);
    this.dataStoreService.postComment(comment,this.recipeDetail)
    this.slsForm.reset();
  }

}
