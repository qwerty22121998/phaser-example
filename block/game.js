import Phaser from 'phaser'

let player
let cursor
let point
let enemy

let score = 0
let scoreLabel

const WIDTH = 800
const HEIGH = 800

let playerSpeed = 150

const config = {
  type: Phaser.AUTO,
  width: WIDTH,
  height: HEIGH,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { },
      debug: false
    }
  },
  scene: {
    preload () {
      this.load.image('player', 'assets/player.png')
      this.load.image('point', 'assets/point.png')
      this.load.image('enemy', 'assets/enemy.png')
    },
    create () {
      cursor = this.input.keyboard.createCursorKeys()
      player = this.physics.add.sprite(WIDTH / 2, HEIGH / 2, 'player').setScale(0.5)
      player.setCollideWorldBounds(true)
      player.setBounce(1)
      enemy = this.physics.add.sprite(100, 100, 'enemy').setScale(0.5)
      enemy.setCollideWorldBounds(true)
      enemy.setBounce(1)

      point = this.physics.add.sprite(0, 0, 'point').setScale(0.2)
      scoreLabel = this.add.text(0, 0, 'score: 0')
      spawnPoint()
      this.physics.add.overlap(player, point, playerEat, null, this)
      this.physics.add.collider(player, enemy)
      this.physics.add.overlap(enemy, point, enemyEat, null, this)

      cursor.space.onDown(() => { playerSpeed = 300 })
      cursor.space.onUp(() => { playerSpeed = 150 })

      this.time.addEvent({
        delay: 500,
        callback: enemyMove,
        callbackScope: this,
        loop: true
      })
    },
    update () {
      // enemyMove()
      if (cursor.left.isDown) {
        player.setVelocityX(-playerSpeed)
      }
      if (cursor.right.isDown) {
        player.setVelocityX(playerSpeed)
      }
      if (cursor.up.isDown) {
        player.setVelocityY(-playerSpeed)
      }
      if (cursor.down.isDown) {
        player.setVelocityY(playerSpeed)
      }
    }
  }
}

const random = (min, max) => {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min) + min) // The maximum is exclusive and the minimum is inclusive
}

const spawnPoint = () => {
  point.setPosition(random(0, WIDTH), random(0, HEIGH))
}

const playerEat = (player, point) => {
  score++
  scoreLabel.setText(`score: ${score}`)
  spawnPoint()
}

const enemyEat = (enemy, point) => {
  score--
  scoreLabel.setText(`score: ${score}`)
  spawnPoint()
}

const enemyMove = () => {
  const vecX = Math.sign(point.body.x - enemy.body.x)
  const vecY = Math.sign(point.body.y - enemy.body.y)
  enemy.setVelocityX(vecX * 100)
  enemy.setVelocityY(vecY * 100)
}
export default config
