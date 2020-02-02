package services

import models._
import scala.collection.mutable._
import exceptions.{GGJIllegalStateException, GGJPlayerNotFoundException}
import play.api.{Logger}
import scala.util.Random
import scala.util.control._


object GameState extends Enumeration {
  type GameState = Value
  val NoGame, QRCode, Turn, Over = Value
}

/**
  * @author Heiko van der Heijden.
  *         Service for managing the state of the game.
  *         Handling the players. their cards and effects.
  */
object GameService {
  private val logger: Logger = Logger(this.getClass())

  private var playerCount = 0

  private var winnerAndOver = Game(false, -1)

  private var state = GameState.NoGame

  val MAX_PLAYER_COUNT = 4

  private val players: Array[Player] = new Array[Player](MAX_PLAYER_COUNT)

  def getPlayers: Array[Player] = {
    players
  }

  def getGameOver: Game = {
    winnerAndOver
  }

  def startGame = {
    assertState(
      state == GameState.NoGame,
      "Start game can only be called at start"
    )

    state = GameState.QRCode
  }

  /**
    * Resets the game.
    * This is a static class.
    *
    * @return
    */
  def resetGame = {
    logger.warn("Resetting the server")
    state = GameState.NoGame
    logger.warn("Reset player count to zero")
    playerCount = 0
    for (i <- 0 until players.length) {
      players(i) = null
    }

    CardPool.resetDeck
  }

  private def deleteOAllfTypeCard(card: Card) = {
    for (player <- players) {
      deleteCard(player, card)
    }
  }


  def executeDisasterOnPlayers(disaster: String): Unit = {
    assertState(GameState.Turn == state, "You can't do a turn right now.")
    if (disaster.equals("Hurricane")) {
      deleteOAllfTypeCard(CardPool.getRandomDestroyCard)
    }
    else if (disaster.equals("Raiders")) {
      val player = getPlayerWithMostStuff()
      if (player.playedCards.length != 0) {
        val randomNr = Random.nextInt(player.playedCards.length)
        deleteCard(player, player.playedCards(randomNr))
      }
    }
  }

  def getPlayerWithMostStuff(): Player = {
    var index = 0

    for (i <- 1 until players.length) {
      if (players(i).playedCards.length > players(index).playedCards.length) {
        index = i
      }
    }
    players(index)

  }

  private def deleteCard(victim: Player, card: Card): Boolean = {
    var isDone = false
    for (i <- 0 until victim.playedCards.length) {
      if (victim.playedCards(i).name == card.name & !isDone) {
        // yeey the victim has this card.
        // Check for a shield
        var isSafed = false
        for (j <- 0 until victim.effects.length) {
          if (victim.playedCards(i).name.equals(victim.effects(j).name) && !isSafed) {
            isSafed = true
            // remove item from the effects.
            victim.effects.remove(j)

            logger.info(s"the victim of ${card.description} was ${victim.id} and lost a effect")
          }
        }

        if (!isSafed) {
          victim.playedCards.remove(i)
          isDone = true
          logger.info(s"the victim of ${card.description} was ${victim.id} and lost the element")
        }
      }
    }
    if (!isDone) {
      logger.warn("The destroy card was not used.....")

    }
    isDone
  }


  /**
    * Destroys a random card from one of the users...
    * This can be the same user as the one who casts it.
    *
    * @param id       The user casting this card
    * @param playCard Which card is casted.
    */
  private def executeRandomDestroyCard(id: Player, playCard: Card) = {
    // shuffle it in a random order
    val randomizedList = Random.shuffle(List(0, 1, 2, 3))
    var isDone = false
    for (i <- randomizedList) {
      if (!isDone) {
        isDone = deleteCard(players(i), playCard)

      }
    }


  }

  /**
    * Throw an exception when it currently is in an invalid state.
    *
    * @param as       the condition
    * @param errorMsg message in the exception
    */
  private def assertState(as: Boolean, errorMsg: String) = {
    if (!as) {
      throw new GGJIllegalStateException(errorMsg)
    }

  }

  def getIndexOfCard(player: Player, card: Int): Int = {
    var result = -1
    for (i <- 0 until player.holding.length) {
      if (player.holding(i).id == card) {
        result = i
      }
    }
    result
  }

