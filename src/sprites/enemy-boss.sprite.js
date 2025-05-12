import {Sprite} from 'jetcode-scrubjs';
import {BulletSprite} from "./bullet.sprite";

export class BossSprite extends Sprite {
    shotTimer = 0;
    xSpeed = this.game.getRandom(-5, 5);
    ySpeed = this.game.getRandom(-5, 5);
    health = 5;

    init() {
        this.name = 'EnemyBat';

        this.addCostumeGrid('public/images/enemy/bat/bat.png', {
            cols: 4,
            rows: 1
        });

        this.hidden = true;
        this.addTag('enemy');

        this.size = 400;
        this.direction = this.game.getRandom(0, 360);
    }

    start() {
        this.bullet = new BulletSprite(this.stage);
        this.bullet.hidden = true;
        this.bullet.layer = 2;

        this.hidden = false;

        this.forever(this.moving);
        this.forever(this.animation, 100);
    }

    moving() {
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

    animation() {
        this.nextCostume();
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
        console.log('bul move');
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

}
