import {Sprite} from "jetcode-scrubjs";

export class ButtonSprite extends Sprite {
    init(){


        this.forever(this.logic)
    }

    logic(){
        if (this.touchMouse()){
            this.size = (130 - this.size) / 3
        }
        else {
            this.size = (100 - this.size) / 3;
        }
    }
}