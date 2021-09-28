$("input[name='searchid']").click(() => {
    $.ajax({
        url: "/searchID",
        type: "GET",
        data: {
            'ID': $("input[name='idcode']").val(),
        },
        success: (res) => {
            $('#kid .block').html(res.status)
        },
        error: (err) => {
            $('#kid .block').html("ID non trovato !")
        }
    })
})