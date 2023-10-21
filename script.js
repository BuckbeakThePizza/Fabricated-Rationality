var player, platforms, cursors, score = 0, scoreText;
var acceleration = 600, jumpVelocity = -700;
var jumping = false;
var doubleJump = false;
var wasStanding = false, edgeTimer = 0;
var spikes;
var camera, hud;
var cameraAcceleration = 1.0003, cameraVelocity = 0.5;
var bg, bg2;
var fakePlatforms, kindOfFakePlatforms
var feathers
var startTint
var wasPressed = false, wasStomping;
var keyQ, keyS, keyW
var music = false;
var lastScore = 0, highScore = 0

if(localStorage.getItem("hs")) {
  highScore = localStorage.getItem("hs")
}

var letters = [
  {img: "T_03.png", key: "L1"},
  {img: "T_04.png", key: "L2"},
  {img: "T_06.gif", key: "L3"},
  {img: "T_08.gif", key: "L4"},
  {img: "T_10.gif", key: "L5"},
  {img: "T_12.gif", key: "L6"},
  {img: "T_13.gif", key: "L7"},
  {img: "T_14.gif", key: "L8"},
  {img: "T_15.gif", key: "L9"},
  {img: "T_17.gif", key: "L10"},
  {img: "T_25.gif", key: "L11"},
  {img: "T_26.gif", key: "L12"},
  {img: "T_27.gif", key: "L13"},
  {img: "T_28.gif", key: "L14"},
  {img: "T_29.gif", key: "L15"},
  {img: "T_31.gif", key: "L16"},
  {img: "T_32.gif", key: "L17"},
  {img: "T_33.gif", key: "L18"},
  {img: "T_34.gif", key: "L19"},
  {img: "T_35.gif", key: "L20"},
  {img: "T_36.png", key: "L21"},

]

var scale = 4/5

var platformConfig = [
  {
  img: "platform1x2",
  url: "Platform1x2.png",
  width: scale,
  height: scale*2
  },
  {
    img: "platform2x1",
    url: "Platform2x1.png",
    width: scale*2,
    height: scale
  },
  {
    img: "platform3x1",
    url: "Platform3x1.png",
    width: scale*3,
    height: scale
  },
  {
    img: "platform4x1",
    url: "Platform4x1.png",
    width: scale*4,
    height: scale
  },
  {
    img: "platform4x1",
    url: "Platform4x1.png",
    width: scale*4,
    height: scale
  },
  {
    img: "platform4x1",
    url: "Platform4x1.png",
    width: scale*4,
    height: scale
  },
  {
    img: "platform5x1",
    url: "Platform5x1.png",
    width: scale*5,
    height: scale
  },
]

var bird, button, galaxy, trees, credit, title

class ClickScreen extends Phaser.Scene
  {
    constructor() {
      super("init")
    }
    preload() {
      
    }
    startMenu() {
      this.scale.startFullscreen();
      this.scene.start("menu")
    }
    create() {
      this.add.text(config.width/2, config.height/2, "Click!", { fontSize: '50px', fill: '#fff' })
      this.input.on("pointerdown", this.startMenu, this)
    }
    update() {
      
    }
  }

