// YOUR CODE HERE:

$(document).ready(function() {
  window.app = {};
  baseUrl = 'https://api.parse.com/';

  //Container for messages
  var messContainer = $("#mesList");
  var roomOptionsContainer = $('#roomContainer');


  app.init = function(){
    app.fetch();
    app.autoRefresh();
  }
  app.rooms = {};

  app.createRooms = function(postData) {
    roomOptionsContainer.children().remove();
   for (var i=0; i<postData.length; i++) {
          app.rooms[postData[i].roomname] = "open"
        }
   for (var key in app.rooms) {
     console.log(key);
     var option = $('<option>'+key+'</option>');
     roomOptionsContainer.append(option);
   }
  }

  app.fetch= function(){
 //loading chatterbox messages
   messContainer.children().remove();
   $.ajax({url: baseUrl+'1/classes/chatterbox'
      })
      .done(function(data) {
        var postData = data.results;
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
            post.append('<div class="row"><small class="pull-left" style="margin-left:5px;"><strong>'+_.escape(postData[index].username).trim()+ '</strong>' + ' in ' + _.escape(postData[index].roomname).trim()+ ' on ' + date+'</small></div>')
            post.append('<div class="row"><p class="text-left" style="margin-top: 8px; padding:5px">'+_.escape(postData[index].text).trim()+'</p></div>')
            post.append("</li>")
            messContainer.append(post)
          }//end of check for author and text
        })//each closes
      })//done closes
      .fail(function(error) {
        console.log("error:" + error)
    });
  }

  app.autoRefresh=function() {
    setInterval(app.fetch, 8000);
  }

  app.send = function(e) {

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
          app.load();
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
        //e.preventDefault();
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


 app.init();

})


