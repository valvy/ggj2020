package models

import play.api.libs.json.Json
import scala.collection.mutable._




case class Card(name : String)




object Card {
  implicit val gameFormat = Json.format[Card]
}

case class Player(id: Int,
                  holding : Array[Card],
                  playedCards: ArrayBuffer[Card],
                  mustMake: Array[Card]
                 )


object Player {
  implicit val personFormat = Json.format[Player]
}