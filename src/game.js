import {Game} from 'jetcode-scrubjs';

import {MenuStage} from './stages/menu.stage.js';
import {DungeonStage} from "./stages/dungeon.stage";


export const game = new Game(576, 576, null);

// const menuStage = new MenuStage();
// game.run(menuStage);

game.run(new DungeonStage());
