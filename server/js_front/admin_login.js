$(() => {
    if(typeof($.cookie('auth_token')) !== 'undefined') {
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
                //todo : limited cookie time
                $.cookie('auth_token', data.token)
                console.log($.cookie('auth_token'))
                location.reload()
            })
        })
    })
})