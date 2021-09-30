$('#activities').change(() => {
    let selected = $(this).find("option:selected").val()
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
                            <% services.forEach(act => { %>
                                <option <% act.year == new Date().getFullYear() ? 'selected' : '' %> value=<%= act.ID %>><%= act.service + ' ' + act.year %></option>
                            <% }) %>
                        </select>
                    </div>
                `;
                console.log(res)
                $('#kid .block').html(ejs.render(template, {
                    name: res.name,
                    surname: res.surname,
                    services: res.activities
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