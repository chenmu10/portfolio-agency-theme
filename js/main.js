var gNextId = 1;
var gProjs;

function initPage(params) {
    gProjs = createProjs();
    renderProjItems();
    renderProjModals();
}



function createProjs() {
    var projs = [];
    // createProj(name, title, desc, url, timestamp, labels)
    projs.push(createProj('Sokoban', 'Push boxes to targets', 'Sokoban is a type of transport puzzle, in which the player pushes boxes or crates around in a warehouse, trying to get them to storage locations.', 'img/portfolio/Sokoban.PNG', 1517443200, ["Matrixes", "keyboard events"]));

    projs.push(createProj('MineSweeper', 'Find all mines', 'Minesweeper is a single-player puzzle video game. The objective of the game is to clear a rectangular board containing hidden "mines" or bombs without detonating any of them, with help from clues about the number of neighboring mines in each field.', 'img/portfolio/minesweeper.PNG', 1517443200, ["Matrixes", "keyboard events"]));

    projs.push(createProj('What\'s in the Picture', 'Pick the right answer', '', 'img/portfolio/in-picture.PNG', 1517443200, ["Popup", "Timer"]));
    projs.push(createProj('Touch-Numbers', 'Click numbers in order', 'A simple game for counting up numbers', 'img/portfolio/touch-nums.PNG', 1517443200, ["Popup", "Timer"]));


    return projs;
}



function createProj(name, title, desc, url, timestamp, labels) {
    return {
        "id": gNextId++,
        "name": name,
        "title": title,
        "desc": desc,
        "url": url,
        "publishedAt": timestamp,
        "labels": labels
    }
}


function renderProjItems() {
    var strHtml = '';

    gProjs.forEach(function (proj, i) {
        strHtml += `
        <div class="col-md-4 col-sm-6 portfolio-item">
        <a class="portfolio-link" data-toggle="modal" href="#portfolioModal${i}">
          <div class="portfolio-hover">
            <div class="portfolio-hover-content">
              <i class="fa fa-plus fa-3x"></i>
            </div>
          </div>
          <img class="img-fluid" src="${proj.url}" alt="">
        </a>
        <div class="portfolio-caption">
          <h4>${proj.name}</h4>
          <p class="text-muted">${proj.title}</p>
          <a href="projs/${proj.name}/${proj.name}.html" class="btn btn-primary">Play</a>
        </div>
      </div>
        `;
    });


    // DOM
    var elProjects = document.querySelector('.projects');
    elProjects.innerHTML = strHtml;
    // $('projects').html(strHtml);
}

function renderProjModals() {
    var strHtml = '';

    gProjs.forEach(function (proj, i) {
        strHtml += `

  <div class="portfolio-modal modal fade" id="portfolioModal${i}" tabindex="-1" role="dialog" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="close-modal" data-dismiss="modal">
        <div class="lr">
          <div class="rl"></div>
        </div>
      </div>
      <div class="container">
        <div class="row">
          <div class="col-lg-8 mx-auto">
            <div class="modal-body">
              <!-- Project Details Go Here -->
              <h2>${proj.name}</h2>
              <a href="projs/${proj.name}/${proj.name}.html" class="btn btn-primary">Play</a>
                <p class="item-intro text-muted">${proj.title}</p>
                <p>${proj.desc}</p>
                <ul class="list-inline">
                    <li>Date: <span>${formatDate(proj.publishedAt)}</span></li>
                    <li>Concepts: ${createHtmlLabels(proj.labels)}</span></li>
                </ul>
                <img class="img-fluid d-block mx-auto" src="${proj.url}" alt="">
                <button class="btn btn-primary" data-dismiss="modal" type="button">
          <i class="fa fa-times"></i>
          Close</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
        `;
    });


    // DOM
    var elModals = document.querySelector('.modals-container');
    elModals.innerHTML = strHtml;
    // $('projects').html(strHtml);
   
}


function createHtmlLabels(labels) {
    var strHtml = '';

    labels.forEach(function (label) {
        strHtml += `
          <span class="badge badge-info">${label}</span>
          `;
    });

    return strHtml;
}

function sendEmail() {
    var senderEmail = $('#email').val();
    var subject = $('#subject').val();
    var msg = $('#msg').val();

    window.open('https://mail.google.com/mail/?view=cm&fs=1&to=' + senderEmail + '&su=' + subject + '&body=' + msg + '',
        '_blank');
}

function renderProjsJquery() {
    var elNames = $('div.portfolio-caption > h4');

    elNames.each(function (i) {
        $(this).text(gProjs[i].name);
    });

    var elImgs = $('a.portfolio-link ');

    elImgs.each(function (i) {
        $(this).attr('src', gProjs[i].url);
    });

    var elTitles = $('div.portfolio-caption > p');

    elTitles.each(function (i) {
        $(this).text(gProjs[i].title);
    });

}

function formatDate(timestamp) {
    var date = new Date(timestamp * 1000);

    var monthNames = [
        "January", "February", "March",
        "April", "May", "June", "July",
        "August", "September", "October",
        "November", "December"
    ];

    //var day = date.getDay();
    var monthIndex = date.getMonth();
    var year = date.getFullYear();

    return monthNames[monthIndex] + ' ' + year;
}