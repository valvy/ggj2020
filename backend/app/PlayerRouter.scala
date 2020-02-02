
package controllers


import javax.inject.Inject

import play.api.routing.Router.Routes
import play.api.routing.SimpleRouter
import play.api.routing.sird._

/**
 * Routes and URLs to the PostResource controller.
 */
class PlayerRouter @Inject()(controller: GameController) extends SimpleRouter {
  override def routes: Routes = {
    case GET(p"/game/generate") =>
    controller.generateGame
    case GET(p"/game/join") =>
      controller.joinGame
    case GET(p"/game/player/count") =>
      controller.playerCount
    case GET(p"/game/player/$id<[0-9]+>") =>
      controller.getPlayerState(id.toInt)
    case POST(p"/game/player/$id<[0-9]+>") =>
      controller.setPlayerState(id.toInt)
    case DELETE(p"/game") =>
      controller.resetGame
    case GET(p"/game") =>
      controller.getGameOver
    case GET(p"/game/player") =>
      controller.getPlayers
    case PATCH(p"/game/player") =>
      controller.executeDisasterOnPlayers
    /*
    case GET(p"/game") =>
      controller.createGame()
    case GET(p"/players") =>
      controller.index
    case POST(p"/players/$id<[0-9]+>") =>
      controller.process(id.toInt)*/
  }

}