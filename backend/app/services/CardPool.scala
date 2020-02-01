package services
import models._
import play.api.{Logger}


object CardPool {

  private val logger: Logger = Logger(this.getClass())


  val CREATE_TAG = "Create"
  val DESTROY_TAG = "Destroy"
  val SHIELD_TAG = "Shield"

  private val card_options = Array(
    Card("Roof", "Create roof", CREATE_TAG, 0),
    Card("Roof", "Destroy roof", DESTROY_TAG, 1),
    Card("Window", "Create Window", CREATE_TAG,2),
    Card("Window", "Destroy Window", DESTROY_TAG,3),
    Card("Roof", "Shield roof", SHIELD_TAG ,4),
    Card("Window", "Shield Window", SHIELD_TAG,5),
    Card("Door", "Create Door", CREATE_TAG,6),
    Card("Door", "Destroy Door", DESTROY_TAG,7),
    Card("Door", "Shield Door", SHIELD_TAG,8)
  )

  private var currentCard = 0

  private val AMOUNT_OF_CARDS = 200
  private var deck = new Array[Card](AMOUNT_OF_CARDS)

  def shuffleDeck = {
    logger.warn("Shuffling the deck!")


    for(i <- 0 until AMOUNT_OF_CARDS) {
      val randomNr = (Math.random() * 100) % card_options.length

      deck(i) = card_options(randomNr.toInt)
    }
  }

  shuffleDeck

  def resetDeck = {
    currentCard = 0
    shuffleDeck
  }


  def createGoal : Array[Card] = {
    return Array(
      card_options(0),
      card_options(2)
    )
  }

  def getCard : Card ={
    val card = deck(currentCard)
    currentCard += 1
    card
  }




}