package controllers

import javax.inject._
import play.api._
import play.api.libs.json.Json
import play.api.mvc._
import models.Player
import services.PlayerRepository

import scala.concurrent._

/**
 * This controller creates an `Action` to handle HTTP requests to the
 * application's home page.
 */
@Singleton
class PlayerController @Inject()(
                                  val playerRepository: PlayerRepository,
                                  val controllerComponents: ControllerComponents
                                )
                                (implicit ec: ExecutionContext)
                                extends BaseController {

  def createGame() = Action.async { implicit request: Request[AnyContent] =>
    //Ok(Json.obj("Action" ->"GET", "test" -> "test"))
/*    Ok(Json.toJson(
      Player(1, "Heiko", 28)
    ))*/
    playerRepository.createGame().map( data =>
      Ok(Json.toJson(data))
    )
  }
  def index : Action[AnyContent] = Action.async { implicit request =>
      //Ok(Json.obj("Action" ->"GET", "test" -> "test"))

      Future.successful(
        Ok(Json.toJson(
          Player(1, "Heiko", 28)
        ))
      )



  
  
  }

  def process(id: Int) = Action { implicit request: Request[AnyContent] =>

      val dat = request.body.asJson.get("hello")
      Ok(Json.obj("id" ->"POST", "test" -> id, "data"-> dat))
  }



}
