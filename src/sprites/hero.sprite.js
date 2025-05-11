import {ScheduledState, Sprite} from "jetcode-scrubjs";
import {BulletSprite} from "./bullet.sprite";
import {Dangeon} from "../stages/dangeon.stage";

export class HeroSprite extends Sprite {
    static instance;

    hp = 100;
    ammo = 10;
    moveSpeed = 3;
    stopTimer = 0;
    touchingWall = false;
    dieTimer = 0;

    constructor(stage) {
        super(stage);

        if (HeroSprite.instance) {
            throw new Error('Hero class: use getInstance() method instead.');
        }
    }

    static getInstance(gameStage) {
        if (!HeroSprite.instance) {
            HeroSprite.instance = new HeroSprite(gameStage);

        } else {
            HeroSprite.instance.setStage(gameStage);
        }

        return HeroSprite.instance;
    }

    init() {
        // Custom configure here

        this.name = 'Hero';

        this.addCostume('public/images/hero/idle/idle1.png');
        this.addCostume('public/images/hero/idle/idle2.png');
        this.addCostume('public/images/hero/idle/idle3.png');
        this.addCostume('public/images/hero/idle/idle4.png');
        this.addCostume('public/images/hero/idle/idle5.png');

        this.addCostume('public/images/hero/moving/moving1.png');
        this.addCostume('public/images/hero/moving/moving2.png');
        this.addCostume('public/images/hero/moving/moving3.png');
        this.addCostume('public/images/hero/moving/moving4.png');

        this.addCostume('public/images/hero/attack/attack1.png');
        this.addCostume('public/images/hero/attack/attack2.png');
        this.addCostume('public/images/hero/attack/attack3.png');
        this.addCostume('public/images/hero/attack/attack4.png');

        this.addSound('public/sounds/hero/shot.wav', 'shot');
        this.addSound('public/sounds/hero/not_ammo.mp3', 'not_ammo');
        this.addSound('public/sounds/hero/reload.mp3', 'reload');
        this.addSound('public/sounds/hero/next_level.mp3', 'next_level');
        this.addSound('public/sounds/hero/move.wav', 'move');
        this.addSound('public/sounds/hero/gameover.mp3', 'gameover');

        this.size = 400;

        this.forever(this.control);
        this.animationState = this.forever(this.animation, 200);
        this.animationState.action = 'idle';

        this.pen(this.drawUI);

        this.bullet = new BulletSprite(this.stage);
        this.bullet.hidden = true;
        this.bullet.layer = 2;
    }

    control() {
        if (this.animationState.action === 'stop') {
            this.stopTimer++;

        } else if (this.animationState.action !== 'idle') {
            this.stopTimer = 0;
        }

        if (this.animationState.action === 'die') {
            this.dieTimer++;

            if (this.dieTimer > 150) {
                this.animationState.action === 'dead';
                this.delete();
            }

            return;
        }

        if (this.animationState.action === 'attack') {
            return
        }

        /**
         * Animations
         */
        if (this.game.keyPressed(['w', 'd', 'a'])) {
            this.animationState.interval = 1;
            this.animationState.action = 'move_up';

            if (this.costumeIndex < 5) {
                this.switchCostume(5);
            }

        } else if (this.game.keyPressed('s')) {
            this.animationState.interval = 1;
            this.animationState.action = 'move_down';

            if (this.costumeIndex < 5) {
                this.switchCostume(8);
            }

        } else if (this.stopTimer > 50) {
            this.animationState.interval = 1;
            this.animationState.action = 'idle';

        } else {
            this.animationState.interval = 1;
            this.animationState.action = 'stop';
        }

        if (this.game.keyPressed('r') && this.ammo < 100) {
            this.playSound('reload');
            this.ammo = 100;
            return;
        }

        /**
         * Shot
         */
        if (this.game.mouseDownOnce()) {
            if (this.ammo > 0) {
                this.animationState.interval = 1;
                this.animationState.action = 'attack';

                if (this.costumeIndex < 9) {
                    this.switchCostume(9);
                }

            } else {
                this.startSound('not_ammo');
            }
        }

        /**
         * Moving
         */
        this.touchingWall = false
        if (this.game.keyPressed('w')) {
            this.y -= this.moveSpeed;

            if (this.touchTag('wall')) {
                this.y += this.moveSpeed;
                this.touchingWall = true;
            }
        }

        if (this.game.keyPressed('s')) {
            this.y += this.moveSpeed;

            if (this.touchTag('wall')) {
                this.y -= this.moveSpeed;
                this.touchingWall = true;
            }
        }

        if (this.game.keyPressed('d')) {
            this.x += this.moveSpeed;

            if (this.touchTag('wall')) {
                this.x -= this.moveSpeed;
                this.touchingWall = true;
            }
        }

        if (this.game.keyPressed('a')) {
            this.x -= this.moveSpeed;

            if (this.touchTag('wall')) {
                this.x += this.moveSpeed;
                this.touchingWall = true;
            }
        }

        if (this.game.keyPressed('f')) {
            this.playSound('gameover');
            this.animationState.action = 'die';
        }

        if (this.game.keyPressed(['w', 's', 'a', 'd']) && !this.touchingWall) {
            this.playSound('move', {
                'volume': 0.1
            });
        }

        if (this.touchingWall) {
            this.animationState.interval = 1;
            this.animationState.action = 'stop';
        }

        if (this.stage instanceof Dangeon) {
            this.checkNextLevel();
        }
    }

