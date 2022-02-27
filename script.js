// importing music effects
const intromusic = new Audio("./music/introSong.mp3")
const gameoverMusic = new Audio("./music/gameOver.mp3")
const heavyWeaponMusic = new Audio("./music/music_heavyWeapon.mp3")
const hugeWeaponMusic = new Audio("./music/music_hugeWeapon.mp3")
const killEnemyMusic = new Audio("./music/music_killEnemy.mp3")
const shootingMusic = new Audio("./music/music_shooting.mp3")
intromusic.play()
// creating canvas
const canvas = document.createElement("canvas");
const resetscore = 0
document.querySelector(".myGame").appendChild(canvas);
canvas.width = innerWidth
canvas.height = innerHeight;
const context = canvas.getContext("2d");

let difficulty = 2;
const form = document.querySelector("form")
const lightWeapondamage = 10;
const highWeapondamage = 23;
const hugeWeapondamage = 50;
const scoreboard = document.querySelector(".scoreboard")
let playerscore = 0;
let score = document.querySelector(".score")

document.querySelector("input").addEventListener("click", (e) => {
    e.preventDefault();
   intromusic.pause()
    form.style.display = "none";
    scoreboard.style.display = "block";

    const userValue = document.getElementById("Difficulty").value;

    if (userValue === "Easy") {
        setInterval(spawnenemy, 2000)
        return (difficulty = 5)
    }
    if (userValue === "Medium") {
        setInterval(spawnenemy, 1500)
        return (difficulty = 8)
    }
    if (userValue === "Difficult") {
        setInterval(spawnenemy, 1000)
        return (difficulty = 10)
    }
    if (userValue === "Insane") {
        setInterval(spawnenemy, 700)
        return (difficulty = 12)
    }
})

// creating gameover Elements
const gameoverLoader = ()=>{
    const gameoverBanner = document.createElement("div");
    const gameoverbtn = document.createElement("button")
    const HighScore = document.createElement("div")
    const reset = document.createElement("button")
    
    HighScore.innerHTML = `High Score : ${
        localStorage.getItem("highScore")?localStorage.getItem("highScore"):playerscore
          
        }`

        const oldhighscore = localStorage.getItem("highScore") && localStorage.getItem("highScore")
        if(oldhighscore < playerscore){
           localStorage.setItem("highScore",playerscore)
           HighScore.style.boxShadow = "0 0 10px white"
        }
    

    gameoverbtn.innerText = "Play again"
    reset.innerText = "Reset"
    gameoverBanner.appendChild(HighScore)
    gameoverBanner.appendChild(gameoverbtn)
    gameoverBanner.appendChild(reset)

    gameoverbtn.onclick = ()=>{
        window.location.reload()
    }
   reset.onclick = ()=>{
       localStorage.removeItem("highScore")
    HighScore.innerHTML = `High Score : ${
        localStorage.getItem("highScore")?localStorage.getItem("highScore"):resetscore
          
        }`

        const oldhighscore1 = localStorage.getItem("highScore") && localStorage.getItem("highScore")
        if(oldhighscore1 > resetscore){
           localStorage.setItem("highScore",resetscore)
        }
   }
    
    gameoverBanner.classList.add("gameover")
    HighScore.classList.add("highscore")
    document.querySelector("body").appendChild(gameoverBanner)

}
const playerposition = {
    x: canvas.width / 2,
    y: canvas.height / 2
}

// player class
class player {
    constructor(x, y, radius, color) {

        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
    }
    draw() {
        context.beginPath()
        context.arc(
            this.x,
            this.y,
            this.radius,
            0,
            360,
            false
        );
        context.fillStyle = this.color;

        context.fill()

    }
}