class Menu extends Phaser.Scene
  {
    constructor() {
      super("menu")
    }
    moveBird(bird)
    {
      var x = bird.body.x
      var y = bird.body.y
      var height = bird.body.height
      var width = bird.body.width
      var rand = Math.random();
      bird.angle = (bird.body.velocity.x + bird.body.velocity.y) / 100
      if(rand < 0.8) {
        bird.setVelocityX(bird.body.velocity.x + Math.random()*2-1)
        bird.setVelocityY(bird.body.velocity.y + Math.random()*2-1)
      }
      if(y>config.height-height || y < 0) {
        bird.setVelocityY(-bird.body.velocity.y)
        if(y>config.height - height) {
          y = config.height-height
        }
        else {
          y = 0
        }
      }
      if(x>config.width - width || x < 0) {
        bird.setVelocityX(-bird.body.velocity.x)
        if(x>config.width-width) {
          x = config.width-width
        }
        else {
          x = 0
        }
      }
    }
    hover(event) {
      button.anims.play("hover")
    }
    unHover(event) {
      button.anims.play("normal")
    }
    click(event) {
      button.anims.play("click")
      this.sound.play("select")
      this.scene.start("game")
    }
    initFloaty(bird)
    {
      bird.body.allowGravity = false;
      bird.setVelocityX(bird.body.velocity.x + Math.random()*2-1)
      bird.setVelocityY(bird.body.velocity.y + Math.random()*2-1)
      bird.setOrigin(0, 0)
    }
    createAnim(animKey, spriteKey, frames) {
      if(!this.anims.exists(animKey))
      {
        this.anims.create({key: animKey, frames: this.anims.generateFrameNumbers(spriteKey, {frames: frames}), repeat: -1, frameRate: 8})
      }
    }
    preload() {
      this.load.setBaseURL("assets/")
      this.load.spritesheet("buttons", "Buttons.png", {frameWidth: 500, frameHeight: 200})
      this.load.image("bird", "bird.png")
      this.load.image("bg", "Galaxy.png")
      this.load.image("foreground", "Foreground2.png")
      this.load.audio("music", ["dream-aeterna.mp3"])
      this.load.audio("select", ["SFX/Wrong 3.wav"])
      for(var i = 0; i < letters.length; i++) {
        this.load.image(letters[i].key, "images/"+letters[i].img)
      }
    }
    create() {
      if(!music) music = this.sound.play("music", {volume: 0.5, loop: true})
      galaxy = this.add.tileSprite(config.width/2, config.height/2, 1920, 1080, "bg")
      trees = this.add.tileSprite(config.width/2, config.height, 1950, 1080, "foreground")
      trees.tint = 0x2e2e2e
      title = this.add.group()
      var startX = 300
      var startY = 200
      var spread = 60*2
      for(var i = 0; i < 10; i++) {
        var l = this.physics.add.sprite(spread*i + startX, startY, letters[i].key)
        l.setScale(2)
        this.initFloaty(l)
        title.add(l)
      }
      for(var i = 10; i < letters.length; i++) {
        var l = this.physics.add.sprite(spread*(i-10) + startX, spread + startY, letters[i].key)
        l.setScale(2)
        this.initFloaty(l)
        title.add(l)
      }
      button = this.physics.add.sprite(1200, 600, "buttons")
      bird = this.physics.add.sprite(600-250, 600-250, "bird")
      credit = this.add.text(16, config.height - 106, "Music: Dream Aeterna by Shane Ivers\nhttps://www.silvermansound.com", { fontSize: '50px', fill: '#fff' })
      this.add.text(config.width - 600, 16, "Last Score: " + parseFloat(lastScore).toFixed(2), { fontSize: '50px', fill: '#fff' })
      this.add.text(config.width - 600, 86, "High Score: " + parseFloat(highScore).toFixed(2), { fontSize: '50px', fill: '#fff' })
      this.initFloaty(bird)
      this.initFloaty(button)
      bird.body.setSize(200, 350).setOffset(150, 150)
      button.setInteractive()
      this.physics.add.collider(bird, button)
      this.physics.add.collider(title, bird)
      this.physics.add.collider(title, button)
      this.physics.add.collider(title, title)
      this.createAnim("hover", "buttons", [2])
      this.createAnim("normal", "buttons", [0])
      this.createAnim("click", "buttons", [1])
      button.on('pointerover', this.hover)
      button.on('pointerout', this.unHover)
      button.on("pointerdown", this.click, this)
    }
    update() {
      this.moveBird(bird)
      this.moveBird(button)
      title.children.each(this.moveBird)
      galaxy.tilePositionX += 0.1
      trees.tilePositionX += 0.2
      trees.angle = Math.sin(trees.tilePositionX/180)*5
      //this.scene.start("game")
    }
  }

