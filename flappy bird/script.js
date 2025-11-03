let move_speed = 1.5;      
let gravity = 0.3;        
let flap_strength = 7;    
let bird = document.querySelector('.bird');
let img = document.querySelector('#bird-1');

let bird_props = bird.getBoundingClientRect();
let background = document.querySelector('.background').getBoundingClientRect();
let score_val = document.querySelector('.score_val');
let message = document.querySelector('.message');
let score_title = document.querySelector('.score_title');

let game_state = 'Start';
let bird_dy = 0;
img.style.display = 'none';
message.classList.add('messageStyle');

const deathSound = new Audio('audio/death.mp3');
const scoreSound = new Audio('audio/score.mp3');
const flapSound = new Audio('audio/flap.mp3');
const flap_btn = document.querySelector('#flap-btn');
const restart_btn = document.querySelector('#restart-btn');

flap_btn.addEventListener('click', () => {
    flapSound.currentTime = 0;
    flapSound.play();
    if(game_state === 'Start') startGame();
    if(game_state === 'Play') bird_dy = -flap_strength;
});

restart_btn.addEventListener('click', () => {
    if(game_state !== 'Play') {
        document.querySelectorAll('.pipe_sprite').forEach(pipe => pipe.remove());
        img.style.display = 'block';
        bird.style.top = '40vh';
        bird_props = bird.getBoundingClientRect();
        bird_dy = 0;
        score_val.innerHTML = '0';
        score_title.innerHTML = 'Score : ';
        message.innerHTML = '';
        message.classList.remove('messageStyle');
        game_state = 'Play';
        play();
    }
});

document.addEventListener('keydown', (e) => {
    if(e.key == 'Enter' && game_state != 'Play'){
        document.querySelectorAll('.pipe_sprite').forEach((e) => { e.remove(); });
        img.style.display = 'block';
        bird.style.top = '40vh';
        game_state = 'Play';
        message.innerHTML = '';
        score_title.innerHTML = 'Score : ';
        score_val.innerHTML = '0';
        message.classList.remove('messageStyle');
        play();
    }
});

function play() {
    function move() {
        if(game_state != 'Play') return;

        let pipe_sprite = document.querySelectorAll('.pipe_sprite');
        pipe_sprite.forEach((eLement) => {
            let pipe_sprite_props = eLement.getBoundingClientRect();
            bird_props = bird.getBoundingClientRect();

            if(pipe_sprite_props.right <= 0){
                eLement.remove();
            } else {
                if(bird_props.left < pipe_sprite_props.left + pipe_sprite_props.width &&
                   bird_props.left + bird_props.width > pipe_sprite_props.left &&
                   bird_props.top < pipe_sprite_props.top + pipe_sprite_props.height &&
                   bird_props.top + bird_props.height > pipe_sprite_props.top) {

                    game_state = 'End';
                    deathSound.currentTime = 0;
                    deathSound.play();
                    
                    message.innerHTML = 'Game Over'.fontcolor('red') + '<br>Press Enter To Restart';
                    message.classList.add('messageStyle');
                    img.style.display = 'none';
                    return;
                } else {
                    if(pipe_sprite_props.right < bird_props.left &&
                       pipe_sprite_props.right + move_speed >= bird_props.left &&
                       eLement.increase_score == '1') {

                        score_val.innerHTML = +score_val.innerHTML + 1;
                        scoreSound.currentTime = 0;
                        scoreSound.play();
                    }
                    eLement.style.left = pipe_sprite_props.left - move_speed + 'px';
                }
            }
        });

        requestAnimationFrame(move);
    }
    requestAnimationFrame(move);


    function apply_gravity() {
        if(game_state != 'Play') return;

        bird_dy = bird_dy + gravity;

        document.addEventListener('keydown', (e) => {
            if(e.key == 'ArrowUp' || e.key == ' ') {
                img.src = 'image/Bird-2.png';
                bird_dy = -7.6;
            }
        });

        document.addEventListener('keyup', (e) => {
            if(e.key == 'ArrowUp' || e.key == ' ') {
                img.src = 'image/Bird.png';
            }
        });

        if(bird_props.top <= 0 || bird_props.bottom >= background.bottom){
            game_state = 'End';
            message.style.left = '28vw';
            window.location.reload();
            message.classList.remove('messageStyle');
            return;
        }

        bird.style.top = bird_props.top + bird_dy + 'px';
        bird_props = bird.getBoundingClientRect();
        requestAnimationFrame(apply_gravity);
    }
    requestAnimationFrame(apply_gravity);

    let pipe_seperation = 0;
    let pipe_gap = 35;

    function create_pipe() {
        if(game_state != 'Play') return;

        if(pipe_seperation > 115){
            pipe_seperation = 0;
            let pipe_posi = Math.floor(Math.random() * 43) + 8;

            let pipe_sprite_inv = document.createElement('div');
            pipe_sprite_inv.className = 'pipe_sprite';
            pipe_sprite_inv.style.top = pipe_posi - 70 + 'vh';
            pipe_sprite_inv.style.left = '100vw';
            document.body.appendChild(pipe_sprite_inv);

            let pipe_sprite = document.createElement('div');
            pipe_sprite.className = 'pipe_sprite';
            pipe_sprite.style.top = pipe_posi + pipe_gap + 'vh';
            pipe_sprite.style.left = '100vw';
            pipe_sprite.increase_score = '1';
            document.body.appendChild(pipe_sprite);
        }

        pipe_seperation++;
        requestAnimationFrame(create_pipe);
    }
    requestAnimationFrame(create_pipe);
}
