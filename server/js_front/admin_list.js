$(() => {
    $('.submit_change_state').click(function () {
        const new_state = $(this).parent().children('.select_state').val();
        const current_command_div = $(this).parent().parent();
        const command_id = current_command_div.attr('id');
        const command_email = current_command_div.attr('email');
        const data = {
            new_state,
            command_id,
            command_email
        };

        if(new_state === 'declined'){
            data.reason = $(this).siblings('.state_change_reason').val();
        }

        $.get({
            url: '/change_command_state',
            data,
            success: d => {
                updateState(command_id, new_state);
                alert("La commande a bien été modifiée !");
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

    $('.select_state').change(function () {
        console.log($(this).val())
        if ($(this).val() === 'declined') {
            $(this).siblings('.state_change_reason').css('display', 'inline-block');
        } else {
            $(this).siblings('.state_change_reason').css('display', 'none');
        }
    });
});