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
      if($(window).width() >= 888) {
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

  $(".stripe").on("click", function () {
    if ($(window).width() <= 888) {
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
          url: '/addFitness',
          method: 'GET',
          data: data,
          dataType: 'text',
          success: function(result) {
              if(result == 1) {
                  $('.pushups').html(pushups);
                  $('.legraises').html(legraises);
                  $('.pullups').html(pullups);
                  $('.jumps').html(jumps);
                  $('.roundright').html(roundright);
                  $('.roundleft').html(roundleft);
                  $('.roundtime').html(roundtime);
                  $('.stretch').html(stretch + '\"');
                  $('.fitness-edit input').val('');
                  // console.log("Back from the server! Added fitness?");
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
      $.get("/logout", function(data, status) {
        if(data) {
          window.location.href = "/";
        }
      });
  });

  $('#rankSelect').change(function() {
    currentRank = $('#rankSelect').val();
    $.get('/changeCurrentRank/' + currentRank, function(data, status) {
      var curriculumMenu = buildCurriculumMenu(currentRank);
      $('.curriculum-menu').html(curriculumMenu);
      console.log(data);
      var welcomeScreen = buildWelcomeScreen(data[0].rankname);
      $('.curriculum-main').html(welcomeScreen);
      changeColorScheme(data[0]);
    });
  });


});  // End Ready

function getCurriculum(category, rank) {
  $.get("/getCurriculum/" + rank + "/" + category, function(data, status) {
    console.log(data);
    if(typeof data.msg == 'undefined') {
      var curriculum = buildCurriculum(data);
      $(".curriculum-main").html(curriculum);
    } else {
      $(".curriculum-main").html(data.msg);
    }
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

function buildCurriculumMenu(rank) {
  var menu = '<div class="responsive-curriculum-menu">'
            + '<p>Curriculum Categories</p>'
            + '<i class="fa fa-caret-down" aria-hidden="true"></i><i class="fa fa-caret-up" aria-hidden="true"></i>'
            + '</div>'
            + '<div class="white-stripe stripe" onclick="getCurriculum(1,' + currentRank + ')">Basic Techniques</div>'
            + '<div class="yellow-stripe stripe" onclick="getCurriculum(2,' + currentRank + ')">Board Breaking</div>'
            + '<div class="green-stripe stripe" onclick="getCurriculum(3,' + currentRank + ')">Kicks</div>'
            + '<div class="blue-stripe stripe" onclick="getCurriculum(4,' + currentRank + ')">Forms</div>'
            + '<div class="red-stripe stripe" onclick="getCurriculum(5,' + currentRank + ')">Self-Defense</div>'
            + '<div class="black-stripe stripe" onclick="getCurriculum(6,' + currentRank + ')">Sparring</div>';
  return menu;
}

function buildWelcomeScreen(rankname) {
    var welcome = '<h2 class="student-welcome">' + rankname + ' Belt Curriculum</h2>';
    welcome += '<p class="student-welcome">Use the dropdown menu to the right to select a belt and the menu to the left to review the curriculum you will be tested on for your next test.</p>';
    return welcome;
  }

function changeColorScheme(colors) {
  $('.etkd-font').css("color", colors.rankcolor);
  $('nav, .drop-down-menu ul, footer').css("background", colors.rankcolor);
  $('nav, nav a:visited, nav a:hover, nav a:active, nav a, nav span, footer p, footer a, footer a:visited, footer h3').css("color", colors.rankfontcolor);
  $('.curriculum-fitness tr:nth-child(odd)').css("background", colors.fitnesscolor);
  $('.nav-menu-left li:hover, .nav-menu-right li:hover').css("background", colors.navhovercolor);
}

function createEditableFitnessTable(rankId, fitness) {
    var fitnessTable = "<h3 class='student-welcome'>Physical Fitness</h3>";
    fitnessTable += "<p class='student-welcome'>These are your stats from the last physical fitness test.</p>";
    fitnessTable += "<table class='curriculum-fitness student-welcome'>";
    fitnessTable += "<tr>";
    fitnessTable += "<th>Pushups: " + fitness[0]['pushupsstyle'] + "</th>";
    fitnessTable += "<td class='fitness-noedit pushups'>" + fitness[0]['pushups'] + "</td>";
    fitnessTable += "<td class='fitness-edit'><input name='pushups' id='pushups'></td>";
    fitnessTable += "</tr>";
    fitnessTable += "<tr>";
    fitnessTable += "<th>Leg Raises: " + fitness[0]['legraisesstyle'] + "</th>";
    fitnessTable += "<td class='fitness-noedit legraises'>" + fitness[0]['legraises'] + "</td>";
    fitnessTable += "<td class='fitness-edit'><input name='legraises' id='legraises'></td>";
    fitnessTable += " </tr>";
    fitnessTable += "<tr>";
    fitnessTable += "<th>Pullups: " + fitness[0]['pullupsstyle'] + "</th>";
    fitnessTable += "<td class='fitness-noedit pullups'>" + fitness[0]['pullups'] + "</td>";
    fitnessTable += "<td class='fitness-edit'><input name='pullups' id='pullups'></td>";
    fitnessTable += "</tr>";
    fitnessTable += "<tr>";
    fitnessTable += "<th>Jumps: " + fitness[0]['jumpsstyle'] + "</th>";
    fitnessTable += "<td class='fitness-noedit jumps'>" + fitness[0]['jumps'] + "</td>";
    fitnessTable += "<td class='fitness-edit'><input name='jumps' id='jumps'></td>";
    fitnessTable += "</tr>";
    fitnessTable += "<tr>";
    fitnessTable += "<th class='fitness-noedit'>Roundhouse Kicks (<span class='roundtime'>" + fitness[0]['roundtime'] + "</span> per leg)</th>";
    fitnessTable += "<th class='fitness-edit'>Roundhouse Kicks (<input name='roundtime' id='roundtime'> seconds per leg)</th>";
    fitnessTable += "<td class='fitness-noedit'>R-<span class='roundright'>" + fitness[0]['roundright'] + "</span> / L-<span class='roundleft'>" + fitness[0]['roundleft'] + "</span></td>";
    fitnessTable += "<td class='fitness-edit'>R-<input name='roundright' id='roundright'> / L-<input name='roundleft' id='roundleft'></td>";
    fitnessTable += "</tr>";
    fitnessTable += "<tr>";
    fitnessTable += "<th>Stretch Test: " + fitness[0]['stretchstyle'] + "</th>";
    fitnessTable += "<td class='fitness-noedit stretch'>" + fitness[0]['stretch'] + "\"</td>";
    fitnessTable += "<td class='fitness-edit'><input name='stretch' id='stretch'>\"</td>";
    fitnessTable += "</tr>";
    fitnessTable += "</table> ";

    fitnessTable += '<button class="fitness-noedit btn btn-primary student-welcome" id="editFitness">Edit Fitness Stats</button>';
    fitnessTable += '<button class="fitness-edit btn btn-primary student-welcome" id="saveFitness">Save Fitness Stats</button>';
    fitnessTable += '<button class="fitness-edit btn btn-danger student-welcome" id="cancelFitness">Cancel</button>';

    return fitnessTable;
}
