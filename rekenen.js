Rekenen = {
	maxFoefies : 8,

	maxJaelles : 4,
	
	goedzos : [
		"Wat goed van je!",
		"Prima!",
		"Dat is goed!",
		"Ja, dat is goed!",
		"Super!",
		"Knap van je!",
		"Tjonge, wat goed!",
		"Goed gedaan!",
		"Uitstekend!",
		"Heel mooi!",
		"Netjes hoor, het is goed!",
		"HEEL goed!",
		"Ja hoor, goed zo!",
		"Goed zo!",
		"Dat heb je goed gedaan!",
		"Prima hoor!",
		"Netjes!",
		"Ja! Wat goed van je!"
	],
	
	foutzos : [
		"Jammer, dat is fout.",
		"Nee, dat is niet goed.",
		"Probeer het nog een keer!",
		"Probeer het nog eens!",
		"Jammer, niet goed.",
		"Goed geprobeerd, maar het is fout.",
		"Niet goed helaas.",
		"Dat is niet het antwoord.",
		"Helaas, dat is niet goed.",
		"Jammer genoeg is dat fout.",
		"Nee, dat klopt niet."
	],
	
	main : function() {
		document.getElementById("foefieImg").src = "foefie0"+Math.round(Math.random()*this.maxFoefies)+".jpg";
		document.getElementById("sommen").style.display = "none";
		this.wijzigSoort();
	},

	wijzigSoort : function() {
		var soort = document.getElementById("soort").value;
		document.getElementById("tafelvanp").style.display = "none";
		switch(soort) {
			case 'Tafels':
				document.getElementById("tafelvanp").style.display = "block";
				break;
		}
		this.hideText();
	},

	parseGetal : function(getal) {
		if (!getal.match(/^[\d]+$/)) {
			switch(getal.trim().toLowerCase()) {
				case 'tien':
					getal = 10;
					break;
				case 'negen':
					getal = 9;
					break;
				case 'acht':
					getal = 8;
					break;
				case 'zeven':
					getal = 7;
					break;
				case 'zes':
					getal = 6;
					break;
				case 'vijf':
					getal = 5;
					break;
				case 'vier':
					getal = 4;
					break;
				case 'drie':
					getal = 3;
					break;
				case 'twee':
					getal = 2;
					break;
				case 'een':
					getal = 1;
					break;
				default:
					getal = Math.round(Math.random()*9)+1;
			}
		} 
		return parseInt(getal, 10);
	},

	start : function() {
		this.aantalSommen = this.parseGetal(document.getElementById("aantalsommen").value);
		if (this.aantalSommen < 5) {
			this.displayText("Dat zijn te weinig sommen.", 'messageNeutral');
			return;
		} else {
			this.hideText();
		}
		this.huidigeSom = 0;
		this.aantalFouteAntwoorden = 0;
		this.soort = document.getElementById("soort").value;
		this.starttijd = new Date();
		switch(this.soort) {
			case 'UitkomstMax10':
				this.strategie = StrategieUitkomstMax10;
				break;			
			case 'UitkomstPrecies10':
				this.strategie = StrategieUitkomstPrecies10;
				break;			
			case 'Tafels':
				this.strategie = StrategieTafelsWillekeurigeVolgorde;
				this.strategie.zetTafel(this.parseGetal(document.getElementById("tafelVan").value));
				break;			
			case 'WillekeurigeTafel':
				this.strategie = StrategieTafels;
				this.strategie.zetTafel(Math.round(Math.random()*9)+1);
				break;	
			case 'AftrekkenTotOnderDe10':
				this.strategie = StrategieAftrekkenTotOnderDe10;
				break;	
			case 'StrategieOptellenEnAftrekkenTotEnMet100':
				this.strategie = StrategieOptellenEnAftrekkenTotEnMet100;
				break;	
			case 'KlokkijkenNaarDigitaal':
				this.strategie = StrategieKlokkijkenNaarDigitaal;
				document.getElementById('numericalInput').style.display = 'none';
				this.strategie.init(document.getElementById('variableInput'), document.getElementById('uitkomstId'));
				break;	
			case 'KlokkijkenNaarAnaloog':
				this.strategie = StrategieKlokkijkenNaarAnaloog;
				document.getElementById('numericalInput').style.display = 'none';
				this.strategie.init(document.getElementById('variableInput'), document.getElementById('uitkomstId'));
                break;
			case 'Kies':
				this.displayText("Je moet nog een oefening kiezen.", 'messageNeutral');
				return;
			default:
				alert("onbekende strategie : "+this.soort);
				break;
		}
		document.getElementById("init").style.display = "none";
		document.getElementById("sommen").style.display = "block";
		Rekenen.maakNieuweSom();
	},
	
	maakNieuweSom : function() {
		this.strategie.nieuweSom();
		this.huidigeSom++;
		this.somWasFout = false;
		document.getElementById('nummer').innerHTML = "Som "+this.huidigeSom+".";
		switch(this.strategie.geefInputType()) {
			case 'numerical':
					this.teVerbergenVeld = this.strategie.geefTeVerbergenVeld();
					document.getElementById('som1veld').disabled = true;
					document.getElementById('som2veld').disabled = true;
					document.getElementById('som3veld').disabled = true;
					document.getElementById('som'+this.teVerbergenVeld+'veld').disabled = false;
					document.getElementById('som'+this.teVerbergenVeld+'veld').focus();
					if (this.teVerbergenVeld != 1) {
						document.getElementById('som1veld').value = this.strategie.geefSom1();
					} else {
						document.getElementById('som1veld').value = '';
					}
					document.getElementById('operator').innerHTML = this.strategie.geefOperator();
					if (this.teVerbergenVeld != 2) {
						document.getElementById('som2veld').value = this.strategie.geefSom2();
					} else {
						document.getElementById('som2veld').value = '';
					}
					if (this.teVerbergenVeld != 3) {
						document.getElementById('som3veld').value = this.strategie.geefUitkomst();
					} else {
						document.getElementById('som3veld').value = '';
					}			
				break;
			case 'klokkijken':
				document.getElementById('som3veld').focus();
				this.teVerbergenVeld = 3;
				break;
			default:
				alert("Helaas, dit werkt niet.");
				break;
		}

	},
	
	checkVeldInput : function(event) {
		if (event.keyCode == 13) {
			this.testAntwoord();
		} else {
			switch(this.strategie.geefInputType()) {
				case 'numerical':
					var value = document.getElementById('som'+this.teVerbergenVeld+'veld').value;
					value = value.replace(/[^\d]+/, "");
					document.getElementById('som'+this.teVerbergenVeld+'veld').value = value;
					break;
				case 'klokkijken':
					var value = document.getElementById('som3veld').value;
					value = value.replace(/[^\:\d]+/, "");
					document.getElementById('som3veld').value = value;
					break;
			}
		}
	},
	
	testAntwoord : function() {
		var antwoord = null;
		switch(this.strategie.geefInputType()) {
			case 'numerical':
			var gegevenAntwoord = parseInt(document.getElementById('som'+this.teVerbergenVeld+'veld').value, 10);
			if(!isNaN(gegevenAntwoord)) {
				switch(this.teVerbergenVeld) {
					case 1:
						antwoord = this.strategie.geefSom1();
						break;
					case 2:
						antwoord = this.strategie.geefSom2();
						break;
					case 3:
						antwoord = this.strategie.geefUitkomst();
						break;
					}
				}
			    break;
		    case 'klokkijken':
			    antwoord = this.strategie.geefUitkomst();
			    var splitted = document.getElementById('som3veld').value.split(":");
			    var gegevenAntwoord = parseInt(splitted[0], 10)+':'+parseInt(splitted[1], 10);
			    break;	
		}
		if (gegevenAntwoord == antwoord) {
			if (this.somWasFout) {
				this.aantalFouteAntwoorden++;
			}
			this.displayText(this.goedzos[Math.floor(Math.random()*this.goedzos.length)], 'messageGood');
			document.getElementById('som3veld').value = '';
			this.volgendeSom();
		} else {
			this.somWasFout = true;
			this.displayText(this.foutzos[Math.floor(Math.random()*this.foutzos.length)], 'messageBad');
			document.getElementById('som'+this.teVerbergenVeld+'veld').value = "";
			document.getElementById('som'+this.teVerbergenVeld+'veld').focus();
		}
	},
	
	volgendeSom : function() {
		if (this.huidigeSom < this.aantalSommen) {
			if (this.soort == "WillekeurigeTafel") {
				this.strategie.zetTafel(Math.round(Math.random()*9)+1);
			}
			this.maakNieuweSom();
		} else {
			this.eindtijd = new Date();
			var interval = this.eindtijd - this.starttijd;
			duur = this.berekenDuur(interval);
			fouten = this.berekenFouten();
			var melding = [];
			melding.push("<img src='jaelle0"+Math.round(Math.random()*this.maxJaelles)+".jpg' align=right>");
			melding.push("Gefeliciteerd, je oefening met "+this.aantalSommen+" som"+(this.aantalSommen==1 ? "" : "men")+" is klaar!");
			melding.push("Je was "+duur+" bezig met "+this.strategie.geefOefening()+".");
			if (this.aantalFouteAntwoorden == 0) {
				melding.push("WAUW! NUL FOUTEN, WAT GOED VAN JE!");
			} else if (this.aantalFouteAntwoorden == 1) {
				melding.push("1 fout maar! Geweldig hoor!");
			} else if (this.aantalFouteAntwoorden < 4) {
				melding.push(fouten+" maar! Goed gedaan hoor!");
			} else if (this.aantalFouteAntwoorden < this.aantalSommen/10) {
				melding.push("Goed hoor, maar "+fouten+" van de "+this.aantalSommen+" sommen !");
			} else if (this.aantalFouteAntwoorden < this.aantalSommen/5) {
				melding.push("Dat is best aardig, "+fouten+", maar dat kan iets beter.");
			} else {
				melding.push(fouten+". Nog maar een beetje oefenen...");
			} 
			melding.push("<input type='button' value='Nog een oefening' class='buttonGood' onclick='document.location = document.location;'>")
			document.getElementById("sommen").innerHTML = melding.join("<br>");
			this.hideText();
		}
	},

	berekenFouten : function() {
		return this.aantalFouteAntwoorden+" fout"+(this.aantalFouteAntwoorden==1 ? "" : "en")
	},
	

	berekenDuur : function(interval) {
		var sec = Math.round(interval/1000);
		var minuten = Math.floor(sec/60);
		var seconden = sec % 60;
		var tekst = [];
		if (minuten != 0) {
			tekst.push((seconden == 0 ? "precies " : "") + minuten + " minu" + (minuten == 1 ? "ut" : "ten"));
		}
		if (seconden != 0) {
			tekst.push(seconden + " seconde" + (seconden == 1 ? "" : "n"));
		}
		return tekst.join(", ");
	},
	
	displayText : function(text, className) {
		document.getElementById("message").style.display = "block";
		document.getElementById("message").innerHTML = text;
		document.getElementById("message").className = className;
	},
	
	hideText : function() {
		document.getElementById("message").style.display = "none";
	}

};

