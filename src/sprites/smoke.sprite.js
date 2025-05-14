import {Sprite} from 'jetcode-scrubjs';

export class SmokeSprite extends Sprite {

    init() {
        this.addCostume('public/images/smoke/1.png');
        this.addCostume('public/images/smoke/2.png');
        this.addCostume('public/images/smoke/3.png');
        this.addCostume('public/images/smoke/4.png');
        this.addCostume('public/images/smoke/5.png');
        this.layer = 3;
        this.hidden = true;
        this.size = 170;
    }

    start() {
        this.hidden = false;
        this.forever(this.animation, 120);
    }

    animation(smoke){
        smoke.nextCostume();
        if (smoke.costumeIndex === 4) {
            smoke.delete();
        }
    }

}
