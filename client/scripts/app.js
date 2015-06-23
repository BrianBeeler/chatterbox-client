// YOUR CODE HERE:
$(document).ready(function() {
 var messContainer = $("#mesList");
 var baseUrl = 'https://api.parse.com/';
 loadData();

function loadData(){
 //loading chatterbox messages
   $.ajax({url: baseUrl+'1/classes/chatterbox'
      })
      .done(function(data) {
        //console.log(data.results[12].text)
        $.each(data.results, function(index,value) {
          var postData = data.results;
          if(postData[index].username && postData[index].text && postData[index].roomname) {
            var date = moment(postData.createdAt).format("dddd, MMMM Do YYYY, h:mm:ss a")

            var post = $("<li class='list-group-item'>")
            if (postData[index].roomname === "4chan") {
                post.css({'background-color': '#afd6ab'})
              }
            if (postData[index].roomname === "lobby"){
                post.css({'background-color': '#eadf88'})
            }
            post.append('<small>'+_.escape(postData[index].username)+ ' in ' + _.escape(postData[index].roomname)+'</small>')
            post.append('<small>'+date+'</small>')
            post.append('<p style="padding:5px;" class="">'+_.escape(postData[index].text)+'</p>')
            post.append("</li>")
            messContainer.append(post)

          }//end of check for author and text
        })
      })
      .fail(function(error) {
        console.log("error:" + error)
    });
  }

   //clickhandler for submitting a post

  $('.btn-default').on('click', function(e) {
    e.preventDefault();

    var username = $( "#username" ).val();
    var roomname = $( "#roomname").val();
    var text = $("#text").val();

    var post = {};
    post.username = username;
    post.roomname = roomname;
    post.text = text;
    //post.createdAt = new Date();
    console.log(post)


    $.ajax({
      // This is the url you should use to communicate with the parse API server.
      url: baseUrl+'1/classes/chatterbox',
      type: 'POST',
      data: JSON.stringify(post),
      contentType: 'application/json',
      success: function (data) {
        console.log('chatterbox: Message sent');
      },
      error: function (error) {
        // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('chatterbox: Failed to send message');
      }
    });

  })

  //reloads the messages

  $('.btn-primary').on('click',function(e) {
    e.preventDefault();
    loadData();
  })


})


