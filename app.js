var config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  physics: {
      default: 'arcade',
      arcade: {
          gravity: { y: 300 },
          debug: false
      }
  },
  scene: {
      preload: preload,
      create: create,
      update: update
      // render: render
  }
  };

  var game = new Phaser.Game(config);

  function preload () {
      this.load.audio('atmosphere', ['./assets/audio/Blazing-Stars.mp3']);
      this.load.image('sky', './assets/planet_scenery.jpg');
      this.load.image('ground', './assets/platforms.png');
      this.load.image('star', './assets/crystal.jpg');
      this.load.image('bomb', './assets/bomb.png');
      this.load.spritesheet('dude', './assets/dude.png', { frameWidth: 32, frameHeight: 48 });
  }

  var platforms;
  var player;
  var score = 0;
  var scoreText;
  // var music;


  function create () {

    var pixelWidth = 6;
    var pixelHeight = 6;

    //Background Music

    this.add.image(400, 600, 'sky');

    //Platforms
    platforms = this.physics.add.staticGroup();

    platforms.create(400, 568, 'ground').setScale(2).refreshBody();

    platforms.create(650, 400, 'ground');
    platforms.create(150, 480, 'ground');
    platforms.create(750, 300, 'ground');

    //Player
    player = this.physics.add.sprite(100, 450, 'dude');
    // game.add.sprite(150, 200, 'alien').anchor.y = 1;


    player.setBounce(0.2);
    player.setCollideWorldBounds(true);
    player.body.setGravityY(300)

    //Player Movement
    this.anims.create({
        key: 'left',
        frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'turn',
        frames: [ { key: 'dude', frame: 4 } ],
        frameRate: 20
    });

    this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
        frameRate: 10,
        repeat: -1
    });


    cursors = this.input.keyboard.createCursorKeys();

    //Crystals
    stars = this.physics.add.group({
    key: 'star',
    repeat: 11,
    setXY: { x: 12, y: 0, stepX: 70 }
    });

    stars.children.iterate(function (child) {
      child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
    });

    // this.audio.add('atmosphere').play();

    // music.play();

    scoreText = this.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });

    this.physics.add.collider(player, platforms);
    this.physics.add.collider(stars, platforms);

    this.physics.add.overlap(player, stars, collectStar, null, this);

    bombs = this.physics.add.group();

    this.physics.add.collider(bombs, platforms);

    this.physics.add.collider(player, bombs, hitBomb, null, this);

//Alien Trial
  //   var alien = [
  //   '....44........',
  //   '....44........',
  //   '......5.......',
  //   '......5.......',
  //   '....ABBBBA....',
  //   '...ABBBBBBA...',
  //   '..ABB8228BBA..',
  //   '..BB882288BB..',
  //   '.ABB885588BBA.',
  //   'BBBB885588BBBB',
  //   'BBBB788887BBBB',
  //   '.ABBB7777BBBA.',
  //   '.ABBBBBBBBBBA.',
  //   '.AABBBBBBBBAA.',
  //   '.AAAAAAAAAAAA.',
  //   '.5AAAAAAAAAA5.'
  // ];
  //
  // game.create.texture('alien', alien, pixelWidth, pixelHeight);
  }

  function update () {
    if (cursors.left.isDown) {
      player.setVelocityX(-160);
      player.anims.play('left', true);
    } else if (cursors.right.isDown) {
      player.setVelocityX(160);
      player.anims.play('right', true);
    } else {
      player.setVelocityX(0);
      player.anims.play('turn');
    }
    if (cursors.up.isDown && player.body.touching.down) {
    player.setVelocityY(-430);
    }
  }

//   function render() {
//     game.debug.soundInfo(music, 20, 32);
// }

  function collectStar (player, star) {
    star.disableBody(true, true);
    score += 10;
    scoreText.setText('Score: ' + score);
    if (stars.countActive(true) === 0) {
      stars.children.iterate(function (child) {
        child.enableBody(true, child.x, 0, true, true);
      });
    var x = (player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);
    var bomb = bombs.create(x, 16, 'bomb');
    bomb.setBounce(1);
    bomb.setCollideWorldBounds(true);
    bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
    bomb.allowGravity = false;
    }
  }

  function hitBomb (player, bomb) {
    this.physics.pause();
    player.setTint(0xff0000);
    player.anims.play('turn');
    gameOver = true;
  }


  //Event Listeners
