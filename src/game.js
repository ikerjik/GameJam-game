import {Game} from 'jetcode-scrubjs';

import {MainStage} from './stages/main.stage.js';
import {Dangeon} from "./stages/dangeon.stage";

export const game = new Game(768, 768);

const mainStage = new MainStage();
const dangeon = new Dangeon();

game.run(dangeon);
