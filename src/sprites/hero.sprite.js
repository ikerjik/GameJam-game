import {ScheduledState, Sprite} from "jetcode-scrubjs";
import {BulletSprite} from "./bullet.sprite";
import {Dangeon} from "../stages/dangeon.stage";

export class HeroSprite extends Sprite {
    static instance;

    moveSpeed = 3;
    stopTimer = 0;
    touchingWall = false;

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

        this.size = 400;

        this.forever(this.control);
        this.animationState = this.forever(this.animation, 200);
        this.animationState.action = 'idle';

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

        } else if (this.stopTimer > 70) {
            this.animationState.interval = 1;
            this.animationState.action = 'idle';

        } else {
            this.animationState.interval = 1;
            this.animationState.action = 'stop';
        }

        if (this.game.mouseDownOnce()) {
            this.animationState.interval = 1;
            this.animationState.action = 'attack';

            if (this.costumeIndex < 9) {
                this.switchCostume(9);
            }
        }

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

        if (this.touchingWall) {
            this.animationState.interval = 1;
            this.animationState.action = 'stop';
        }

        if (this.stage instanceof Dangeon) {
            if (this.y < 0) {
                this.y_on_map -= 1;
                this.y = this.stage.height;
                this.stage.renderRoom(this.stage.map, this.x_on_map, this.y_on_map);
            }

            if (this.y > this.stage.height) {
                this.y_on_map += 1;
                this.y = 0;
                this.stage.renderRoom(this.stage.map, this.x_on_map, this.y_on_map);
            }

            if (this.x < 0) {
                this.x_on_map -= 1;
                this.x = this.stage.width;
                this.stage.renderRoom(this.stage.map, this.x_on_map, this.y_on_map);
            }

            if (this.x > this.stage.width) {
                this.x_on_map += 1;
                this.x = 0;
                this.stage.renderRoom(this.stage.map, this.x_on_map, this.y_on_map);
            }
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

                if (this.costumeIndex === 12) {
                    state.action = 'idle';
                    this.attack();
                }

                break;
        }
    }

    attack() {
        const bullet = this.bullet.createClone();
        bullet.x = this.x;
        bullet.y = this.y;
        bullet.pointForward(this.game.getMousePoint());
        bullet.move(35);
        bullet.hidden = false;

        bullet.forever(this.bulletMove);
    }

    bulletMove(bullet) {
        bullet.move(10);
    }
}
