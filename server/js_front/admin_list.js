$(() => {
    $('.submit_change_state').click(function () {
        const new_state = $(this).parent().children('.select_state').val();
        const command_id = $(this).parent().parent().attr('id');
        $.get({
            url: '/change_command_state',
            data: {
                new_state,
                command_id
            },
            success: d => {
                updateState(command_id, new_state);
            },
            error: e => {
                alert('Echec, réessaie')
            }
        })
    });

    function updateState(command_id, new_state) {
        const new_string = $(`#${command_id}`).children('.command_state').text().split(' : ')[0] + ' : ' + new_state;
        $(`#${command_id}`).children('.command_state').text(new_string);
    }
});