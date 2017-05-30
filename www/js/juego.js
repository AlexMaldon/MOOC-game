var app={
  inicio: function(){
    DIAMETRO_BOLA = 50;
    dificultad = 0;
    velocidadX = 0;
    velocidadY = 0;
    puntuacion = 0;
    
    alto  = document.documentElement.clientHeight;
    ancho = document.documentElement.clientWidth;
    
    app.vigilaSensores();
    app.iniciaJuego();
  },

  iniciaJuego: function(){

    function preload() {
      game.physics.startSystem(Phaser.Physics.ARCADE);

      game.stage.backgroundColor = '#f27d0c';
      game.load.image('bola', 'assets/bola.png');   /* a la imagen obtenida de los assets le asignamos nombre 'bola' */
      game.load.image('objetivo', 'assets/objetivo.png');
    }

    function create() {
      scoreText = game.add.text(16, 16, puntuacion, { fontSize: '100px', fill: '#757676' });    /*añade un texto con el score (puntuacion) en pantalla  */
      
      objetivo = game.add.sprite(app.inicioX(), app.inicioY(), 'objetivo'); 
      bola = game.add.sprite(app.inicioX(), app.inicioY(), 'bola');
      
      game.physics.arcade.enable(bola);   /* el motor arcade es el más sencillo para recrear leyes físicas */
      game.physics.arcade.enable(objetivo);

      bola.body.collideWorldBounds = true;  /*detecta la colisión con los bordes de la pantalla */
      bola.body.onWorldBounds = new Phaser.Signal();
      bola.body.onWorldBounds.add(app.decrementaPuntuacion, this);  /*  this=contexto  */
    }

    function update(){
      var factorDificultad = (300 + (dificultad * 100));
      bola.body.velocity.y = (velocidadY * factorDificultad);
      bola.body.velocity.x = (velocidadX * (-1 * factorDificultad));
      
      game.physics.arcade.overlap(bola, objetivo, app.incrementaPuntuacion, null, this);  /* 'overlap' para detectar cuando la bola y el objetivo coinciden  */
    }

    var estados = { preload: preload, create: create, update: update };
    var game = new Phaser.Game(ancho, alto, Phaser.CANVAS, 'phaser',estados);  /* línea import: donde especificamos el ancho, algo. el id 'phaser' del canvas y los estados del juego */
  },

  decrementaPuntuacion: function(){
    puntuacion = puntuacion-1;
    scoreText.text = puntuacion;
  },

  incrementaPuntuacion: function(){
    puntuacion = puntuacion+1;
    scoreText.text = puntuacion;

    objetivo.body.x = app.inicioX();
    objetivo.body.y = app.inicioY();

    if (puntuacion > 0){
      dificultad = dificultad + 1;
    }
  },

  inicioX: function(){            /* iniciamos la bola y el objetivo con la f 'inicio' */
    return app.numeroAleatorioHasta(ancho - DIAMETRO_BOLA );
  },

  inicioY: function(){
    return app.numeroAleatorioHasta(alto - DIAMETRO_BOLA );
  },

  numeroAleatorioHasta: function(limite){   /* con libreria 'math' redondeamos un num aleat * un limite dado, para q no salga de la pantalla*/
    return Math.floor(Math.random() * limite);
  },

  vigilaSensores: function(){
    
    function onError() {
        console.log('onError!');
    }

    function onSuccess(datosAceleracion){
      app.detectaAgitacion(datosAceleracion);
      app.registraDireccion(datosAceleracion);
    }

    navigator.accelerometer.watchAcceleration(onSuccess, onError,{ frequency: 10 });
  },

  detectaAgitacion: function(datosAceleracion){
    var agitacionX = datosAceleracion.x > 10;
    var agitacionY = datosAceleracion.y > 10;

    if (agitacionX || agitacionY){
      setTimeout(app.recomienza, 1000);
    }
  },

  recomienza: function(){
    document.location.reload(true);
  },

  registraDireccion: function(datosAceleracion){
    velocidadX = datosAceleracion.x ;
    velocidadY = datosAceleracion.y ;
  }

};

if ('addEventListener' in document) {
    document.addEventListener('deviceready', function() {
        app.inicio();
    }, false);
}
