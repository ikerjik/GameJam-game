import {Game} from 'jetcode-scrubjs';

import {MenuStage} from './stages/menu.stage.js';
import {DungeonStage} from "./stages/dungeon.stage";
import {IntroStage} from "./stages/intro.stage";


export const game = new Game(576, 576, null);


/**
 * Load stages
 */

MenuStage.getInstance();
IntroStage.getInstance();
DungeonStage.getInstance();

game.run(MenuStage.getInstance());
// game.run(IntroStage.getInstance());
// game.run(DungeonStage.getInstance());
