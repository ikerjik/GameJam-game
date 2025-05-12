import {Sprite} from 'jetcode-scrubjs';
import {BulletSprite} from "./bullet.sprite";

export class BedbugEnemySprite extends Sprite {
    health = 1;
    attackTimer = 10;

    init() {
        this.name = 'EnemyBat';

        this.addCostumeGrid('public/images/enemy/bedbug.png', {
            cols: 4,
            rows: 1
        });

        this.hidden = true;
        this.addTag('enemy');

        this.size = 400;
        this.rotateStyle = 'leftRight';
        this.direction = 90;
    }

    start() {
        this.hidden = false;

        this.forever(this.moving);
        this.forever(this.animation, 100);
    }

    moving() {
        this.attackTimer++;

        this.pointForward(this.stage.hero);
        this.move(1);

        if (this.attackTimer > 50 && this.touchSprite(this.stage.hero)) {
            this.otherSprite.hit();
            this.attackTimer = 0;
        }
    }

    animation() {
        this.nextCostume();
    }
}
