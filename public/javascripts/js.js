$().ready(function(){
  $("#createAccount").on('click', function(){
    window.location.href = '/createAccount';
  });

  $(".responsive-curriculum-menu").on("click", function () {
      $(".curriculum-menu div:nth-child(n+2)").slideToggle("fast");
      $(".responsive-curriculum-menu .fa-caret-down").toggle("fast");
      $(".responsive-curriculum-menu .fa-caret-up").toggle("fast");
  });
  $(window).resize(function(){
//        console.log($(window).width());
      if($(window).width() >= 873) {
          $(".curriculum-menu div:nth-child(n+2)").css("display", "initial");
          $(".responsive-curriculum-menu .fa-caret-down").css("display", "initial");
          $(".responsive-curriculum-menu .fa-caret-up").css("display", "none");
      } else {
          $(".curriculum-menu div:nth-child(n+2)").css("display", "none");
      }
  });

  $(".belt-select select").on("change", function () {
      window.location = "/dashboard/" + this.value;
  });

  $("stripe").on("click", function () {
      if ($(window).width() <= 540) {
          $(".curriculum-menu div:nth-child(n+2)").slideToggle("fast");
          $(".responsive-curriculum-menu .fa-caret-down").toggle("fast");
          $(".responsive-curriculum-menu .fa-caret-up").toggle("fast");
      }
  });

  $("#editFitness").on('click', function(){
      $('.fitness-edit').show();
      $('.fitness-noedit').hide();
  });

  $("#saveFitness").on('click', function(){
      var pushups = $('#pushups').val();
      var legraises = $('#legraises').val();
      var pullups = $('#pullups').val();
      var jumps = $('#jumps').val();
      var roundright = $('#roundright').val();
      var roundleft = $('#roundleft').val();
      var roundtime = $('#roundtime').val();
      var stretch = $('#stretch').val();
      var data = { pushups, legraises, pullups, jumps, roundright, roundleft, roundtime, stretch };
      console.log(data);
      $.ajax({
          url: 'index.php?action=addFitness',
          method: 'POST',
          data: data,
          dataType: 'text',
          success: function(data) {
              if(data == 1) {
                  $('.pushups').html(pushups);
                  $('.legraises').html(legraises);
                  $('.pullups').html(pullups);
                  $('.jumps').html(jumps);
                  $('.roundright').html(roundright);
                  $('.roundleft').html(roundleft);
                  $('.roundtime').html(roundtime + " seconds");
                  $('.stretch').html(stretch);
              }

              var alert = '<div class="contact-alert alert" role="alert">' + data + '</div>';
              $('body').append(alert).delay(1000);
              $('.contact-alert').addClass('fade').alert('close');

              $('.fitness-edit').hide();
              $('.fitness-noedit').show();
          },
          error: function(xhr, status, error) {
             console.log("error: " + error);
             console.log("xhr: " + JSON.stringify(xhr));
             console.log("status: " + status);
          }
      });
  });

  $("#cancelFitness").on('click', function(){
      $('form').submit(function(e){
          e.preventDefault();
      });
      $('.fitness-edit').hide();
      $('.fitness-noedit').show();
  });

  $('#logout').on('click', function() {
      window.location.href = "/";
  });
});

function getCurriculum(category, currentRank) {
  $.get("/getCurriculum/" + currentRank + "/" + category, function(data, status) {
    console.log(data);
    var curriculum = buildCurriculum(data);
    $(".curriculum-main").html(curriculum);
  });
}

function buildCurriculum(techniques) {
  var curriculumDisplay = "<h3>" + techniques[0].categorykname + "</h3>";
  curriculumDisplay += "<h4>" + techniques[0].categorydesc + "</h4>";
  techniques.forEach(function(technique) {
    curriculumDisplay += "<div class='tech'>";
    if(technique.imgsrc != null) {
      curriculumDisplay += "<div class='media'>";
      curriculumDisplay += "<img src='" + technique.imgsrc + "' alt='" + technique.techniqueename +"' title='" + technique.techniqueename + "'>";
      curriculumDisplay += "</div>";
    }
    curriculumDisplay += "<p class='tech-title'><span class='tech-kname'>" + technique.techniquekname + "</span> &mdash; <span class='tech-ename'>" + technique.techniqueename + "</span></p>";
    curriculumDisplay += "<p class='tech-desc'>" + technique.techniquedesc + "</p>";
    // curriculumDisplay += "<div class='media'>";
    //   videos.forEach(function(video) {
    //     curriculumDisplay += "<article>";
    //     curriculumDisplay += "<video src='video[vidsrc]' style='max-width: video[vidwidth]px; max-height:video[vidheight]px;' preload controls>";
    //     curriculumDisplay += "<p>Sorry! Your browser doesn't support our video.</p></video>";
    //     curriculumDisplay += "<p class='video-title'>video[viddesc]</p>";
    //     curriculumDisplay += "</article>";
    //   });
    // curriculumDisplay += "</div>";
    // curriculumDisplay += "</div>";
  });
  curriculumDisplay += "</div>";
  return curriculumDisplay;
}