class Game extends Phaser.Scene
  {
    constructor()
    {
      super("game")
    }
    movePlatform(platform)
    {
      var rand = Math.random();
      if(rand < 0.8) {
        platform.setVelocityX(platform.body.velocity.x + Math.random()*2-1)
        platform.setVelocityY(platform.body.velocity.y + Math.random()*2-1)
      }
    }
    preload() {
      this.load.setBaseURL("assets/")
      for(var i = 0; i < platformConfig.length; i++) {
        this.load.image(platformConfig[i].img, platformConfig[i].url)
      }
      this.load.spritesheet('hero', 'theBird5.png', { frameWidth: 500, frameHeight: 500 });
      this.load.image('spikes', 'Spikes.png');
      this.load.image('background', "Galaxy.png")
      this.load.image('foreground', "Foreground2.png")
      this.load.image('feather', "Feather2.png")
      this.load.audio("hit", ["SFX/Explosion 2.wav"])
      this.load.audio("land", ["SFX/Hit 6.wav"])
      this.load.audio("jump", ["SFX/Jump1.wav"])
      this.load.audio("shoot", ["SFX/Shoot 2.wav"])
      this.load.audio("stomp", ["SFX/Hit 2.wav"])
      this.load.audio("jump2", ["SFX/Fly 3.wav"])
    }

    playerHit() {
      player.setVisible(false);
    }

    initPlatform(platform) {
      platform.setData("data", {x: Math.random()*2-1, y: Math.random()*2-1})
      platform.setVelocityX(platform.getData("data").x*5)
      platform.setVelocityY(platform.getData("data").y*5)
      platform.body.setImmovable(true);
      platform.body.allowGravity = false;
      var platType = Math.floor(Math.random()*platformConfig.length)
      platform.setScale(scale)
      platform.setTexture(platformConfig[platType].img)
      platform.body.syncBounds = true;
      if(Math.random() < 0.2) {
        var offset = Math.floor(platformConfig[platType].width/scale*Math.random())*scale
        var spike = this.physics.add.sprite(platform.x + offset, platform.y - platform.displayHeight, 'spikes');
        spikes.add(spike);
        spike.setScale(scale);
        spike.setImmovable(true);
        spike.body.setSize(108, 60).setOffset(0, 108-60)
        spike.setData("parent", platform)
        spike.body.allowGravity = false;
        spike.setData("offset", offset)
      }
    }

    makeFeathers() {
      if(wasPressed) return
      this.sound.play("shoot")
      player.anims.play("flap")
      var feather = this.physics.add.sprite(player.x, player.y, "feather")
      var flip = player.flipX ? -1 : 1
      feather.setScale(scale)
      feather.setVelocityX(flip * (600 + cameraVelocity*300))
      feather.setVelocityY(-200)
      feathers.add(feather)
      var feather2 = this.physics.add.sprite(player.x, player.y, "feather")
      feather2.setVelocityX(flip * (600 + cameraVelocity*300))
      feather2.setVelocityY(-500)
      feathers.add(feather2)
      feather.setBounce(0.5)
      var feather3 = this.physics.add.sprite(player.x, player.y, "feather")
      feather3.setVelocityX(flip*(600 + cameraVelocity*300))
      feather3.setVelocityY(500)
      feathers.add(feather3)
      feather2.setScale(scale)
      feather3.setScale(scale)
      feather2.setBounce(0.5)
      feather3.setBounce(0.5)
      wasPressed = true
    }

    rotateFeathers(feather) {
      feather.angle = Math.tan(feather.body.velocity.y / feather.body.velocity.x) * 180 / Math.PI
      if(feather.y > config.height || feather.x < camera.scrollX)
      {
        feather.destroy()
      }
    }

    createSpikes(spike) {
      var plat = spike.getData("parent")
      var offset = spike.getData("offset")
      spike.x = plat.x + offset - plat.displayWidth/2 + spike.displayWidth/2;
      spike.y = plat.y - plat.displayHeight/2 - spike.displayHeight/2
      if(spike.x > camera.scrollX-spike.width) return
      spike.destroy()
    }

    createPlatform(platform)
    {
      if((platform.y>config.height || platform.y < 0) && platform.getData("group") != kindOfFakePlatforms) {
        platform.setVelocityY(-platform.body.velocity.y)
        if(platform.y>config.height) {
          platform.y = config.height
        }
        else {
          platform.y = 0
        }
      }
      if(platform.x > camera.scrollX-platform.width) return
      var rand = Math.random()
      platform.y = (config.height-100) * Math.random() + 100
      platform.x = camera.scrollX + config.width + 108*5/2

      platform.getData("group").remove(platform)
      var platTypes = [platforms, fakePlatforms, kindOfFakePlatforms, platforms]
      rand = Math.floor(Math.random()*platTypes.length)
      platTypes[rand].add(platform)
      console.log("new")
      this.initPlatform(platform)
        
    }

    togglePlatform(platform) {
      platform.body.setImmovable(false);
      setTimeout(function() {if(platform.scene != undefined) {
        platform.body.setImmovable(true); platform.setVelocityX(platform.getData("data").x*5); platform.setVelocityY(platform.getData("data").y*5)}}, 100)
    }

    gameOver() {
      this.paused = true;
      this.cameras.main.shake(10, 0.005);
      this.sound.play("hit")
      var timer = this.time.delayedCall(300, function () {
        lastScore = score;
        if(lastScore > highScore) {
          highScore = lastScore
          localStorage.setItem("hs", lastScore)
        }
        this.scene.start("menu")
      }, null, this)
      
    }

    fall(player, platform) {
      platform.body.setImmovable(false);
    }

    hitSpike(player, spike) {
      if(player.body.touching.down && spike.body.touching.up) {
        this.gameOver()
      }
    }

    createAnim(animKey, spriteKey, frames) {
      if(!this.anims.exists(animKey))
      {
        this.anims.create({key: animKey, frames: this.anims.generateFrameNumbers(spriteKey, {frames: frames}), repeat: -1, frameRate: 8})
      }
    }
    //Cod Source https://stackoverflow.com/questions/36721830/convert-hsl-to-rgb-and-hex
    hslToHex(h, s, l) {
      l /= 100;
      const a = s * Math.min(l, 1 - l) / 100;
      const f = n => {
        const k = (n + h / 30) % 12;
        const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
        return Math.round(255 * color).toString(16).padStart(2, '0');   // convert to Hex and prefix "0" if needed
      };
      return `0x${f(0)}${f(8)}${f(4)}`
    }

    
    create() {
      startTint = Math.floor(Math.random()* 1000)
      cameraVelocity = 0.5

      bg = this.add.tileSprite(config.width/2, config.height/2, 1920, 1080, "background")
      bg2 = this.add.tileSprite(config.width/2, config.height, 1950, 1080, "foreground")
      bg2.tint = 0x2e2e2e

      scoreText = this.add.text(config.width - 600, 16, 'Score: 0', { fontSize: '80px', fill: '#fff' });

      hud = this.add.container(0, 0, [bg, bg2, scoreText]);
      hud.setScrollFactor(0);

      spikes = this.add.group();
      platforms = this.add.group();
      fakePlatforms = this.add.group();
      kindOfFakePlatforms = this.add.group();
      feathers = this.add.group();

      var startingX = [0, 400*2, 400*3, 400*6, 400*4, 400*5, 0, 400, 400*2, 400*3, 400*6, 400*4, 400*5]
      var startingY = [400, 400, 400, 400, 400, 400, 580, 580, 580, 580, 580, 580]
      var platTypes = [platforms, fakePlatforms, kindOfFakePlatforms, platforms]

      for(var i = 0; i < startingX.length; i++) {
        var rand = Math.floor(Math.random()*platTypes.length)
        platTypes[rand].add(this.physics.add.sprite(startingX[i], startingY[i], 'platform1x1').setData("group", platTypes[rand]))
      }
      platforms.add(this.physics.add.sprite(400, 400, 'platform1x1').setData("group", platforms));


      platforms.children.each(this.initPlatform, this)
      fakePlatforms.children.each(this.initPlatform, this)
      kindOfFakePlatforms.children.each(this.initPlatform, this)

      player = this.physics.add.sprite(400, 350-180, 'hero');
      player.setScale(.4)
      player.body.setSize(200, 350).setOffset(150, 150)
      this.createAnim("run", "hero", [5, 6, 7])
      this.createAnim("stand", "hero", [0])
      this.createAnim("jump", "hero", [4])
      this.createAnim("flap", "hero", [1, 2])
      this.createAnim("fall", "hero", [3])
      
      this.physics.add.collider(platforms, platforms);
      this.physics.add.collider(platforms, fakePlatforms);
      this.physics.add.collider(platforms, kindOfFakePlatforms);
      this.physics.add.collider(spikes, platforms);
      this.physics.add.collider(spikes, fakePlatforms);
      this.physics.add.collider(spikes, kindOfFakePlatforms);
      this.physics.add.collider(player, spikes, this.hitSpike, null, this)
      this.physics.add.collider(player, kindOfFakePlatforms, this.fall, null, this)
      this.physics.add.collider(feathers, spikes)

      player.setBounce(0);

      cursors = this.input.keyboard.createCursorKeys();
      this.input.keyboard.on('keydown-Q', this.makeFeathers, this);
      keyQ = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q);
      keyS = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S)
      keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W)

      

      this.physics.add.collider(player, platforms);
      this.physics.add.collider(platforms, platforms, this.togglePlatform);
      this.physics.add.collider(feathers, platforms);
      this.physics.add.collider(feathers, kindOfFakePlatforms)
      camera = this.cameras.main;
    }

    flipSprite(sprite) {
      if(sprite.body.velocity.x < 0) {
        sprite.flipX = true
      }
      else {
        sprite.flipX = false
      }
    }

    update() {
      var standing = player.body.blocked.down || player.body.touching.down;
      score = camera.scrollX/1000
      scoreText.text = "Score: " + parseFloat(score).toFixed(2);
      if(player.body.velocity.x != 0 && player.anims.getName() != "run" && standing && !keyQ.isDown && !wasPressed && !keyS.isDown) {
        player.anims.play("run")
      }
      if(jumping && !keyQ.isDown && !wasPressed && !keyS.isDown) {
        player.anims.play("jump")
      }
      else if(!standing && !keyQ.isDown && !wasPressed && !keyS.isDown) {
        player.anims.play("fall")
      }
      player.anims.msPerFrame = 200 / Math.abs((player.body.velocity.x/100))
      this.flipSprite(player)
      feathers.children.each(this.flipSprite)
      if(player.x < camera.scrollX-50 || player.y > config.height) {
        this.gameOver();
      }
      camera.scrollX += cameraVelocity 
      bg.tilePositionX += cameraVelocity / 2
      bg.tint = this.hslToHex(startTint, 100, 50)
      startTint+= 0.02
      bg2.tilePositionX += cameraVelocity * 2 /3
      bg2.angle = Math.sin(bg2.tilePositionX/180)*5
      if(cameraVelocity < 2) cameraVelocity *= cameraAcceleration
      
      platforms.children.each(this.movePlatform)
      platforms.children.each(this.createPlatform, this)
      fakePlatforms.children.each(this.movePlatform)
      fakePlatforms.children.each(this.createPlatform, this)
      kindOfFakePlatforms.children.each(this.movePlatform)
      kindOfFakePlatforms.children.each(this.createPlatform, this)
      spikes.children.each(this.createSpikes)
      feathers.children.each(this.rotateFeathers)

      if(!keyQ.isDown && wasPressed)
      {
        wasPressed = false
      }

      if(keyS.isDown && !wasStomping)
      {
        this.sound.play("stomp")
        player.anims.play("fall")
        player.setVelocityY(700)
      }
      
      var d = new Date();
      var time = d.getTime();
      
      //if left key is down then move left
      if (cursors.left.isDown) {
        //if hero is on ground then use full acceleration
        if (standing) {
            player.setAccelerationX(-acceleration*2 - cameraVelocity*100);
        }
        //if hero is in the air then accelerate slower
        else {
            player.setAccelerationX(-acceleration - cameraVelocity*100);
        }
      }
      //same deal but for right arrow
      else if (cursors.right.isDown) {
        if (standing) {
            player.setAccelerationX(acceleration + cameraVelocity*100);
        } else {
            player.setAccelerationX(acceleration / 2 + cameraVelocity*100);
        }
      }
      //if neither left or right arrow is down then...
      else {
          //if hero is close to having no velocity either left or right then set velocity to 0.
          if (Math.abs(player.body.velocity.x) < 10 && Math.abs(player.body.velocity.x) > -10) {
              player.setVelocityX(0)
              player.setAccelerationX(0);
            if(standing && !keyQ.isDown && !wasPressed) player.anims.play("stand")
          }
          //if our hero isn't moving left or right then slow them down 
          else {
              player.setAccelerationX(((player.body.velocity.x > 0) ? -3 : 3) * acceleration / Math.abs(cameraVelocity*50));
          }
      }

      //If player is touching floor and up key is pressed then jump
      if ((standing || time <= edgeTimer) && cursors.up.isDown && (!jumping)) 
      {
        player.setVelocityY(jumpVelocity);
        this.sound.play("jump")
        jumping = true;
      }
      else if(keyW.isDown && jumping && doubleJump) {
        doubleJump = false;
        this.sound.play("jump2")
        player.setVelocityY(jumpVelocity);
      }
      else if (!cursors.up.isDown) {
          if (player.body.touching.down) {
              jumping = false;
              doubleJump = true;
          }
      }
      if (!standing && wasStanding) {
        edgeTimer = time + 100;
      }
      if(standing && !wasStanding) {
        this.sound.play("land")
      }
      wasStanding = standing;
      wasStomping = keyS.isDown
    }
    
  }



const config = {
  type: Phaser.AUTO,
  width: 1920,
  height: 1080,
  scene: [ClickScreen, Menu, Game],
  physics: {
    default: 'arcade',
    arcade: {
      debug: false,
      gravity: {y: 800}
    }
  },
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  }
}

const game = new Phaser.Game(config);