// weapons class
class Weapon {
    constructor(x, y, radius, color, velocity, damage) {

        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.velocity = velocity;
        this.damage = damage;
    }
    draw() {
        context.beginPath()
        context.arc(
            this.x,
            this.y,
            this.radius,
            0,
            360,
            false
        );
        context.fillStyle = this.color;

        context.fill()

    }
    update() {
        this.draw();
        this.x += this.velocity.x,
            this.y += this.velocity.y
    }


}
// hugeweapon class
class hugeWeapon {
    constructor(x, y, color, damage) {

        this.x = x;
        this.y = y;
        this.color = color;
        this.damage = damage;
    }
    draw() {
        context.beginPath()
        context.fillRect(this.x, this.y, 100, canvas.height)
        context.fillStyle = this.color;

        context.fill()

    }
    update() {
        this.draw();
        this.x += 10,
            this.y = 0
    }


}

// enemy class
class Enemy {
    constructor(x, y, radius, color, velocity) {

        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.velocity = velocity;

    }
    draw() {
        context.beginPath()
        context.arc(
            this.x,
            this.y,
            this.radius,
            0,
            360,
            false
        );
        context.fillStyle = this.color;

        context.fill()

    }
    update() {
        this.draw();
        this.x += this.velocity.x,
            this.y += this.velocity.y
    }
}


// particle class

class particle {
    constructor(x, y, radius, color, velocity) {

        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.velocity = velocity;
        this.alpha = 1;
    }
    draw() {
        context.save();
        context.globalAlpha = this.alpha;
        context.beginPath()
        context.arc(
            this.x,
            this.y,
            this.radius,
            0,
            360,
            false
        );
        context.fillStyle = this.color;

        context.fill()
        context.restore();

    }
    update() {
        this.draw();
        // this.velocity.x  *= friction
        // this.velocity.y  *= friction

        this.x += this.velocity.x,
            this.y += this.velocity.y,
            this.alpha -= 0.01
        // console.log(this.velocity)
    }
}

// -----------------Main Logic Here-----------------
// create player object ,player array,weapon array 

const abhi = new player(
    playerposition.x,
    playerposition.y,
    12,
    `rgb(${Math.random() * 300},${Math.random() * 300},${Math.random() * 300})`);

// Creating arrays    
const weapons = []
const enemies = []
const particles = []
const hugeWeapons = []

const spawnenemy = () => {
    enemySize = Math.random() * (40 - 5) + 5;
    enemyColor = `rgb(${Math.random() * 250},${Math.random() * 250},${Math.random() * 250})`

    let random;
    if (Math.random() < 0.5) {
        random = {
            x: Math.random() < 0.5 ? canvas.width + enemySize : 0 - enemySize,
            y: Math.random() * canvas.height
        };
    }
    else {
        random = {
            x: Math.random() * canvas.width,
            y: Math.random() < 0.5 ? canvas.height + enemySize : 0 - enemySize
        };
    }
    const myAngle = Math.atan2(
        canvas.height / 2 - random.y,
        canvas.width / 2 - random.x
    )

    const velocity = {
        x: Math.cos(myAngle) * 4,
        y: Math.sin(myAngle) * 4
    }

    enemies.push(new Enemy(random.x, random.y, enemySize, enemyColor, velocity))
}

