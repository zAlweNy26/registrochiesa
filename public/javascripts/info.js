getDayInfo = function (date = '##/##/####', info = '', of = true) {
    let template = `
        <div class="popup_content">
            <div>
                <h2><%= title %></h2>
                <a class="icon-btn"><i class="fas fa-times"></i></a>
            </div>
            <p><%= desc %></p>
        </div>
    `
    $('#popup').html(ejs.render(template, {
        title: (of ? 'Comportamento' : 'Programma') + ' del ' + date,
        desc: info
    }))
    $('.overlay').css({opacity: 0, visibility: "visible"}).animate({opacity: 1}, 200)
}

$('.wrapper').on('click', ".popup_content a", () => {
    $(".overlay").animate({opacity: 0}, 200, () => $(".overlay").css({visibility: "hidden"}))
})

$('.wrapper').on('change', '#activities', function() {
    $.ajax({
        url: "/getInfoByUser",
        type: "GET",
        data: {
            'ID': $(this).find("option:selected").val(),
            'isGrest': $(this).find("option:selected").text().includes("Grest")
        },
        async: false,
        success: (res) => {
            if (res.status == 200) {
                let template = `
                    <div id="yearinfo">
                        ${res.companion == null ? '' : '<p><span>Accompagnatore : </span><%= companion %></p>'}
                        ${res.team == null ? '' : '<p><span>Squadra : </span><%= team %></p>'}
                        ${res.leader == null ? '' : '<p><span>Caposquadra : </span><%= leader %></p>'}
                        <div class="searchbox">
                            <input type="text" name="filtertable" placeholder="Cerca nella tabella...">
                        </div>
                    </div>
                    <div id="yeartable">
                        <table>
                            <thead>
                                <tr>
                                    <th>Data</th>
                                    <th>Temperatura</th>
                                    <th>Presente</th> <!-- Mettere spunta con accanto bottone per vedere la motivazione -->
                                    <th>Comportamento</th> <!-- Farlo con i pollici sù e giù -->
                                    <!--<th>Motivo</th>
                                    <th>Programma</th>-->
                                </tr>
                            </thead>
                            <tbody>
                                <% days.forEach(day => { %>
                                    <tr>
                                        <td data-th="Data"><%= day.date %>
                                            <a id="program" class="icon-btn" onclick="getDayInfo('<%= day.date %>', '<%= day.desc %>', false)">
                                                <i class="fas fa-info-circle"></i>
                                            </a>
                                        </td>
                                        <td data-th="Temperatura"><%= day.temp %></td>
                                        <td data-th="Presente"><%= day.presence %></td>
                                        <td data-th="Comportamento"><%= day.action %> 
                                            <a id="reason" class="icon-btn" onclick="getDayInfo('<%= day.date %>', '<%= day.reason %>', true)">
                                                <i class="fas fa-info-circle"></i>
                                            </a>
                                        </td>
                                    </tr>
                                <% }) %>
                            </tbody>
                        </table>
                    </div>
                `
                $('#kid .block #serviceinfo').html(ejs.render(template, {
                    companion: res.companion,
                    team: res.team,
                    leader: res.leader,
                    days: res.days
                }))
            } else $('#kid .block #serviceinfo').html("<p>Non è stato possibile ricavare i dati di questo utente !</p>")
        },
        error: (err) => {
            $('#kid .block #serviceinfo').html("<p>Non è stato possibile ricavare i dati di questo utente !</p>")
        }
    })
    let kidBlocksHeight = 0
    $("#kid .block > *").each(function() { kidBlocksHeight += $(this).outerHeight() })
    $("#kid .block").animate({ height: (kidBlocksHeight + 34) + "px" }, 300)
})

$("#kid .searchbtn").on('click', () => {
    $.ajax({
        url: "/searchUser",
        type: "GET",
        data: {
            'UID': $("input[name='idcode']").val(),
        },
        async: false,
        success: (res) => {
            if (res.status == 200) {
                let template = `
                    <div id="kidinfo">
                        <p><span>Nome : </span><%= name %></p>
                        <p><span>Cognome : </span><%= surname %></p>
                        <select id="activities">
                            <option value="0" disabled selected hidden>Scegli un'attività</option>
                            <% services.forEach(act => { %>
                                <option value=<%= act.ID %>><%= act.service %></option> <!-- aggiungere periodi -->
                            <% }) %>
                        </select>
                    </div>
                    <div id="serviceinfo"></div>
                `
                $('#kid .block').html(ejs.render(template, {
                    name: res.name,
                    surname: res.surname,
                    services: res.activities
                }))
            } else $('#kid .block').html("<p>Non è stato possibile ricavare i dati di questo utente !</p>")
        },
        error: (err) => {
            $('#kid .block').html("<p>Non è stato possibile ricavare i dati di questo utente !</p>")
        }
    })
    $('#kid .mainbar').css({
        'border-bottom-right-radius': '0px',
        'border-bottom-left-radius': '0px'
    })
    let kidBlocksHeight = 0
    $("#kid .block > *").each(function() { kidBlocksHeight += $(this).outerHeight() })
    $("#kid .block").css({
        'padding': '10px',
        'border-width': '2px',
        'border-top': 'none'
    }).animate({ height: (kidBlocksHeight + 24) + "px" }, 300)
})

$("input[name='idcode']").on("keyup", event => { if (event.key == "Enter") $("#kid .searchbtn").trigger("click") })

$('.wrapper').on('keyup', "input[name='filtertable']", function () {
    var value = $(this).val().toLowerCase()
    $("#yeartable table tbody tr").filter(function() {
      $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
    })
})

$('.wrapper').on('change', '#subacts', function() {
    $.ajax({
        url: "/getServiceInfo",
        type: "GET",
        data: {
            'activity': $(this).find("option:selected").text()
        },
        async: false,
        success: (res) => {
            if (res.status == 200) {
                let template = `
                    <div id="actinfo">
                        <div id="periodprice">
                            <p id="period"><span>Periodo : </span><%= begin %> - <%= end %></p>
                            <p id="price"><span>Prezzo : </span><%= price %> €</p>
                        </div>
                        <p id="desc"><span>Descrizione : </span><%= desc %></p>
                        <input class="mini-btn" type="button" value="Preiscrivi">
                    </div>
                `
                $('#activity .block').html(ejs.render(template, {
                    price: res.price,
                    desc: res.desc,
                    begin: res.begin,
                    end: res.end
                }))
            } else $('#activity .block').html("<p>Non è stato possibile ricavare informazioni riguardo questa attività !</p>")
        },
        error: (err) => {
            $('#activity .block').html("<p>Non è stato possibile ricavare informazioni riguardo questa attività !</p>")
        }
    })
    $('#activity .mainbar').css({
        'border-bottom-right-radius': '0px',
        'border-bottom-left-radius': '0px'
    })
    let actBlocksHeight = 0
    $("#activity .block > *").each(function() { actBlocksHeight += $(this).outerHeight() })
    $("#activity .block").css({
        'padding': '10px',
        'border-width': '2px',
        'border-top': 'none'
    }).animate({ height: (actBlocksHeight + 24) + "px" }, 300)
})