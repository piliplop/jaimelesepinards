$(() => {
    //to delete all tracking cookie if needed
    initPage()

    function initPage() {
        // $.removeCookie('command_tokens')
        console.log(new URL(window.location.href).searchParams.get('add_sos'));

        initMaterialize();
        updateTrackLinks();

        const new_sos_id = new URL(window.location.href).searchParams.get('add_sos');
        if (new_sos_id) {
            addToListedCommands(new_sos_id, true);
        }
        updateTrackLinks();
    }

    function initMaterialize() {
        $(document).ready(() => {
            $('.sidenav').sidenav();
            $('select').formSelect();
        });
    }

    function getInputData() {
        let data = {};
        $('select, input, textarea').each(function (i, val) {
            data[val.id] = val.value;
        })
        return data;
    }

    function updateTrackLinks() {
        $('#tracking_links').children().remove()
        $('#tracking_informations').children().remove()
        $('.header').children('#track_links_title').remove()
        if (typeof ($.cookie('command_tokens')) === 'undefined') return;

        $('.header').prepend(
            $('<h1></h1>')
                .text('Suivi de commandes :')
                .attr('id', 'track_links_title')
        )

        JSON.parse($.cookie('command_tokens')).tokens.forEach(v => {
            console.log(v)
            $('#tracking_links')
                .append($('<div></div')
                    .attr('class', 'sos_link')
                    .append(
                        $('<a></a>')
                            .attr('id', v.id)
                            .attr('class', 'tracking_link')
                            .text(v.sos_type)
                            // .attr('href', '/pages/suivi/' + v.id)
                            .click(function () {
                                // update each other link's state
                                if (typeof (this.already_shown) === 'undefined') this.already_shown = false
                                $(this).siblings().each(function () {
                                    this.already_shown = false;
                                })
                                // if the details aren't shown, show them
                                if (!this.already_shown) {
                                    $.get({
                                        url: '/pages/suivi/' + v.id,
                                        success: d => {
                                            // remove spaces then capture the body tag
                                            $('#tracking_informations').html(d.replace(/(\r\n\t|\n|\r\t)/gm, "").match(/<body>.*<\/body>/)[0])
                                            this.already_shown = true
                                            console.log(v);
                                            $('#tracking_informations').append(
                                                $('<div></div>')
                                                    .append(
                                                        $('<input>')
                                                            .attr('type', 'button')
                                                            .val('Ne plus voir cette commande')
                                                            .click(() => {
                                                                // remove the cookie
                                                                command_tokens = JSON.parse($.cookie('command_tokens'));
                                                                for (let i = 0; i < command_tokens.tokens.length; i++) {
                                                                    if (command_tokens.tokens[i].id === v.id) {
                                                                        command_tokens.tokens.splice(i, 1)
                                                                    }
                                                                }
                                                                command_tokens = JSON.stringify(command_tokens);
                                                                $.cookie('command_tokens', command_tokens);

                                                                // update shown links
                                                                updateTrackLinks()
                                                            })
                                                    )
                                            )
                                        },
                                        error: err => {
                                            $('#tracking_informations').append(
                                                $('<div></div>')
                                                    .append(
                                                        $('<p></p>')
                                                            .text("Commande non trouvée, peut-être qu'elle n'existe plus")
                                                    )
                                                    .append(
                                                        $('<input>')
                                                            .attr('type', 'button')
                                                            .val('Supprimer')
                                                            .click(() => {
                                                                // remove the cookie
                                                                command_tokens = JSON.parse($.cookie('command_tokens'));
                                                                for (let i = 0; i < command_tokens.tokens.length; i++) {
                                                                    if (command_tokens.tokens[i].id === v.id) {
                                                                        command_tokens.tokens.splice(i, 1)
                                                                    }
                                                                }
                                                                command_tokens = JSON.stringify(command_tokens);
                                                                $.cookie('command_tokens', command_tokens);

                                                                // update shown links
                                                                updateTrackLinks()
                                                            })
                                                    )
                                            )
                                        }
                                    })
                                    this.already_shown = true
                                    // if the details are already shown, hide them
                                } else {
                                    $('#tracking_informations').children().remove();
                                    this.already_shown = false;
                                }
                            })
                    ))
        });
    }

    $('.toggle_sos_list').click(function () {
        const sos_displayed = $('#sos_list_div').css('display') === 'none' ? false : true;
        if (sos_displayed) {
            $('#sos_list_div').css('display', 'none');
        } else {
            $('#sos_list_div').css('display', 'inline-block');
            //download the img
            if($('#sos_list_div').children().length === 0){
            $('#sos_list_div')
                .append($('<img>')
                    .attr('src', '/images/tapir.jpg'));
            }

        }
    });

    $('#submit_div').click(() => {
        // alert('u')
        const captcha_response = grecaptcha.getResponse()
        const data = {
            ...getInputData(),
            captcha_response,
        };

        // console.log(data);
        $.get({
            url: '/submit_command',
            data,
            success: function (d) {
                console.log(d.captcha_failed);
                if (d.captcha_failed === false || d.captcha_failed === undefined) {
                    if (d.missing) {
                        // TODO: show missing required fields
                        alert('Tu as oublié des champs requis');
                    } else if (d.wrong_inputs) {
                        //TODO: show wrong fields
                        alert("Tu t'es trompé sur le format de certaines de tes entrées")
                    } else {
                        grecaptcha.reset();
                        // alert(`l'id de ta commande est : ${d.id}`)
                        let command_tokens = $.cookie('command_tokens');
                        // console.log(typeof(command_tokens) === 'undefined')
                        // console.log(JSON.stringify(JSON.parse(command_tokens).tokens.push(d.id)))
                        if (typeof (command_tokens) === 'undefined') {
                            $.cookie('command_tokens', JSON.stringify({ tokens: [{ id: d.id, sos_type: data.sos_choice }] }))
                        }
                        else {
                            command_tokens = JSON.parse(command_tokens);
                            command_tokens.tokens.push({ id: d.id, sos_type: data.sos_choice });
                            command_tokens = JSON.stringify(command_tokens);
                            $.cookie('command_tokens', command_tokens);
                        }
                        updateTrackLinks();
                        if (data.email_choice !== '') {
                            alert('Ton SOS est en attente d\'acceptation\non t\'a envoyé un mail au cas ou tu ne le voies plus sur cette page');
                        } else {
                            // alert('Ton SOS est en attente d\'acceptation');
                        }
                    }
                } else {
                    alert("Tu n'as pas correctement rempli le captcha")
                }
            }
        })
        // });
        // });

    });

    $('#submit_command_id').click(() => {
        const new_id = $('#input_command_id').val();
        addToListedCommands(new_id);
    });

    function addToListedCommands(new_id, reload_page = false) {
        let command_tokens = $.cookie('command_tokens');
        let already_shown = false;
        if (typeof (command_tokens) !== 'undefined') {
            JSON.parse(command_tokens).tokens.forEach(v => {
                if (v.id === new_id)
                    already_shown = true;
            });
        }
        // console.log($('#input_command_id').val())
        if (!already_shown) {
            $.get({
                url: '/get_command',
                data: {
                    id: new_id
                },
                success: d => {
                    if (typeof (command_tokens) === 'undefined') {
                        $.cookie('command_tokens', JSON.stringify({ tokens: [{ id: d.id, sos_type: d.sos_type }] }));
                    }
                    else {
                        command_tokens = JSON.parse(command_tokens);
                        command_tokens.tokens.push({ id: d.id, sos_type: d.sos_type });
                        command_tokens = JSON.stringify(command_tokens);
                        $.cookie('command_tokens', command_tokens);
                    }
                    updateTrackLinks();
                    if (reload_page) {
                        // window.location.replace('/');
                        // window.history.pushState({}, "", "/pages/commande");
                    }
                    // console.log($('#'+new_id))
                }
            });
        }
        else {
            alert('Cette commande est déjà listée');
        }
        window.history.pushState({}, "", "/pages/commande");
        $('#' + new_id).click();
    }

    // function requiredInputsFilled() {
    //     // console.log(Object.keys($('.required')))
    //     let all_filled = true;
    //     $('.required').each(function () {
    //         if($(this).val() === '') all_filled = false;
    //     })
    //     return all_filled;
    // }

});

