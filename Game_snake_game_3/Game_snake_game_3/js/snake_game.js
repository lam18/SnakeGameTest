
var s;                                     // déclaration de la variable s (snake)
var cote = 10;                             // le snake doit se deplacer dans la grille par bonds de [cote], qui est d'ailleurs le coté du carré.
var f;                                     // la nourriture du Snake
var bouge;
var mange;
var nouveau;

function setup()                           // DESSIN : Tout ce qui est dessin vient ici
{
	canvas = createCanvas(600, 600); // createCanvas(530, 340);        // dimension du canvas
    canvas.position(0.275*windowWidth, windowHeight/10);
    
	bouge = loadSound('../sound/tap1.wav');
	mange = loadSound('../sound/tap3.wav');
    nouveau = loadSound('../sound/tap2.wav');

	s = new Snake();                       //  creation de l'objet Snake dns le dessin
	f = new Food();                        //  creation de l'objet Snake dns le dessin
	frameRate(5);                          // la vitesse du draw(). Tantôt ça allait trop vite.
}

function draw()
{
	background("Green");                   // la couleur d'arrière plan du canvas
	s.update();
	s.show();                              // appel de la méthode d'Affichage
	f.show();                              // appel de la méthode d'Affichage; La mise à jour du Food dependra du déroulement du jeu, et non pas du codeur
	
	if(s.eat(f))                           // On verifie si le Snake mange le Food.
	{
		mange.play();
		f.update();                        // si oui, on met les cooronnées de la nourriture à jour 
		f.show();                          // et la remontre à nouveau de sa nouvele position. 
	}
}

function keyPressed()                      // À partir de ce moment, je peux diriger mon objet avec les fèches de mon CLAVIER
{
	bouge.play();
	if(keyCode === UP_ARROW)                // la fleche du clavier direction HAUT 
	{
		s.dir(0, -1);                       // coordonnées x, y de la direction, n'est rien d'autre que le xspeed, yspeed.
	}else if(keyCode === DOWN_ARROW)        // la fleche du clavier direction BAS 
	{
		s.dir(0, 1);
	}else if(keyCode === RIGHT_ARROW)       // la fleche du clavier direction DROITE 
	{
		s.dir(1, 0);
	}else if(keyCode === LEFT_ARROW)        // la fleche du clavier direction GAUCHE 
	{
		s.dir(-1, 0);
	}
}

/* L'Objet Snake */

function Snake()
{
	this.x = 30;
	this.y = 30;
	this.xspeed = 0;                        // le deplacement du snake sur l'axe des abscisses
	this.yspeed = 0;                        // le deplacement du snake sur l'axe des ordonnées
	this.total_f = 0;                       // nombre de brique additionnelles.
	this.tail = [];                         // le corps du Snake.
	
	this.update = function()
	{
		this.x += this.xspeed * cote;      // de cette façon, la nouvelle longueur est un MULTIPLE du coté
		this.y += this.yspeed * cote;      // de cette façon, la nouvelle longueur est un MULTIPLE du coté
		
		if(this.total_f === this.tail.length)                          // Dans ces conditions il n'a pas mangé de fruit.
		{
			for(var i=0; i<this.tail.length-1; i++)                    // on fera une simple translation des coordonnees des briques du reste du corps
			{
				this.tail[i] = this.tail[i+1];
			}
		}
		this.tail[this.total_f-1] = createVector(this.x, this.y);      // on va positioner la dernière brique quelque par dans le décor.
	}
	this.show = function()
	{
		fill(255);
		
		for(var i=0; i<this.total_f; i++)                             // dessin du reste du corps(tous les petits carrés qui suivent la tete).
		{
			rect(this.tail[i].x, this.tail[i].y, cote, cote);  
		}
		rect(this.x, this.y, cote, cote);                            // dessin du rectangle de tete
	}
	this.dir = function(x, y)                                        // coordonnées x, y de la direction.
	{
		this.xspeed = x;
		this.yspeed = y;
	}
	this.eat = function(Food)
	{
		var d = dist(this.x,this.y, Food.x, Food.y);
		if(d < 1)                                                   // c'est impossible que la position soit exacte au moment de la vérication.
		                                                            // manquer cette partie peut vous faire manquer tout le code.
		{
			this.total_f ++;                                        // il vient de manger un Food. Dès qu'il mange un Food, total_f augmente.
			return true;	
		}else
		{
			return false;
		}
	}
	this.death = function()                                        // à quel moment est-ce que le snake meurt ? 2 conditions
	{
		for(var i=0; i<this.tail.length; i++)                      // 1) soit il se mord
		{
			var position = this.tail[i];
			var d = dist(this.x, this.y, position.x, position.y);
			if(d < 1)                                             // meme principe que tantôt avec le Food
			{
				this.total_f = 0;
				this.tail = [];
			}
		}
	}
}

/* L'Objet Food 

 on sait qu'il y a un facteur de cote(10) dans nos calculs. Donc 600/10 = 60
 donc la valeur maximale d'un objet c'est 60*coté. 
      la valeur minimale             étant 0*coté.
 pour mettre à jour la position du fruit : 
 Math.floor(Math.random() * (max - min + 1) + min);
  
*/
function Food()
{
	this.x = 50;                                                   // coordonnées initiaux de la nourriture
	this.y = 50;
	
	this.update = function()
	{
		this.x = Math.floor(Math.random() * (60 - 0 + 1) + 0) * cote;
		this.y = Math.floor(Math.random() * (60 - 0 + 1) + 0) * cote;
	}
	this.show = function()                                        // affichage de la nourriture
	{
		fill(255, 0, 100);
		rect(this.x, this.y, cote, cote);
	}
}

//=================================================================================

