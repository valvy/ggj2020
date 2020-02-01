package services
import models._
import scala.collection.mutable._
import exceptions.GGJIllegalStateException
import play.api.{Logger}
import scala.util.Random

object GameState extends Enumeration {
  type GameState = Value
  val NoGame, QRCode, Turn, Over = Value
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

  val MAX_PLAYER_COUNT = 4

  private val players : Array[Player] = new Array[Player](MAX_PLAYER_COUNT)

  def getPlayers : Array[Player] = {
    players
  }

  def getGameOver : Game = {
    winnerAndOver
  }

  def startGame = {
    if(state != GameState.NoGame) {
      throw new GGJIllegalStateException("Start game can only be called at start")
    }
    state = GameState.QRCode
  }

  def resetGame = {
    logger.warn("Resetting the server")
    state = GameState.NoGame
    logger.warn("Reset player count to zero")
    playerCount = 0
    CardPool.resetDeck
  }

  private def executeDestroyCard(id : Player, playCard : Card) {
    // shuffle it in a random order
      val randomizedList = Random.shuffle(List(0,1,2,3))
      var isDone = false
      for(i <- randomizedList ) {
        val victim = players(i)
        // Check if the victim has the card.
        for(i <- 0 until victim.playedCards.length) {
          if(victim.playedCards(i).name == playCard.name & !isDone) {
            // yeey the victim has this card.
            // Check for a shield
            var isSafed = false
            for(j <- 0 until victim.effects.length) {
              if(victim.playedCards(i).name.equals(victim.effects(j).name) && !isSafed) {
                isSafed = true
                // remove item from the effects.
                victim.effects.remove(j)
                logger.warn(s"the victim of ${playCard.description} was ${victim.id} and lost a effect")
              }
            }

            if(!isSafed) {
              victim.playedCards.remove(i)
              isDone = true
              logger.warn(s"the victim of ${playCard.description} was ${victim.id} and lost the element")
            }

          }
        }

      }
    if(!isDone) {
      logger.warn("The destroy card was not used.....")
    }

  }




  def playCard(id : Int, playCard : Int, discardCard : Int) : Player = {

    if(state != GameState.Turn) {
      throw new GGJIllegalStateException("You can't play a card right now.")
    }


    val player = players(id)
    var discardIndex = -1
    var playIndex = -1

    // check if the cards the player is doing exists.
    for (i <- 0 until player.holding.length) {
      if(player.holding(i).id == discardCard) {
          discardIndex = i
       //   typeOfPlayCard = player.holding(i)
      } else if(player.holding(i).id == playCard) {
        playIndex = i
      }
    }

    // put the playcard into the holding.
    if(playIndex != -1) {

      val typeOfPlayCard = player.holding(playIndex)

      player.lastCards +=  player.holding(playIndex)
      // check if its a destroyable.
      if(typeOfPlayCard.effect.equals("Destroy")) {
        executeDestroyCard(player, typeOfPlayCard)
      }
      // Its a create card.
      else if (typeOfPlayCard.effect.equals("Create")) {
        val amountPlayedOfType = player.playedCards.count(x => {
          x.id == playCard
        })

        val amountOfRequiredType = player.mustMake.count(x => {
          x.id == playCard
        })

        if (amountOfRequiredType != amountPlayedOfType) {
          player.playedCards += player.holding(playIndex)
        } else {
          logger.warn(s"Discarding ${playCard}. Already maxed")
        }
      }
        // Check if
      else if(typeOfPlayCard.effect.equals("Shield")) {
        // Check if there is already a shield
        val dat = player.effects.find(x => typeOfPlayCard.effect == x)
        if(dat == None) {
          player.effects += typeOfPlayCard
        }

      } else {
        logger.error(s"An unkown card has played. ${typeOfPlayCard.effect}")
        throw new GGJIllegalStateException("the server can't process this card")
      }
      // set a new card on that index.
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
      state = GameState.Over
    }
    player.round += 1



    player
  }

  def joinPlayer : Int = {
    if(state == GameState.QRCode) {
      players(playerCount) = new Player(
        playerCount,
        Array(CardPool.getCard, CardPool.getCard, CardPool.getCard),
        new ArrayBuffer(),
        CardPool.createGoal,
        new ArrayBuffer(),
        0,
        new ArrayBuffer()
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