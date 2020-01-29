import play.api.http.HttpErrorHandler
import play.api.mvc._
import play.api.mvc.Results._

import scala.concurrent._
import javax.inject.Singleton
import play.api.libs.json.Json
import models.ServerError
import play.api.Logger

@Singleton
class ErrorHandler extends HttpErrorHandler {

  val logger: Logger = Logger(this.getClass())

  def onClientError(request: RequestHeader, statusCode: Int, message: String) = {
    Future.successful(
      Status(statusCode)(Json.toJson(
          ServerError(statusCode, message)
          )
    )
    )
  }

  def onServerError(request: RequestHeader, exception: Throwable) = {
    logger.error("exception", exception)
    Future.successful(
      InternalServerError(Json.toJson(
          ServerError(500, "Something unexpected has happened")
          )
      )
    )
  }
}