StrategieUitkomstMax10 = {

	geefOefening : function() {
		return 'de optel- en aftreksommen tot en met 10';
	},

	geefInputType : function() {
		return 'numerical';
	},
	
	nieuweSom : function() {
		this.operator = Math.random() > 0.5 ? "-" : "+";
		this.teVerbergenVeld = Math.random() > 0.5 ? 1 : 2;
		switch(this.operator) {
			case '+':
				this.uitkomst = Math.round(Math.random()*7)+3;		
				this.som1 = Math.round(Math.random()*(this.uitkomst-1));
				this.som2 = this.uitkomst - this.som1;
				break;
			case '-':
				this.som1 = Math.round(Math.random()*8)+2;
				this.som2 = 99;
				while(this.som2 > this.som1) {
					this.som2 = Math.round(Math.random()*9)+1;	
				}	
				this.uitkomst = this.som1 - this.som2;		
				break;
		}
	},

	geefTeVerbergenVeld : function() {
		return this.teVerbergenVeld;
	},

	geefSom1 : function() {
		return this.som1;
	},

	geefSom2 : function() {
		return this.som2;
	},

	geefOperator : function() {
		return this.operator;
	},
	
	geefUitkomst : function() {
		return this.uitkomst;
	}

}

StrategieUitkomstPrecies10 = {

	geefOefening : function() {
		return 'het optellen- en aftrekken tot 10';
	},

	geefInputType : function() {
		return 'numerical';
	},
		
	nieuweSom : function() {
		this.operator = Math.random() > 0.5 ? "-" : "+";
		this.teVerbergenVeld = Math.random() > 0.5 ? 1 : 2;
		this.uitkomst = 10;		
		switch(this.operator) {
			case '+':
				this.som1 = Math.round(Math.random()*(this.uitkomst-1));
				this.som2 = this.uitkomst - this.som1;
				break;
			case '-':
				this.som2 = Math.round(Math.random()*10);
				this.som1 = this.som2 + this.uitkomst;
				break;
		}
	},

	geefTeVerbergenVeld : function() {
		return this.teVerbergenVeld;
	},

	geefSom1 : function() {
		return this.som1;
	},

	geefSom2 : function() {
		return this.som2;
	},

	geefOperator : function() {
		return this.operator;
	},
	
	geefUitkomst : function() {
		return this.uitkomst;
	}

}


