$(() => {
    function getInputData() {
        let data = {};
        $('select, input, textarea').each(function(i, val) {
            data[val.id] = val.value;
        })
        return data;
    }

    $('#submit').click(() => {
        const data = getInputData();
        console.log(data);
        $.get({
            url: 'http://localhost:3000/submit',
            data,
            success: function(d){
                alert('ok')
            }
        })
    })
})