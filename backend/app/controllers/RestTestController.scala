package controllers

import javax.inject._
import play.api.db.Database
import play.api.libs.json.Json
import play.api.mvc._


@Singleton
class RestTestController @Inject()(db: Database, cc: ControllerComponents) extends AbstractController(cc) {


  def testApi(id: String) = Action {

      var outString = ""
      val conn      = db.getConnection()

      try {
        val stmt = conn.createStatement
        val rs   = stmt.executeQuery("SELECT * from PERSON")

        while (rs.next()) {
          outString += rs.getString("NAME")
        }
      } finally {
        conn.close()
      }


     Ok(Json.obj("id" -> outString, "test" -> id))
  }

}
