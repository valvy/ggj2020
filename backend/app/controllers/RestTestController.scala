package controllers

import javax.inject._

import play.api.libs.json.Json
import play.api.mvc._



@Singleton
class RestTestController @Inject()(cc: ControllerComponents) extends AbstractController(cc) {

  /**
   * Create an action that responds with the [[Counter]]'s current
   * count. The result is plain text. This `Action` is mapped to
   * `GET /count` requests by an entry in the `routes` config file.
   */
  def testApi = Action {
     Ok(Json.obj("id" -> "3"))
  }

}
