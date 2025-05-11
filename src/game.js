import {Game} from 'jetcode-scrubjs';

import {MenuStage} from './stages/menu.stage.js';


export const game = new Game(768, 768);

const menuStage = new MenuStage();

game.run(menuStage);