  /**
    * Plays a specific card.
    *
    * @param id
    * @param playCard
    * @param discardCard
    * @return
    */
  def playCard(id: Int, playCard: Int, discardCard: Int): Player = {
    assertState(state == GameState.Turn, "You can't play a card right now.")

    val player = players(id)
    val discardIndex = getIndexOfCard(player, discardCard)
    val playIndex = getIndexOfCard(player, playCard)

    player.round += 1
    if (discardIndex == -1) {
      player.events += "Invalid Discard card"
      //  logger.info(s"Player ${player.id} has used a card that was his.. ignore the whole round all input..")
    }
    if (playIndex == -1) {
      player.events += "Invalid play card"
    }


    if (playIndex != -1) {
      //parseActionCard(player,playIndex)
      val typeOfPlayCard = player.holding(playIndex)

      logger.info(s"Player ${id} has played ${typeOfPlayCard.description}")
      player.events += s"Player has played ${typeOfPlayCard.description}"
      player.lastCards += player.holding(playIndex)
      // Make sure the lastCards is never more then 10
      if (player.lastCards.length > 10) {
        player.lastCards.remove(0)
      }


      // check if its a destroyable.
      if (typeOfPlayCard.effect.equals(CardPool.DESTROY_TAG)) {
        executeRandomDestroyCard(player, typeOfPlayCard)
      }
      // Its a create card.
      else if (typeOfPlayCard.effect.equals(CardPool.CREATE_TAG)) {
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
      else if (typeOfPlayCard.effect.equals(CardPool.SHIELD_TAG)) {
        // Check if there is already a shield
        val existsInEffects = player.effects.find(x => typeOfPlayCard.id == x.id)

        // Its only possible to do the shield when you have it build
        val haveTheItem = player.playedCards.find(x => typeOfPlayCard.name == x.name)

        if (existsInEffects == None && haveTheItem != None) {
          player.effects += typeOfPlayCard
        }
        if (haveTheItem == None) {
          logger.info(s"Player ${id} has casted ${typeOfPlayCard.description} but he did not repair it first and so it is ignored")

        }

      } else {
        logger.error(s"An unkown card has played. ${typeOfPlayCard.effect}")
        player.events += "Player has played an illegal card!"
        throw new GGJIllegalStateException("the server can't process this card")
      }
      // set a new card on that index.
      player.holding(playIndex) = CardPool.getCard

    }


    if (discardIndex != -1) {
      player.events += s"Player has succesfully discarded ${player.holding(discardIndex).description}"
      player.lastDiscardCards += player.holding(discardIndex)
      // Remove the last elements
      if (player.lastDiscardCards.length > 15) {
        player.lastDiscardCards.remove(0)
      }
      player.holding(discardIndex) = CardPool.getCard
    }

    /**
      * Check for winning condition
      */
    if (player.playedCards.length == player.mustMake.length) {
      logger.info(s"Player ${id} has won!!")
      player.events += "Player has won!"
      winnerAndOver = new Game(true, player.id)
      state = GameState.Over
    }
    // Remove the last elements
    if (player.events.length > 15) {
      player.events.remove(0)
    }

    player
  }

  def joinPlayer: Int = {
    if (state == GameState.QRCode) {
      players(playerCount) = new Player(
        playerCount,
        Array(CardPool.getCard, CardPool.getCard, CardPool.getCard),
        new ArrayBuffer(),
        CardPool.createGoal,
        new ArrayBuffer(),
        0,
        new ArrayBuffer(),
        new ArrayBuffer(),
        new ArrayBuffer()
      )

      logger.info(s"Player with id ${players(playerCount).id} has joined.")
      val oldValue = playerCount
      playerCount += 1
      if (playerCount == MAX_PLAYER_COUNT) {
        state = GameState.Turn
      }
      oldValue

    } else {
      -1
    }
  }

  def getAmountOfPlayers: Int = {
    playerCount
  }

  def getPlayer(id: Int): Player = {
    if (players(id) == null) {
      throw new GGJPlayerNotFoundException("Could not find the player")
    }
    players(id)
  }


}