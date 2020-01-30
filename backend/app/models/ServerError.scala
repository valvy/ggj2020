package models

import play.api.libs.json.Json

case class ServerError(code: Long, msg: String)

/**
 * @author Heiko van der Heijden
 *         An uniform error, when something weird has happened
 **/
object ServerError {
  implicit val errorFormat = Json.format[ServerError]
}