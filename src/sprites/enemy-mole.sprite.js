import {Sprite} from 'jetcode-scrubjs';
import {BulletSprite} from "./bullet.sprite";

export class EnemyMoleSprite extends Sprite {
    directionX = 1;
    shotTimer = 0;
    health = 1;

    init() {
        this.name = 'EnemyBat';

        this.addCostumeGrid('public/images/enemy/mole/mole.png', {
            cols: 4,
            rows: 1
        });

        this.hidden = true;
        this.addTag('enemy');

        this.rotateStyle = 'leftRight';

        this.size = 400;
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
        bullet.run();
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
