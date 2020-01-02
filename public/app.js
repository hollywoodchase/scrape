$.getJSON('/all', function(data) {
    console.log(data);
    for (let i = 0; i < data.length; i++) {
        $('#pitchTable').prepend('<tr><td>' + data[i].artist + '</td><td>' + data[i].title + '</td><td><button class="save" data-id=' + data[i]._id + '>Save</button</td><td id="note-zone"><button class="note" data-id=' + data[i]._id + '>Note</button></td></tr>');
    }
});

$(document).on('click', '.save', function() {
    $.ajax({
        type: 'PUT',
        url: '/updatesaved/' + $(this).attr('data-id')
    });
    getSaved()
    console.log('Title: ' + $(this)[0].parentNode.parentNode.firstChild.innerText + ' is saved');
});

$(document).on('click', '.unsave', function() {
    $.ajax({
        type: 'PUT',
        url: '/updateunsaved/' + $(this).attr('data-id')
    });
    $(this).remove;
    getSaved()
    console.log('Title: ' + $(this)[0].parentNode.parentNode.firstChild.innerText + ' is unsaved');
});

$(document).on('click', '.note', function() {
    let nz = this.parentNode;
    this.remove();
    $(nz).html('<input type="text" id="your-note" name="firstname" placeholder="Your Note"><input id="submit-note" type="submit" value="Submit">');
    $('#submit-note').on('click', function() {
        event.preventDefault();
        let yourNote = $('#your-note').val()
        $(nz).empty();
        $(nz).html('<h3>' + yourNote + '</h3>');
    });

});

$(document).on('click', '#saved-articles', function() {
    $.ajax({
        type: 'GET',
        dataType: 'json',
        url: '/saved',
    }).then(function(dbSaved) {
        $('#saved').toggleClass('hidden');
        $('#pitchTable').toggleClass('hidden');
    }).catch(function(err) {
        console.log(err);
    });
    getSaved();
});

function getSaved() {
    $("#saved").empty();
    $.getJSON("/saved", function(data) {
      for (var i = 0; i < data.length; i++) {
        $("#saved").prepend("<tr><td>" + data[i].artist + "</td><td>" + data[i].title +
          "</td><td><button class='unsave' data-id='" + data[i]._id + "'>Unsave</button></td><td><button class='note' data-id=" + data[i]._id + ">Note</button></td></tr>");
      }
    //   $("#saved").prepend("<tr><h2>Saved albums</h2></tr><tr><th>Artist</th><th>Title</th><th>Saved?</th><th>Note?</th></tr>");
    });
  }
  
  getSaved();

