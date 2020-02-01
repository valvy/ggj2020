package models

import java.sql.Date

import play.api.libs.json.Json

case class Game(over : Boolean, winner : Int)


object Game {
  implicit val gameFormat = Json.format[Game]
}