$("#kid .searchbtn").click(() => {
    $.ajax({
        url: "/searchID",
        type: "GET",
        data: {
            'ID': $("input[name='idcode']").val(),
        },
        async: false,
        success: (res) => {
            if (res.status == 200) {
                let template = `
                    <div class="maininfos">
                        <p><span>Nome : </span><%= name %></p>
                        <p><span>Cognome : </span><%= surname %></p>
                        <p><span>Accompagnatore : </span><%= companion %></p>
                        <p><span>Anno : </span><%= year %></p>
                        <p><span>Attività : </span><%= activity %></p>
                        ${res.team == "Nessuna" ? '' : '<p><span>Squadra : </span><%= team %></p>'}
                    </div>
                `;
                $('#kid .block').html(ejs.render(template, {
                    name: res.name,
                    surname: res.surname,
                    companion: res.companion,
                    year: res.year,
                    activity: res.activity,
                    team: res.team
                }))
            } else $('#kid .block').html("Codice identificativo non trovato !")
        },
        error: (err) => {
            $('#kid .block').html("ID non trovato !")
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
    $("#kid .block > div").each(function() { kidBlocksHeight += $(this).outerHeight() })
    $("#kid .block").animate({ height: (kidBlocksHeight + 24) + "px" }, 250)
})