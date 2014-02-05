var MailListener = require("mail-listener2");
var cheerio = require('cheerio'); 

var identifiers = new Array(
	"Profesor",
	"Profesores",
	"",
	"CRQ",
	"SPF",
	"Curso Ciudadanía Transversal",
	"Atributo",
	"Planta",
	"Fechas",
	"DLMMJVS",
	"Horario",
	"Edificio",
	"Salón"
);

var mailListener = new MailListener({
  username: "horarios.monterrey@gmail.com",
  password: "8rMy8snOw8E9",
  host: "imap.gmail.com",
  port: 993, // imap port
  tls: true,
  tlsOptions: { rejectUnauthorized: false },
  mailbox: "INBOX", // mailbox to monitor
  markSeen: true, // all fetched email willbe marked as seen and not fetched next time
  fetchUnreadOnStart: true // use it only if you want to get all unread email on lib start. Default is `false`,
});

mailListener.start(); // start listening

// stop listening
//mailListener.stop();

mailListener.on("server:connected", function(){
  console.log("imapConnected");
});

mailListener.on("server:disconnected", function(){
  console.log("imapDisconnected");
});

mailListener.on("error", function(err){
  console.log(err);
});

mailListener.on("mail", function(mail){
  // do something with mail object including attachments
  var subject = mail.subject;
  if(subject.indexOf("Tu horario de clases del periodo")!=-1){
	  console.log("======emailParsed======");
	  $ = cheerio.load(mail.html);

	  //print all <code></code> html tags content in email
	  $( "code" ).each(function() {
		var text = $(this).text().trim();
		if ( !(identifiers.indexOf(text) > -1) ) {
			console.log(text);
			//if it is a number, then its the last field
			if( !isNaN(text) ){
				console.log(""); 	
			}
		}
	  });
  }
  // mail processing code goes here
});


// /*
//  *
//  * Notas: 
//  * En el html estas tags tienen este tipo de contenido
//  * <code> Materia con todo y grupo </code>
//  tambien tiene profesor, fechas, horarios, salon
//  todo viene entre code
//  *
//  *
//  * /
