package controllers

import javax.inject._
import play.api._
import play.api.libs.json._
import play.api.mvc._
import models.Player
import services.GameService
import models.ServerError
import scala.concurrent._

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

  def generateGame = Action { implicit request: Request[AnyContent] =>
    GameService.startGame
    Ok(Json.obj("Hello world" -> "Created a game"))
  }

  def joinGame  = Action { implicit request: Request[AnyContent] =>
    val data = GameService.joinPlayer
    if(data != -1) {
      Ok(Json.obj("id" -> data))
    } else {
      BadRequest(Json.toJson(ServerError(400,"Game is not in QR mode")))
    }
  }

  def playerCount = Action { implicit request: Request[AnyContent] =>

    Ok(Json.obj("Online" -> GameService.getAmountOfPlayers))
  }


  def getPlayerState(id: Int) = Action { implicit request: Request[AnyContent] =>

    Ok(Json.obj("PlayerInfo" -> GameService.getPlayer(id)))
  }

  def getGameOver = Action { implicit request: Request[AnyContent] =>
   // GameService.winnerAndOver
    Ok(Json.obj("adsf"->" adsf"))
  }

  def resetGame = Action {  implicit request: Request[AnyContent] =>
    GameService.resetGame
    Ok(Json.obj("action" -> "Reset succesfull"))
  }

  def setPlayerState(id : Int) = Action { implicit request: Request[AnyContent] =>
    val data = request.body.asJson
    try{
      Ok(Json.toJson( GameService.playCard(id, data.get("play").as[JsString].value, data.get("discard").as[JsString].value)))
    } catch {
      case e : NoSuchElementException => BadRequest(Json.toJson(ServerError(400,"Missing play or discard fields")))

    }
  }

}