// Animation
let animationId;
function animation() {
    animationId = requestAnimationFrame(animation);
    context.fillStyle = "rgba(49,49,49,0.2)";
    
    context.fillRect(0, 0, canvas.width, canvas.height)
    abhi.draw()
    // generating particles
    particles.forEach((particle, particleIndex) => {
        if (particle.alpha <= 0) {
            particles.splice(particleIndex, 1)
        }
        else {
            
            particle.update()
        }
    })
    // generating hugeweapons
    hugeWeapons.forEach((hugeweapon, hugeweaponIndex) => {
        if (hugeWeapon.x > canvas.width) {
            hugeWeapons.splice(hugeweaponIndex, 1)
        }
        else {
            
            hugeweapon.update()
        }
    }) 
    
    // generating weapon
    weapons.forEach(item => {
        item.update()
    })
    
    enemies.forEach((enemy, enemyIndex) => {
        hugeWeapons.forEach((hugeWeapon) => {
            const distancebetweenEnemyAndhugeWeapon = hugeWeapon.x - enemy.x;
            if (distancebetweenEnemyAndhugeWeapon <= 100 && distancebetweenEnemyAndhugeWeapon >= -100) {
                setTimeout(() => {
                    enemies.splice(enemyIndex, 1)
                    
                }, 0)
                playerscore += 10;
                
            }
        })
    })

// <-----------------------Main Logic------------------->

    enemies.forEach((enemy, enemyIndex) => {
        enemy.update()
        weapons.forEach((weapon, weaponIndex) => {
            
            const distancebetweenEnemyAndPlayer = Math.hypot(
                abhi.x - enemy.x,
                abhi.y - enemy.y
                )
                
                const distancebetweenEnemyAndWeapon = Math.hypot(
                    weapon.x - enemy.x,
                    weapon.y - enemy.y
                    )

                    // Game over logic
                    if (distancebetweenEnemyAndPlayer - abhi.radius - enemy.radius < 1) {
                        cancelAnimationFrame(animationId)
                        gameoverMusic.play()
                       
                        return gameoverLoader();
                
    
            }

            // Killing Enemies
            if (distancebetweenEnemyAndWeapon - weapon.radius - enemy.radius < 1) {

                if (enemy.radius > weapon.damage + 8) {
                    gsap.to(enemy, {
                        radius: enemy.radius - weapon.damage
                    })
                    setTimeout(() => {
                        weapons.splice(weaponIndex, 1)
                        
                    }, 0)
                    
                }
                else {
                    for (let i = 0; i < enemy.radius * 5; i++) {
                        particles.push(
                            new particle(
                                enemy.x, enemy.y, 2, enemy.color, {
                                    x: Math.random() - 0.5 * Math.random() * 5,
                                    y: Math.random() - 0.5 * Math.random() * 5,
                                }
                                )
                                )
                            }
                            
                            setTimeout(() => {
                                weapons.splice(weaponIndex, 1)
                                enemies.splice(enemyIndex, 1)
                                killEnemyMusic.play()

                    }, 0)
                }
                playerscore += 10

            }
            
        })
    })
    score.innerText = playerscore

}

//Shooting Weapons
canvas.addEventListener("click", (e) => {
    
    shootingMusic.play()
    const myAngle = Math.atan2(
        e.clientY - canvas.height / 2,
        e.clientX - canvas.width / 2
    )

    const velocity = {
        x: Math.cos(myAngle) * 6,
        y: Math.sin(myAngle) * 6
    }
    weapons.push(
        new Weapon(
            canvas.width / 2,
            canvas.height / 2,
            6,
            "white", velocity,
            lightWeapondamage
        ))
})

animation()

// Shooting Heavy Weapons
canvas.addEventListener("contextmenu", (e) => {
    e.preventDefault()
    if(playerscore >= 2){
        heavyWeaponMusic.play()
    playerscore -= 2
    const myAngle = Math.atan2(
        e.clientY - canvas.height / 2,
        e.clientX - canvas.width / 2
    )

    const velocity = {
        x: Math.cos(myAngle) * 4,
        y: Math.sin(myAngle) * 4
    }
    weapons.push(
        new Weapon(
            canvas.width / 2,
            canvas.height / 2,
            15,
            "cyan", velocity,
            highWeapondamage
        ))
}
})

// Huge weapon
addEventListener("keypress", (e) => {
    if (e.key === " ") {
        if(playerscore >= 10){
            hugeWeaponMusic.play(      )
        hugeWeapons.push(
            new hugeWeapon(
                0, 0,
                // 15,
                "cyan",
                hugeWeapondamage
                
            ))
            playerscore -= 10
    }
}

})
addEventListener("resize",()=>{
    canvas.width = innerWidth;
canvas.height = innerHeight;
})

animation()