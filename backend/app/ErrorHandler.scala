import java.net.HttpURLConnection

import play.api.http.HttpErrorHandler
import play.api.mvc._
import play.api.mvc.Results._

import scala.concurrent._
import javax.inject.Singleton
import play.api.libs.json.Json
import models.ServerError
import play.api.{Logger}

/**
 * @author Heiko van der Heijden
 *         Handles errors and servers a json error.
 */
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

  override def onServerError(request: RequestHeader, exception: Throwable) = {
    logger.error("An exception on the server has occured.", exception)
    Future.successful(
      InternalServerError(Json.toJson(
        ServerError(
          HttpURLConnection.HTTP_INTERNAL_ERROR,
          "Something unexpected has happened"
        ))
      )
    )
  }
}