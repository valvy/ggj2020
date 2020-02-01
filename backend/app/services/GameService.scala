package services
import models._
import scala.collection.mutable._
import play.api.{Logger}

object GameState extends Enumeration {
  type GameState = Value
  val NoGame, QRCode, Turn, CheckWinner = Value
}

/**
  * @author Heiko van der Heijden.
  *
  */
object GameService {

  private val logger: Logger = Logger(this.getClass())

  private var playerCount = 0

  private var winnerAndOver = Game(false, -1)

  private var state = GameState.NoGame

  private val MAX_PLAYER_COUNT = 4

  private val players : Array[Player] = new Array[Player](MAX_PLAYER_COUNT)

  //def getGameOver : Game {
   // winnerAndOver
  //}

  def startGame = {
    state = GameState.QRCode
  }

  def resetGame = {
    logger.warn("Resetting the server")
    state = GameState.NoGame
    logger.warn("Reset player count to zero")
    playerCount = 0
    CardPool.resetDeck
  }




  def playCard(id : Int, playCard : String, discardCard : String) : Player = {
    val player = players(id)
    var discardIndex = -1
    var playIndex = -1
    // check if the cards the player is doing exists.
    for (i <- 0 until player.holding.length) {
      if(player.holding(i).name.equals(discardCard)) {
          discardIndex = i
      } else if(player.holding(i).name.equals(playCard)) {
        playIndex = i
      }
    }

    // put the playcard into the holding.
    if(playIndex != -1) {

      val amountPlayedOfType = player.playedCards.count(x => {
        x.name.equals(playCard)
      })

      val amountOfRequiredType = player.mustMake.count(x => {
        x.name.equals(playCard)
      })

      if(amountOfRequiredType != amountPlayedOfType) {
        player.playedCards += player.holding(playIndex)
      } else {
        logger.warn(s"Discarding ${playCard}. Already maxed")
      }

      player.holding(playIndex) = CardPool.getCard
    }

    if(discardIndex != -1) {
      player.holding(discardIndex) = CardPool.getCard
    }

    /**
      * Check for winning condition
      */
    if(player.holding.length == player.mustMake.length) {
      winnerAndOver = new Game(true, player.id)
    }


    player
  }



  def joinPlayer : Int = {
    if(state == GameState.QRCode) {
      players(playerCount) = new Player(
        playerCount,
        Array(CardPool.getCard, CardPool.getCard, CardPool.getCard),
        new ArrayBuffer(),
        CardPool.createGoal
      )

      val oldValue = playerCount
      playerCount += 1

      if(playerCount == MAX_PLAYER_COUNT) {
        state = GameState.Turn
      }

      oldValue
    } else {
      -1
    }
  }

  def getAmountOfPlayers : Int = {
    playerCount
  }

  def getPlayer(id : Int): Player = {
    players(id)
  }




}