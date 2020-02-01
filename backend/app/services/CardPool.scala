package services
import models._
import play.api.{Logger}


object CardPool {

  private val logger: Logger = Logger(this.getClass())

  private val card_options = Array(
    "Create Roof",
    "Destroy Roof",
    "Create Window",
    "Destroy Window"
  )



  private var currentCard = 0

  private val AMOUNT_OF_CARDS = 200
  private var deck = new Array[String](AMOUNT_OF_CARDS)

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
      Card("Create Roof"),
      Card("Create Window")
    )
  }

  def getCard : Card ={
    val card = Card(deck(currentCard))
    currentCard += 1
    card
  }




}