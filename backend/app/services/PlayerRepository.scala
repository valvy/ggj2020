package services
import java.sql.{Date, SQLException}

import play.api._
import play.api.db.Database
import javax.inject._
import models.{Game, Player}

import scala.concurrent.{ExecutionContext, Future}

@javax.inject.Singleton
class PlayerRepository @Inject() (db: Database)
                                 (implicit ec: ExecutionContext)  {
    val logger: Logger = Logger(this.getClass())


    private def generateRandomString(size : Int): String = {
         val builder = new StringBuilder;

         for(i <- 1 until size) {
             val START_ASCII = 97
             val END_ASCII = 122
             val MAX_KAR = END_ASCII - START_ASCII
             val randomCharacter = (Math.random() * 1000 % MAX_KAR) + START_ASCII
             builder.append(randomCharacter.toChar)
         }
        builder.toString
    }

    /**
     * Check if a game already exists in the database.
     * @param name
     */
    private def existsGame(name : String): Boolean = {
        val preparedStatement= db.getConnection().prepareStatement(
            "SELECT COUNT(*) as total FROM GAME WHERE URI = ?")
        preparedStatement.setString(1, name)
        val result = preparedStatement.executeQuery()
        result.next()
        val exists = result.getInt(1)
        exists == 1
    }



    def createGame() : Future[Game] = {
        // Create a Random game
        logger.info("Creating a new game.")
        Future {

            val connection = db.getConnection();
            // Make sure its a really random string.
            var randomString = ""
            do {
                val MAX_URI_LENGTH = 244
                randomString = generateRandomString(MAX_URI_LENGTH)
            } while (existsGame(randomString))

            // Insert a new game.
            val insertStatement = connection.prepareStatement(
                "INSERT INTO GAME" +
                  "(CREATED, URI, CLOSED)" +
                  "VALUES(NOW(),?,'0');"
            )

            insertStatement.setString(1, randomString)
            insertStatement.execute()
            val getStatement = connection.prepareStatement(
                "SELECT CREATED, URI, CLOSED FROM GAME WHERE URI = ?"
            )
            getStatement.setString(1, randomString)
            val finalResult = getStatement.executeQuery()
            finalResult.next()
            new Game(
                finalResult.getDate("CREATED"),
                finalResult.getString("URI"),
                finalResult.getBoolean("CLOSED")
            )
        }

    }

    def getPlayer(id : Int) : Future[Player] = {
        Future {
            Player(id, "test", 10)
        }
    }
}