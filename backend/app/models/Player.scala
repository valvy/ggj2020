package models
import play.api.libs.json.Json

case class Player(id: Long, name: String, score: Int)


object Player {  
  implicit val personFormat = Json.format[Player]
}