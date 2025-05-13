import {Sprite} from 'jetcode-scrubjs';
import {BulletSprite} from "./bullet.sprite";
import {AbstractEnemySprite} from "./abstract-enemy.sprite";

export class MoleEnemySprite extends AbstractEnemySprite {
    shotTimer = 0;
    attackTimer = 10;
    health = 1;

    init() {
        super.init();
        this.name = 'EnemyBat';

        this.addCostumeGrid('public/images/enemy/mole.png', {
            cols: 4,
            rows: 1
        });

        this.hidden = true;
        this.addTag('enemy');

        this.rotateStyle = 'leftRight';

        this.size = 300;
    }

    start() {
        this.bullet = new BulletSprite(this.stage);
        this.bullet.hidden = true;
        this.bullet.layer = 2;

        this.shotTimer = this.game.getRandom(0, 100);
        this.hidden = false;

        this.forever(this.moving);
        this.forever(this.animation, 100);
    }

    moving() {
        this.shotTimer++;

        if (this.stage.hero && this.shotTimer >= 150 && this.stage.hero) {
            this.pointForward(this.stage.hero);
            this.shot();
            this.shotTimer = this.shotTimer = this.game.getRandom(0, 5);
        }

        if (this.attackTimer > 50 && this.stage.hero && this.touchSprite(this.stage.hero)) {
            this.otherSprite.hit();
            this.attackTimer = 0;
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
        bullet.move(7);

        if (bullet.touchEdge()) {
            bullet.delete();

        } else if (this.stage.hero && bullet.touchSprite(this.stage.hero)) {
            this.otherSprite.hit();
            bullet.delete();

        } else if (bullet.touchTag('wall')) {
            bullet.delete();
        }
    }

}
