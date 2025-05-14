import {Sprite} from 'jetcode-scrubjs';
import {BulletSprite} from "./bullet.sprite";

export class AbstractEnemySprite extends Sprite {
    health = 1;

    init() {
        this.addTag('enemy');
    }

    hit() {
        this.health -= 1;

        if (this.health <= 0){
            this.stage.killEnemy(this.x, this.y);
            this.delete();
        }
    }
}
