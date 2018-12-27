$(() => {
    $('#submit').click(() => {
        /* $('input').each((index, inp) => {
            console.log(inp);
        }) */
        const inputs = $('input')
        const vals = $('input').map(function(){
            return this.value
        })
        console.log(vals);
    })
})