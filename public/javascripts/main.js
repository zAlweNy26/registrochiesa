$('#theme').click(() => {
    $('.wrapper').toggleClass('lightTheme')
    $('.wrapper').toggleClass('darkTheme')
    $.ajax({
        url: "/switchTheme",
        type: "POST",
        data: {
            'theme': $('.wrapper').hasClass('lightTheme') ? 'lightTheme' : 'darkTheme',
        },
        success: (data) => {}
    })
})