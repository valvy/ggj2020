
package controllers


import javax.inject.Inject

import play.api.routing.Router.Routes
import play.api.routing.SimpleRouter
import play.api.routing.sird._

/**
 * Routes and URLs to the PostResource controller.
 */
class PlayerRouter @Inject()(controller: PlayerController) extends SimpleRouter {
  val prefix = "/v1/posts"

  /*def link(id: PostId): String = {
    import io.lemonlabs.uri.dsl._
    val url = prefix / id.toString
    url.toString()
  }
*/
  override def routes: Routes = {
    case GET(p"/game") =>
      controller.createGame()
    case GET(p"/players") =>
      controller.index
    case POST(p"/players/$id<[0-9]+>") =>
      controller.process(id.toInt)
  }

}