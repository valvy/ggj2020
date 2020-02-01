package controllers

import javax.inject._
import play.api._
import play.api.libs.json._
import play.api.mvc._
import models.Player
import services.GameService
import models.ServerError
import scala.concurrent._
import java.net.HttpURLConnection
import exceptions.GGJIllegalStateException

/**
  * This controller creates an `Action` to handle HTTP requests to the
  * application's home page.
  */
@Singleton
class GameController @Inject()(
                                  val controllerComponents: ControllerComponents
                                )
                                (implicit ec: ExecutionContext)
  extends BaseController {

  /**
    * Create a game. make sure it accepts everything.
    * Will throw a bad_request error when a game is already created.
    * @return Json if it was succesful
    */
  def generateGame = Action { implicit request: Request[AnyContent] =>
    try {
      GameService.startGame
      Ok(Json.obj("Action" -> "Created a game"))
    } catch{
      case e: GGJIllegalStateException => BadRequest(Json.toJson(ServerError(HttpURLConnection.HTTP_BAD_REQUEST, e.getMessage)))
    }
  }


  /**
    * Joins a game.
    * Will return a id. When this is called 4 times it will go to a next state.
    * @return json if it was succesful with the id
    */
  def joinGame  = Action { implicit request: Request[AnyContent] =>
    val data = GameService.joinPlayer
    if(data != -1) {
      Ok(Json.obj("id" -> data))
    } else {
      BadRequest(Json.toJson(ServerError( HttpURLConnection.HTTP_BAD_REQUEST,"Game is not in QR mode")))
    }
  }

  /**
    * How many players are registered.
    * Used to poll if enough players joined to progress.
    * This is a safe operation that is always callable
    * @return Json with amount of online players
    */
  def playerCount = Action { implicit request: Request[AnyContent] =>

    Ok(Json.obj("Online" -> GameService.getAmountOfPlayers))
  }


  /**
    * Get the json with all the players information
    * @param id integer of the player
    * @return
    */
  def getPlayerState(id: Int) = Action { implicit request: Request[AnyContent] =>

    if(id >= GameService.MAX_PLAYER_COUNT) {
      NotFound(Json.toJson(ServerError(HttpURLConnection.HTTP_NOT_FOUND,"This id does not exists")))
    } else {
      Ok(Json.obj("PlayerInfo" -> GameService.getPlayer(id)))
    }
  }


  def getPlayers = Action { implicit request: Request[AnyContent] =>
    Ok(Json.obj("Players" -> GameService.getPlayers))
  }

  /**
    * Check if the game is over
    * @return
    */
  def getGameOver = Action { implicit request: Request[AnyContent] =>

    Ok(Json.toJson(GameService.getGameOver))
  }

  def resetGame = Action {  implicit request: Request[AnyContent] =>
    GameService.resetGame
    Ok(Json.obj("action" -> "Reset succesfull"))
  }

  def setPlayerState(id : Int) = Action { implicit request: Request[AnyContent] =>
    val data = request.body.asJson
    try{
      Ok(Json.toJson( GameService.playCard(id, data.get("play").as[JsNumber].value.toInt, data.get("discard").as[JsNumber].value.toInt)))
    } catch {
      case e : NoSuchElementException => BadRequest(Json.toJson(ServerError( HttpURLConnection.HTTP_BAD_REQUEST,"Missing play or discard fields")))
      case e: GGJIllegalStateException =>BadRequest(Json.toJson(ServerError(HttpURLConnection.HTTP_BAD_REQUEST, e.getMessage)))

    }
  }

}