StrategieAftrekkenTotOnderDe10 = {

	geefOefening : function() {
		return 'het aftrekken tot onder de 10';
	},

	geefInputType : function() {
		return 'numerical';
	},
	
	nieuweSom : function() {
		this.operator = "-";
		var r = Math.random();
		this.teVerbergenVeld = r >= 0.66 ? 3 : r >= 0.33 ? 2 : 1;
		this.som1 = Math.round(Math.random()*10)+10;
		this.som2 = Math.round(Math.random()*10);	
		this.uitkomst = this.som1 - this.som2;		
	},

	geefTeVerbergenVeld : function() {
		return this.teVerbergenVeld;
	},

	geefSom1 : function() {
		return this.som1;
	},

	geefSom2 : function() {
		return this.som2;
	},

	geefOperator : function() {
		return this.operator;
	},
	
	geefUitkomst : function() {
		return this.uitkomst;
	}
};

StrategieTafels = {

	geefOefening : function() {
		return 'alle tafels door elkaar';
	},
	
	geefInputType : function() {
		return 'numerical';
	},
	
	zetTafel : function(tafelVan) {
		this.som2 = tafelVan;
	},

	nieuweSom : function() {
		this.operator = "x";
		this.teVerbergenVeld = 3;
		this.som1 = Math.round(Math.random()*9)+1;
		this.uitkomst = this.som1 * this.som2;		
	},

	geefTeVerbergenVeld : function() {
		return this.teVerbergenVeld;
	},

	geefSom1 : function() {
		return this.som1;
	},

	geefSom2 : function() {
		return this.som2;
	},

	geefOperator : function() {
		return this.operator;
	},
	
	geefUitkomst : function() {
		return this.uitkomst;
	}

}

