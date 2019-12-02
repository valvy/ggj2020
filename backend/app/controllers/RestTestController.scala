package controllers

import javax.inject._
import play.api.db.Database
import play.api.libs.json.Json
import play.api.mvc._

import sangria.schema._
import sangria.execution._
import sangria.macros._
import scala.concurrent.ExecutionContext.Implicits.global


@Singleton
class RestTestController @Inject()(db: Database, cc: ControllerComponents) extends AbstractController(cc) {


  def testApi = Action {
      val QueryType = ObjectType("Query", fields[Unit, Unit](
        Field("hello", StringType, resolve = _ ⇒ "Hello world!")
      ))

      val schema = Schema(QueryType)

      val query = graphql"{ hello }"

      val result = Executor.execute(schema, query)
      //result.foreach(res ⇒ println(res))
      result.
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


     Ok(Json.obj("id" -> outString))
  }

}
