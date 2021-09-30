$('#activities').change(() => {
    let selected = $(this).find("option:selected").val()
    console.log(selected)
})

$("#kid .searchbtn").click(() => {
    $.ajax({
        url: "/searchUID",
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
                            <option value="" disabled selected hidden>Scegli un'attività</option>
                            <% services.forEach(act => { %>
                                <option value=<%= act.ID %>><%= act.service + ' ' + act.year %></option>
                            <% }) %>
                        </select>
                    </div>
                `;
                $('#kid .block').html(ejs.render(template, {
                    name: res.name,
                    surname: res.surname,
                    services: res.activities
                }))
            } else $('#kid .block').html("<p>Codice identificativo non trovato !</p>")
        },
        error: (err) => {
            $('#kid .block').html("<p>ID non trovato !</p>")
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