StrategieTafelsWillekeurigeVolgorde = {

	geefOefening : function() {
		return 'de tafel van '+this.som2;
	},
	
	geefInputType : function() {
		return 'numerical';
	},
	
	zetTafel : function(tafelVan) {
		this.som2 = tafelVan;
		this.init();
	},

	init : function() {
		this.sommen = [];
		for(var s=1;s<=10;s++) {
			var rij = {som1 : s, som3 : s * this.som2 };
			this.sommen.push(rij);
		}
		for(var i=0;i<this.sommen.length;i++) {
			var j = Math.floor(Math.random()*this.sommen.length);
			var temp = this.sommen[i];
			this.sommen[i] = this.sommen[j];
			this.sommen[j] = temp;
		}		
		this.current = -1;
	},

	nieuweSom : function() {
		this.current++;
		this.operator = "x";
		this.teVerbergenVeld = 3;
		this.som1 = this.sommen[this.current].som1;
		this.uitkomst = this.sommen[this.current].som3;		
	},

	geefTeVerbergenVeld : function() {
		return this.teVerbergenVeld;
	},

	geefSom1 : function() {
		return this.som1;
	},

	geefSom2 : function() {
		return this.som2;
	},

	geefOperator : function() {
		return this.operator;
	},
	
	geefUitkomst : function() {
		return this.uitkomst;
	}
}

StrategieOptellenEnAftrekkenTotEnMet100 = {
	
	geefOefening : function() {
		return 'de optel- en aftreksommen tot en met 100';
	},
	
	geefInputType : function() {
		return 'numerical';
	},
	
	nieuweSom : function() {
		this.operator = Math.random() > 0.5 ? "-" : "+";
		this.teVerbergenVeld = 3;
		switch(this.operator) {
			case '+':
				this.som1 = Math.round(Math.random()*49)+1;
				this.som2 = Math.round(Math.random()*49)+1;
				this.uitkomst = this.som1+this.som2;		
				break;
			case '-':
				this.som1 = Math.round(Math.random()*99)+1;
				this.uitkomst = 99999;
				while(this.uitkomst >= this.som1) {
					this.uitkomst = Math.round(Math.random()*99);	
				}
				this.som2 = this.som1 - this.uitkomst;
				break;
		}
	},

	geefTeVerbergenVeld : function() {
		return this.teVerbergenVeld;
	},

	geefSom1 : function() {
		return this.som1;
	},

	geefSom2 : function() {
		return this.som2;
	},

	geefOperator : function() {
		return this.operator;
	},
	
	geefUitkomst : function() {
		return this.uitkomst;
	}
};

