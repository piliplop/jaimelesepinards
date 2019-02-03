$(() => {
    $('.submit_change_state').click(function () {
        const qg = $('#select_qg').val()
        const new_state = $(this).parent().children('.select_state').val();
        const current_command_div = $(this).parent().parent();
        const command_id = current_command_div.attr('id');
        const command_email = current_command_div.attr('email');
        const data = {
            new_state,
            command_id,
            command_email,
            qg,
        };

        const div_parent = $(this).parent().parent();
        div_parent.removeClass().attr('class', 'command ' + new_state);
        show_hide_archived(hide_archived)


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

    $('.submit_assign_to').click(function() {
        const email = $(this).siblings('.assign_to').val();
        const id = $(this).parent().parent().attr('id')
        $.get({
            url: '/assign_task_to',
            data: {
                email,
                id,
            }
        })
    })

    $('#toggle_ptitdej').click(function() {
        $('.Petit').parent().slideToggle();
    })

    let hide_archived = false;
    function show_hide_archived(hide_archived){
        if(hide_archived){
            $('.command.archived, .command.declined').css('display', 'none');
            $('#toggle_archived, .command.declined').val("Afficher les koh'mmandes archivées ou refusées")
        }else{
            $('.command.archived, .command.declined').css('display', 'block');
            $('#toggle_archived, .command.declined').val("Cacher les koh'mmandes archivées ou refusées")
        }
        // $('.command.archived, .command.declined').slideToggle();
    }

    $('#toggle_archived').click(function() {
        hide_archived = !hide_archived;
        show_hide_archived(hide_archived);
    });

    $('#toggle_archived').click();

    function updateState(command_id, new_state) {
        // alert(new_state)
        const new_string = 'Etat de la commande : ' + new_state;
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