import {Sprite} from 'jetcode-scrubjs';
import {BulletSprite} from "./bullet.sprite";

export class EnemyBatSprite extends Sprite {
    directionX = 1;
    shotTimer = 0;

    init() {
        this.name = 'EnemyBat';

        this.addCostumeGrid('public/images/enemy/bat/bat.png', {
            cols: 4,
            rows: 1
        });

        this.addTag('enemy');

        this.bullet = new BulletSprite(this.stage);
        this.bullet.hidden = true;
        this.bullet.layer = 2;

        this.size = 400;
        this.rotateStyle = 'leftRight';
        this.direction = 90;
        this.forever(this.moving);
        this.forever(this.animation, 100);
    }

    moving() {
        this.shotTimer++;
        this.x += this.directionX * 5;

        if (this.touchTag('wall') || this.touchEdge()) {
            this.directionX *= -1;
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
        const bullet = this.bullet.createClone();
        bullet.x = this.x;
        bullet.y = this.y;
        bullet.pointForward(this.stage.hero);
        bullet.move(35);
        bullet.hidden = false;

        bullet.forever(this.bulletMove);
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

}
