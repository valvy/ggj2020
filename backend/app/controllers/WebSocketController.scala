package controllers

import akka.actor.{Actor, ActorRef, ActorSystem, Props}
import akka.stream.Materializer
import javax.inject.{Inject, Singleton}
import play.api.libs.json.JsValue
import play.api.libs.streams.ActorFlow
import play.api.mvc.{BaseController, ControllerComponents, WebSocket}
import services.PlayerRepository

import scala.concurrent.ExecutionContext

object MyWebSocketActor {
  def props(out: ActorRef) = Props(new MyWebSocketActor(out))
}

class MyWebSocketActor(out: ActorRef) extends Actor {
  def receive = {
    case msg: String =>
      out ! ("I received your message: " + msg)
  }
}

@Singleton
class WebSocketController @Inject()(
                                     val playerRepository: PlayerRepository,
                                     val controllerComponents: ControllerComponents)
                                   (
                                     implicit system: ActorSystem,
                                     mat: Materializer) extends BaseController {

  def socket = WebSocket.accept[String, String] { request =>
    ActorFlow.actorRef { out =>
      MyWebSocketActor.props(out)
    }
  }

}

