package models

import play.api.libs.json.Json
import scala.collection.mutable._




case class Card(name : String, description : String, effect: String, id : Int)




object Card {
  implicit val gameFormat = Json.format[Card]
}

case class Player(id: Int,
                  var holding : Array[Card],
                  playedCards: ArrayBuffer[Card],
                  mustMake: Array[Card],
                  effects: ArrayBuffer[Card],
                  var round: Int,
                  var lastCards : ArrayBuffer[Card]
                 )


object Player {
  implicit val personFormat = Json.format[Player]
}