StrategieKlokkijkenNaarDigitaal = {
	
	geefOefening : function() {
		return 'klokkijken en opschrijven in digitaal';
	},
	
	geefInputType : function() {
		return 'klokkijken';
	},
	
	init : function(targetId, uitkomstId) {
		Clock.init(targetId, uitkomstId);
	},

	nieuweSom : function() {
		this.uren = Math.round(Math.random()*23)
		this.minuten = Math.round(Math.random()*11)*5;
		Clock.setTime(this.uren, this.minuten);
	},
	
	geefUitkomst : function() {
		return this.uren+":"+this.minuten;
	}
};

StrategieKlokkijkenNaarAnaloog = {
	
	geefOefening : function() {
		return 'de digitale tijd aanwijzen op de klok';
	},
	
	geefInputType : function() {
		return 'klokkijken';
	},
	
	init : function(targetId, uitkomstId) {
		Clock.init(targetId, uitkomstId);
        Clock.setEditable(true);
	},

	nieuweSom : function() {
		this.uren = Math.round(Math.random()*24)
		this.minuten = Math.round(Math.random()*11)*5;
		Clock.setTime(this.uren, this.minuten);
	},
	
	geefUitkomst : function() {
		return this.uren+":"+this.minuten;
	}
}

Clock = {

	init : function(targetId, uitkomstId) {
	    var canvas = document.createElement('canvas');
	    canvas.setAttribute('id', 'paintarea');
	    canvas.setAttribute('width', 400);
	    canvas.setAttribute('height', 400);
	    canvas.style.marginLeft = 170;
        canvas.onmousemove = Clock.onMouseMove;
	    uitkomst.style.marginLeft = 330;
	    targetId.appendChild(canvas);
	    var divje = document.createElement('div');
	    divje.setAttribute('id', 'ochtendOfMiddag');
	    divje.setAttribute('width', 500);
	    divje.style.textAlign = 'center';
	    divje.style.marginLeft = -60;
	    targetId.appendChild(divje);
  	    ctx = canvas.getContext("2d");
        _editable = false;
        _hourHand = {'width':12, 'height':0};
        _minuteHand = {'width':0, 'height':0};
        _dragging = false;
	},

    setEditable : function(editable) {
        _editable = editable;
    },

	setTime : function(hour, minute) {
		document.getElementById('ochtendOfMiddag').innerHTML = hour < 6 ? 'nacht' : (hour >= 12 ? (hour >= 18 ? 'avond' : 'middag') : 'ochtend');
		ctx.strokeStyle = "black";
		ctx.fillStyle = '#CCE2F8';
		ctx.lineWidth = 4;
		ctx.beginPath();
		ctx.arc(200, 200, 190, 0, 2 * Math.PI, false);
		ctx.closePath();
		ctx.fill();

		for (var denominator = 1;denominator < 13;denominator++) {
			var points = this.calcDenominatorEndPoint(denominator);
			ctx.moveTo(points.x+200, points.y+200);
			ctx.beginPath();
			ctx.arc(points.x+200, points.y+200, 4, 0, 2 * Math.PI, false);
			ctx.closePath();
			ctx.fillStyle = '#000000';
			ctx.fill();
		}
		ctx.moveTo(200, 200);
		var realHour = hour + (minute/60);
		var points = this.calcHourEndPoint(realHour);
		ctx.lineTo(points.x+200, points.y+200);
		ctx.stroke();
		ctx.closePath();
		var points = this.calcMinuteEndPoint(minute);
		ctx.lineTo(points.x+200, points.y+200);
		ctx.stroke();
		ctx.closePath();
	},

	onMouseMove : function(e) {
	    if(_editable && _dragging) {
            // calculate hand and update
//            console.log(e.pageX+' ;'+e.pageY); //.clientX + '; ' event.clientY);
        }
	},

    onMouseDown : function(e) {
        if(_editable) {
            // decide if cursor is on top of a hand
            // if true, set hand in _dragging
        }
    },

    onMouseUp : function(e) {
        if(_editable) {
           // stop dragging
           // update _hourHand or _minuteHand
        }
    },

	calcHourEndPoint : function(hour) {
		var degrees = ((hour%12)*30 * Math.PI) / 180; 
		var width = Math.sin(degrees)*110;
		var height = Math.cos(degrees)*110*-1;
		return {x:width, y:height};
	},

	calcMinuteEndPoint : function(minute) {
		var degrees = ((minute%60)*6 * Math.PI) / 180;
		var width = Math.sin(degrees)*165;
		var height = Math.cos(degrees)*165*-1;
		return {x:width, y:height};
	},

	calcDenominatorEndPoint : function(denominator) {
		var degrees = ((denominator)*30 * Math.PI) / 180; 
		var width = Math.sin(degrees)*180;
		var height = Math.cos(degrees)*180*-1;
		return {x:width, y:height};
	},

};
