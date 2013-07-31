//invocando o email composer, como o nome sugere criar um email através de cards 

detailsEmail = {
    subject: "Assunto do email",
    body: "Corpo do email",
    to: ["a@a.ca", "b@b.com"],
    cc: ["c@c.ca, d@d.com"]
}

blackberry.invoke.card.invokeEmailComposer(detailsEmail, 

//função dispara quando ocorreu tudo bem com a utilização do card
function (done) {
    console.log(done);
},

//função disparada caso a ação seja cancelada
 function (cancel) {
    console.log(cancel)
},

//função disparada caso ocorra um erro com o card
function (invokeError) {
    console.log(invokeError);
});
