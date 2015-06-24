// YOUR CODE HERE:

$(document).ready(function() {
  window.app = {};
  baseUrl = 'https://api.parse.com/';

  //Container for messages
  app.$messContainer = $("#mesList");
  app.$roomOptionsContainer = $('#roomContainer');
  app.mostRecentMessage;
  app.$friendsContainer = $('#friends');

  app.init = function(){
    app.fetch();
    app.autoRefresh();
  }

  app.rooms = {};
  app.friends= [];

  app.createRooms = function(postData) {
    app.$roomOptionsContainer.children().remove();
   for (var i=0; i<postData.length; i++) {
         app.rooms[postData[i].roomname] = "open"
        }
   for (var key in app.rooms) {
     console.log(key);
     var option = $('<option value="' + key + '">'+_.escape(key)+'</option>');
     app.$roomOptionsContainer.append(option);
   }
  }

  app.addFriend = function(e) {
    var friend = $(this).text();
    app.$friendsContainer.children().remove();
    app.friends.push(friend);
    app.friends = _.uniq(app.friends);
    $.each(app.friends, function(index,item) {
      var $friendElement = $('<span class="friendItem">'+item+'</span>');
      app.$friendsContainer.append($friendElement)
    })
    e.preventDefault();
  };

  // app.setRoom = function(e){
  //     var room = $( this ).find(":selected").val();
  //      console.log(room);
  //      $( "#roomname" ).val(room);
  //      app.createRoom(room);

  //    };


  app.fetch= function(){
 //loading chatterbox messages
   $.ajax({url: baseUrl+'1/classes/chatterbox'
      })
      .done(function(data) {
        var postData = data.results;
        console.log(app.mostRecentMessage + " " + postData[0].objectId)
       if(app.mostRecentMessage !== postData[0].objectId) {
        app.$messContainer.children().remove();
        app.createRooms(postData)
        postData.splice(20,postData.length);
        $.each(postData, function(index,value) {
          if(postData[index].username && postData[index].text && postData[index].roomname) {
            var date = moment(postData[index].createdAt).format("dddd, MMMM Do YYYY, h:mm:ss a")
            var post = $("<li class='list-group-item animated fadeInUp'>")
            if (postData[index].roomname === "4chan") {
                post.css({'background-color': '#afd6ab'})
              }
            if (postData[index].roomname === "lobby"){
                post.css({'background-color': '#eadf88'})
            }
            post.append('<div class="row"><small class="pull-left" style="margin-left:5px;"><strong class="friendName">'+_.escape(postData[index].username)+ '</strong>' + ' in ' + _.escape(postData[index].roomname)+ ' on ' + date+'</small></div>')
            post.append('<div class="row"><p class="text-left" style="margin-top: 8px; padding:5px">'+_.escape(postData[index].text)+'</p></div>')
            post.append("</li>")
            if (app.checkForFriends(postData[index].username)) {
              console.log("should add css");
              post.css("color","red");
            }
            app.$messContainer.append(post);
          }//end of check for author and text
        })//each closes
        }//if to check for data change
        app.mostRecentMessage = data.results[0].objectId;
      })//done closes
      .fail(function(error) {
        console.log("error:" + error)
    });
  }

  app.autoRefresh=function() {
    setInterval(app.fetch, 8000);
  }

  app.checkForFriends = function(name){
    console.log("looking for " + name + " in " + app.friends)
   if (app.friends.indexOf(name) > -1) {
     return true;
   }
  }

  app.send = function(e) {
      e.preventDefault();
      var username = $( "#username" ).val();
      var roomname = $( "#roomname" ).val();
      var text = $( "#text" ).val();

      var post = {};
      post.username = username;
      post.roomname = roomname;
      post.text = text;
      console.log(post)

      $.ajax({
        url: baseUrl+'1/classes/chatterbox',
        type: 'POST',
        data: JSON.stringify(post),
        contentType: 'application/json',
        success: function (data) {
          app.fetch();
          console.log('chatterbox: Message sent');
          $( "#username" ).val("");
          $( "#roomname" ).val("");
          $( "#text" ).val("");
        },
        error: function (error) {
          // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
          console.error('chatterbox: Failed to send message');
        }
      })
     };
     app.roomFilter = function(postData, room) {
       var filtered = []
       for (var i = 0 ; i<postData.length; i++) {
           if (postData[i].roomname === room) {
             filtered.push(postData[i]);
           }
       }
       return filtered;
     };

     app.createRoom =function(room) {
       $.ajax({url: baseUrl+'1/classes/chatterbox' })
        .done(function(data) {
          var postData = data.results;
          //console.log(app.mostRecentMessage + " " + postData[0].objectId)
          // if(app.mostRecentMessage !== postData[0].objectId) {
            $roomMessages = $('#roomMessages');
            $roomMessages.children().remove();
            var filtered = app.roomFilter(postData,room);
            $.each(filtered, function(index,value) {
              if(filtered[index].username && filtered[index].text && filtered[index].roomname) {
                var date = moment(filtered[index].createdAt).format("dddd, MMMM Do YYYY, h:mm:ss a")
                var post = $("<li class='list-group-item animated fadeInDown' style='background-color:hotpink'>")

                post.append('<div class="row"><small class="pull-left" style="margin-left:5px;"><strong>'+_.escape(filtered[index].username)+ '</strong>' + ' in ' + _.escape(filtered[index].roomname)+ ' on ' + date+'</small></div>')
                post.append('<div class="row"><p class="text-left" style="margin-top: 8px; padding:5px">'+_.escape(filtered[index].text)+'</p></div>')
                post.append("</li>")
                $roomMessages.append(post);
            }//end of check for author and text
          })//each closes
          // }//if to check for data change
        //app.mostRecentMessage = data.results[0].objectId;
      })//done closes
      .fail(function(error) {
        console.log("error:" + error)
    });

     }

     app.setRoom = function(e){
       var room = $( this ).find(":selected").val();
       console.log(room);
       $( "#roomname" ).val(room);
       app.createRoom(room);

     };

     app.reload = function(e) {
      app.fetch();

      e.preventDefault();
     }
 // clickHandlers
  //submitting a post
  $( '.btn-success' ).on( 'click', app.send );
  // reloading messages
  $( '.btn-primary' ).on( 'click', app.reload );

  $( '#roomContainer').on("change", app.setRoom );

  $( '#mesList').on("click","strong", app.addFriend );


 app.init();

})


