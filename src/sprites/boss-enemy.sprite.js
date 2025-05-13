import {Sprite} from 'jetcode-scrubjs';
import {BulletSprite} from "./bullet.sprite";
import {OutroStage} from "../stages/outro.stage";
import {AbstractEnemySprite} from "./abstract-enemy.sprite";

export class BossEnemySprite extends AbstractEnemySprite {
    shotTimer = 0;
    xSpeed = this.game.getRandom(-5, 5);
    ySpeed = this.game.getRandom(-5, 5);
    health = 25;
    die = false;
    dieTimer = 0;

    init() {
        super.init();
        this.name = 'EnemyBat';

        this.addCostumeGrid('public/images/enemy/mouse.png', {
            cols: 4,
            rows: 1
        });

        this.hidden = true;
        this.addTag('enemy');
        this.rotateStyle = 'leftRight';

        this.size = 600;
        this.direction = this.game.getRandom(0, 360);
    }

    start() {
        this.bullet = new BulletSprite(this.stage);
        this.bullet.hidden = true;
        this.bullet.layer = 2;
        this.die = false;
        this.dieTimer = 0;

        this.hidden = false;

        this.forever(this.moving);
        this.forever(this.animation, 100);
        this.pen(this.drawUI.bind(this));
    }

    moving() {
        if (this.die) {
            return;
        }

        this.shotTimer++;
        this.x += this.xSpeed;
        this.y += this.ySpeed;
        this.direction = Math.hypot(this.xSpeed, this.ySpeed) * 180 / Math.PI;

        if (this.touchTag('wall') || this.touchEdge()) {
            this.x -= this.overlapX;
            this.y -= this.overlapY;
            this.xSpeed = this.game.getRandom(-5, 5);
            this.ySpeed = this.game.getRandom(-5, 5);
        }

        if (this.stage.hero && this.shotTimer > 100) {
            this.pointForward(this.stage.hero);
            this.shot();
            this.shotTimer = 0
        }
    }

    animation(sprite, animationState) {
        if (!this.die) {
            this.nextCostume();

        } else {
            animationState.interval = 150;
            this.hidden = !this.hidden;

            this.dieTimer++;
            if (this.dieTimer > 15) {
                const game = this.game;

                this.stage.killEnemy();
                this.delete();

                game.run(OutroStage.getInstance());
            }
        }
    }

    shot() {
        for (let i = 0; i < 8; i++) {
            const bullet = this.bullet.createClone();
            bullet.x = this.x;
            bullet.y = this.y;
            bullet.direction = i * 45;
            bullet.move(35);
            bullet.hidden = false;

            bullet.forever(this.bulletMove);
            bullet.run();
        }
    }

    bulletMove(bullet) {
        bullet.move(10);

        if (bullet.touchEdge()) {
            bullet.delete();

        } else if (bullet.touchTag('wall')) {
            bullet.delete();

        } else if (bullet.touchTag('player')) {
            this.otherSprite.hit();
            bullet.delete();
        }
    }

    hit() {
        if (this.die) {
            return
        }

        this.health -= 1;

        if (this.health <= 0){
            this.die = true;
        }
    }

    drawUI(context, hero) {
        // HP
        context.font = 'bold 18px Arial';
        context.fillStyle = 'black';
        context.fillText('Boss:', 35, this.stage.height - 30);

        context.fillStyle = '#696969';
        context.fillRect(95, this.stage.height - 45, 180, 16);
        context.fillStyle = 'red';
        context.fillRect(95, this.stage.height - 45, 180 * this.health * 4 / 100, 16);
        context.strokeStyle = 'black';
        context.strokeRect(95, this.stage.height - 45, 180, 16);
    }

}
