$("input[name='searchid']").click(() => {
    $.ajax({
        url: "/searchID",
        type: "GET",
        data: {
            'ID': $("input[name='idcode']").val(),
        },
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
})