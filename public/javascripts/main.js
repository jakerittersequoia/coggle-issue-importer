/*! coggle-issue-importer 27-11-2014
 Copyright 2014 Coggle, except where noted. License: MIT, except where noted. */
$(document).ready(
  function(){
    function ingestIssuesFor(full_repo_name){
      return $.ajax(
        {
          type:"POST",
          url:"/ingest/issues",
          data:JSON.stringify({full_repo_name:full_repo_name}),
          contentType:"application/json; charset=utf-8",
          dataType:"json"
        }
      )
    }

    function createdButton(url,name){
      return $("<div>",{html:'<a href="'+url+'">Issues for '+name+"</a>"}).addClass("created")
    }

    function displayError(text){$("#error").html($("<div>",{text:text}))}
    function clearError(){$("#error").html("")}

    var spinner='<div class="spinner"> <div class="bounce1"></div> <div class="bounce2"></div> <div class="bounce3"></div> </div>';

    $(".ingestitem").on("click",function(){
      function fail(details){
        displayError(details),$self.find(".spinner").remove(),$self.effect("shake")
      }
      var $self=$(this),repo_name=$self.attr("fullname");
      $self.append($(spinner)),
        ingestIssuesFor(repo_name).fail(
          function(jqXHR,textStatus){fail(textStatus)}
        ).done(function(data){return data.error?fail(data.details):($self.replaceWith(createdButton(data.url,repo_name)),void clearError())}
        )
    }
  ),
  $(".ingestinput").on("keydown",function(e){
    function fail(details){displayError(details),$self.parent().find(".spinner").remove(),$self.effect("shake")}
      var $self=$(this);
      if(13==e.keyCode){
        e.preventDefault(),
        $self.parent().append($(spinner));
        var repo_name=$self.val();
        ingestIssuesFor(repo_name).fail(function(jqXHR,textStatus){fail(textStatus)}
          ).done(function(data){
            return data.error?fail(data.details):(createdButton(data.url,repo_name).insertBefore($self),$self.parent().find(".spinner").remove(),void clearError())
          })
        }
      })
    }
  );
