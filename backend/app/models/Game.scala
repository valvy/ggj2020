package models

import java.sql.Date

import play.api.libs.json.Json

case class Game(date: Date, URI: String, closed: Boolean)


object Game {
  implicit val gameFormat = Json.format[Game]
}