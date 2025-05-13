import {ScheduledState, Sprite} from "jetcode-scrubjs";
import {BulletSprite} from "./bullet.sprite";
import {DungeonStage} from "../stages/dungeon.stage";
import {OutroStage} from "../stages/outro.stage";
import {BossEnemySprite} from "./boss-enemy.sprite";

export class HeroSprite extends Sprite {
    static instance;

    hp = 1;
    ammo = 100;
    moveSpeed = 3;
    stopTimer = 0;
    touchingWall = false;
    dieTimer = 0;
    state = 'idle';

    constructor(stage) {
        super(stage);

        if (HeroSprite.instance) {
            throw new Error('Hero class: use getInstance() method instead.');
        }
    }

    static getInstance() {
        if (!HeroSprite.instance) {
            HeroSprite.instance = new HeroSprite();
        }

        return HeroSprite.instance;
    }

    init() {
        // Custom configure here

        this.name = 'Hero';
        this.addTag('player');

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

        this.size = 300;

        this.forever(this.control);
        this.animationState = this.forever(this.animation, 200);
        this.state = 'idle';

        this.pen(this.drawUI);

        this.bullet = new BulletSprite(this.stage);
        this.bullet.hidden = true;
        this.bullet.layer = 2;
    }

    control() {
        if (this.state === 'dead') {
            return;
        }

        if (this.state === 'stop') {
            this.stopTimer++;

        } else if (this.state !== 'idle') {
            this.stopTimer = 0;
        }

        if (this.state === 'die') {
            this.dieTimer++;

            if (this.dieTimer > 150) {
                this.dieTimer = 0;
                this.state = 'dead';
                this.hidden = true;

                this.stage.timeout(() => {
                    this.stage.showRestartButton();
                }, 2000);
            }

            return;
        }

        if (this.state === 'attack') {
            return
        }

        /**
         * Animations
         */
        if (this.game.keyPressed(['w', 'd', 'a'])) {
            this.animationState.interval = 1;
            this.state = 'move_up';

            if (this.costumeIndex < 5) {
                this.switchCostume(5);
            }

        } else if (this.game.keyPressed('s')) {
            this.animationState.interval = 1;
            this.state = 'move_down';

            if (this.costumeIndex < 5) {
                this.switchCostume(8);
            }

        } else if (this.stopTimer > 50) {
            this.animationState.interval = 1;
            this.state = 'idle';

        } else {
            this.animationState.interval = 1;
            this.state = 'stop';
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
                this.state = 'attack';

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

        if (this.game.keyPressed(['w', 's', 'a', 'd']) && !this.touchingWall) {
            this.playSound('move', {
                'volume': 0
            });
        }

        if (this.touchingWall) {
            this.animationState.interval = 1;
            this.state = 'stop';
        }

        if (this.stage instanceof DungeonStage) {
            this.checkNextLevel();
        }
    }

    animation(hero, animationState) {
        switch (this.state) {
            case 'stop':
                animationState.interval = 1;
                this.switchCostume(0);

                break;

            case 'idle':
                animationState.interval = 200;
                this.nextCostume(0, 4);

                break;

            case 'move_up':
                animationState.interval = 120;
                this.nextCostume(5, 8);

                break;

            case 'move_down':
                animationState.interval = 120;
                this.prevCostume(5, 8);

                break;

            case 'attack':
                animationState.interval = 120;
                this.nextCostume(9, 12);

                if (this.costumeIndex === 10) {
                    this.startSound('shot');
                }

                if (this.costumeIndex === 12) {
                    this.state = 'idle';
                    this.shot();
                }

                break;

            case 'die':
                animationState.interval = 150;
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

        if (bullet.touchEdge()) {
            bullet.delete();

        } else if (bullet.touchTag('wall')) {
            bullet.delete();

        } else if (bullet.touchTag('enemy')) {
            this.otherSprite.hit();

            bullet.delete();
        }
    }

    checkNextLevel() {
        if (this.stage.map){
            const currentLevel = this.stage.map[this.y_on_map][this.x_on_map];
            if (currentLevel.completed) {

                let nextLevel = false;

                if (this.y < 0) {
                    this.y_on_map -= 1;
                    this.y = this.stage.height - 100;

                    nextLevel = true;
                }

                if (this.y > this.stage.height) {
                    this.y_on_map += 1;
                    this.y = 100;

                    nextLevel = true;
                }

                if (this.x < 0) {
                    this.x_on_map -= 1;
                    this.x = this.stage.width - 100;

                    nextLevel = true;
                }

                if (this.x > this.stage.width) {
                    this.x_on_map += 1;
                    this.x = 100;

                    nextLevel = true;
                }

                if (nextLevel) {
                    this.playSound('next_level');
                    this.bullet.deleteClones();
                    this.stage.renderRoom(this.x_on_map, this.y_on_map);

                } else if (this.touchTag('exit')) {
                    this.playSound('next_level');
                    this.bullet.deleteClones();
                    this.stage.renderFinalRoom();
                }
            }
        }
    }

    drawUI(context, hero) {
        // HP
        context.font = 'bold 16px Arial';
        context.fillStyle = 'black';
        context.fillText('HP:', 35, 24);

        context.fillStyle = '#696969';
        context.fillRect(70, 10, 120, 16);
        context.fillStyle = 'green';
        context.fillRect(70, 10, 120 * hero.hp / 100, 16);
        context.strokeStyle = 'black';
        context.strokeRect(70, 10, 120, 16);

        // ammo
        context.font = 'bold 16px Arial';
        context.fillStyle = 'black';
        context.fillText('AMMO (R):', 350, 24);

        context.fillStyle = '#696969';
        context.fillRect(440, 10, 100, 16);
        context.fillStyle = 'green';
        context.fillRect(440, 10, 100 * hero.ammo / 100, 16);
        context.strokeStyle = 'black';
        context.strokeRect(440, 10, 100, 16);
    }

    hit() {
        if (this.state === 'die' || this.state === 'dead') {
            return;
        }

        this.hp -= 10;

        if (this.hp <= 0) {
            this.hp = 0;

            this.playSound('gameover');
            this.state = 'die';
        }
    }
}
