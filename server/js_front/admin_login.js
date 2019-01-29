$(() => {
    if (typeof ($.cookie('auth_token')) !== 'undefined') {
        $.get({
            url: '/'
        })
    }


    $('#password_submit').click(() => {
        // ($('#password_input').val())
        $.get({
            url: '/submit_admin_password',
            data: {
                password: $('#password_input').val()
            },
            success: (data => {
                const date = new Date();
                const minutes = 15;
                date.setTime(date.getTime() + (minutes * 60 * 1000));
                $.cookie('auth_token', data.token, { expires: date })
                console.log($.cookie('auth_token'))
                location.reload()
            })
        })
    })
})