package controllers

import javax.inject.{Inject, Singleton}
import play.api.db.Database
import play.api.libs.json.Json
import play.api.mvc.{AbstractController, ControllerComponents}
import sangria.ast.Document
import sangria.execution.Executor
import sangria.schema.{Field, ObjectType, Schema, StringType, fields}
import sangria.macros._
import sangria.parser.{ParserConfig, QueryParser}

import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.Future


@Singleton
class GraphQLController   @Inject()(db: Database, cc: ControllerComponents) extends AbstractController(cc) {

  def graphQLAPI() = Action { request =>

      println(request.body.asJson);
      //val parsedResult = Document(request.queryString.toArray[String], GraphQLSchema.schema)
     // val parsedResult = QueryParser.parse(request.body.asJson.toString, ParserConfig.default)
     // println(parsedResult)
        //QueryParser.parseInput request.body
      val QueryType = ObjectType("Query", fields[Unit, Unit](
        Field("hello", StringType, resolve = _ ⇒ "Hello world!")
      ))

      val schema = Schema(QueryType)

      val query = graphql"{ hello }"
      //val query =  Document.pa( request.queryString)
      val result = Executor.execute(schema, query)

      //result.foreach(res ⇒ println(res))
      result.foreach(res => println(res))

      Ok(Json.obj("id" -> "test"))

  }


}