    animation(hero, state) {
        switch (state.action) {
            case 'stop':
                state.interval = 1;
                this.switchCostume(0);

                break;

            case 'idle':
                state.interval = 200;
                this.nextCostume(0, 4);

                break;

            case 'move_up':
                state.interval = 120;
                this.nextCostume(5, 8);

                break;

            case 'move_down':
                state.interval = 120;
                this.prevCostume(5, 8);

                break;

            case 'attack':
                state.interval = 120;
                this.nextCostume(9, 12);

                if (this.costumeIndex === 10) {
                    this.startSound('shot');
                }

                if (this.costumeIndex === 12) {
                    state.action = 'idle';
                    this.shot();
                }

                break;

            case 'die':
                state.interval = 150;
                this.hidden = !this.hidden;

                break;
        }
    }

    shot() {
        const bullet = this.bullet.createClone();
        bullet.x = this.x;
        bullet.y = this.y;
        bullet.pointForward(this.game.getMousePoint());
        bullet.move(35);
        bullet.hidden = false;

        bullet.forever(this.bulletMove);

        this.ammo -= 10;
    }

    bulletMove(bullet) {
        bullet.move(10);
    }

    checkNextLevel() {
        let nextLevel = false;

        if (this.y < 0) {
            this.y_on_map -= 1;
            this.y = this.stage.height;

            nextLevel = true;
        }

        if (this.y > this.stage.height) {
            this.y_on_map += 1;
            this.y = 0;

            nextLevel = true;
        }

        if (this.x < 0) {
            this.x_on_map -= 1;
            this.x = this.stage.width;

            nextLevel = true;
        }

        if (this.x > this.stage.width) {
            this.x_on_map += 1;
            this.x = 0;

            nextLevel = true;
        }

        if (nextLevel) {
            this.playSound('next_level');
            this.stage.renderRoom(this.stage.map, this.x_on_map, this.y_on_map);

        }
    }

    drawUI(context, hero) {
        // HP
        context.font = 'bold 20px Arial';
        context.fillStyle = 'black';
        context.fillText('HP:', 40, 28);

        context.fillStyle = '#696969';
        context.fillRect(80, 10, 150, 20);
        context.fillStyle = 'green';
        context.fillRect(80, 10, 150 * hero.hp / 100, 20);
        context.strokeStyle = 'black';
        context.strokeRect(80, 10, 150, 20);

        // ammo
        context.font = 'bold 20px Arial';
        context.fillStyle = 'black';
        context.fillText('AMMO:', 495, 28);

        context.fillStyle = '#696969';
        context.fillRect(570, 10, 150, 20);
        context.fillStyle = 'green';
        context.fillRect(570, 10, 150 * hero.ammo / 100, 20);
        context.strokeStyle = 'black';
        context.strokeRect(570, 10, 150, 20);
    }
}
