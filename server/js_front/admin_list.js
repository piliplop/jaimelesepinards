$(() => {
    $('.submit_change_state').click(function(){
        const new_state = $(this).parent().children('.select_state').val();
        const command_id = $(this).parent().parent().attr('id');
        $.get({
            url: '/change_command_state',
            data: {
                new_state,
                command_id
            },
            success: d => {
                // alert('ok')
            },
            error: e => {
                alert('Echec, réessaie')
            }
        })
    });
});