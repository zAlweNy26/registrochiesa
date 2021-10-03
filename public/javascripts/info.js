$('.wrapper').on('change', '#activities', function() {
    $.ajax({
        url: "/getServiceInfo",
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
                    <div id="yeartable" class="datatable">
                        <table>
                            <thead>
                                <tr>
                                    <th>Data</th>
                                    <th>Temperatura</th>
                                    <th>Assenze</th> <!-- Mettere spunta con accanto bottone per vedere la motivazione -->
                                    <th>Comportamento</th> <!-- Farlo con i pollici sù e giù -->
                                    <th>Programma</th> <!-- Mettere bottone per vedere il programma -->
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>20/06/2021</td>
                                    <td>36.8</td>
                                    <td>No</td>
                                    <td>Buono</td>
                                    <td>Boh</td>
                                </tr>
                                <tr>
                                    <td>21/06/2021</td>
                                    <td>36.2</td>
                                    <td>Sì</td>
                                    <td>Cattivo</td>
                                    <td>Lol</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                `;
                $('#kid .block #serviceinfo').html(ejs.render(template, {
                    companion: res.companion,
                    team: res.team,
                    leader: res.leader
                }))
            } else $('#kid .block #serviceinfo').html("<p>Non è stato possibile ricavare i dati di questo utente !</p>")
        },
        error: (err) => {
            $('#kid .block #serviceinfo').html("<p>Non è stato possibile ricavare i dati di questo utente !</p>")
        }
    })
    let kidBlocksHeight = 0
    $("#kid .block > *").each(function() { kidBlocksHeight += $(this).outerHeight() })
    $("#kid .block").animate({ height: (kidBlocksHeight + 24) + "px" }, 250)
})

$("#kid .searchbtn").click(() => {
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
                                <option value=<%= act.ID %>><%= act.service + ' ' + act.year %></option>
                            <% }) %>
                        </select>
                    </div>
                    <div id="serviceinfo"></div>
                `;
                $('#kid .block').html(ejs.render(template, {
                    name: res.name,
                    surname: res.surname,
                    services: res.activities
                }))
            } else $('#kid .block').html("<p>Codice identificativo non trovato !</p>")
        },
        error: (err) => {
            $('#kid .block').html("<p>Codice identificativo non trovato !</p>")
        }
    })
    $('#kid .mainbar').css({
        'border-bottom-right-radius': '0px',
        'border-bottom-left-radius': '0px'
    })
    $('#kid .block').css({
        'padding': '10px',
        'border-width': '2px'
    })
    let kidBlocksHeight = 0
    $("#kid .block > *").each(function() { kidBlocksHeight += $(this).outerHeight() })
    $("#kid .block").animate({ height: (kidBlocksHeight + 24) + "px" }, 250)
})

$('.wrapper').on('keyup', "input[name='filtertable']", function () {
    var value = $(this).val().toLowerCase()
    $("#yeartable table tbody tr").filter(function() {
      $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
    })
})