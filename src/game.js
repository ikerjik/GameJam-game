import {Game} from 'jetcode-scrubjs';

import {Dangeon} from "./stages/dangeon.stage";

export const game = new Game(768, 768);

const dangeon = new Dangeon();

game.run(dangeon);
