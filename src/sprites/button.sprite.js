import {Sprite} from "jetcode-scrubjs";

export class ButtonSprite extends Sprite {
    init(){
        this.addCostume('../../public/images/button.png');

        this.forever(this.logic)
    }

    logic(){
        if (this.touchMouse()){
            this.size = (1800 - this.size) / 3
        }
        else {
            this.size = (1400 - this.size) / 3;
        }
    }
}