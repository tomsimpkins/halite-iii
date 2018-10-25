const hlt = require('./hlt');
const {Direction, Position} = require('./hlt/positionals');
const logging = require('./hlt/logging');
const GameMapMixin = require("./src/GameMapMixin.js")

const { GameMap } = hlt
Object.assign(GameMap.prototype, GameMapMixin)

const game = new hlt.Game();
game.initialize().then(async() => {
  // At this point "game" variable is populated with initial map data.
  // This is a good place to do computationally expensive start-up pre-processing.
  // As soon as you call "ready" function below, the 2 second per turn timer will start.
  const { gameMap, me } = game

  let i, j

  logging.info(`Shipyard: ${me.shipyard.position.toString()}`)
  for (i = 0; i < gameMap.width; i++) {
    for (j = 0; j < gameMap.height; j++) {
      gameMap.cheapestPath(new Map(), me.shipyard.position, new Position(i, j))
    }
  }

  const collectionInNTurns = (h, n) => n > 0 ? 0.25  * h + collectionInNTurns(0.75 * h, n - 1) : 0

  await game.ready('MyJavaScriptBot');

  logging.info(`My Player ID is ${game.myId}.`);

  while (true) {
    await game.updateFrame();

    logging.info("what")

    // const { gameMap, me } = game;

    const commandQueue = [];

    for (const ship of me.getShips()) {
      if (ship.haliteAmount > hlt.constants.MAX_HALITE / 2) {
        const destination = me.shipyard.position;
        const safeMove = gameMap.naiveNavigate(ship, destination);
        commandQueue.push(ship.move(safeMove));
      }
      else if (gameMap.get(ship.position).haliteAmount < hlt.constants.MAX_HALITE / 10) {
        const direction = Direction.getAllCardinals()[Math.floor(4 * Math.random())];
        const destination = ship.position.directionalOffset(direction);
        const safeMove = gameMap.naiveNavigate(ship, destination);
        commandQueue.push(ship.move(safeMove));
      }
    }

    if (game.turnNumber < 0.75 * hlt.constants.MAX_TURNS &&
      me.haliteAmount >= hlt.constants.SHIP_COST && !gameMap.get(me.shipyard).isOccupied) {
      commandQueue.push(me.shipyard.spawn());
    }

    await game.endTurn(commandQueue);
  }
});
