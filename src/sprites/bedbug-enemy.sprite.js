import {Sprite} from 'jetcode-scrubjs';
import {BulletSprite} from "./bullet.sprite";
import {OutroStage} from "../stages/outro.stage";
import {AbstractEnemySprite} from "./abstract-enemy.sprite";

export class BedbugEnemySprite extends AbstractEnemySprite {
    health = 2;
    attackTimer = 10;

    init() {
        super.init();
        this.name = 'EnemyBat';

        this.addCostumeGrid('public/images/enemy/bedbug.png', {
            cols: 4,
            rows: 1
        });

        this.hidden = true;
        this.addTag('enemy');

        this.size = 300;
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
