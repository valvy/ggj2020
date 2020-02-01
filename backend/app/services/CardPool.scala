package services
import models._
import play.api.{Logger}


object CardPool {

  private val logger: Logger = Logger(this.getClass())

  private val card_options = Array(
    Card("Roof", "Create roof", "Create", 0),
    Card("Roof", "Destroy roof", "Destroy", 1),
    Card("Window", "Create Window", "Create",2),
    Card("Window", "Destroy Window", "Destroy",3),
    Card("Roof", "Shield roof", "Shield" ,4),
    Card("Window", "Shield Window", "Shield",5)
    /*
      shield roof = 4
      shield window = 5
      create door = 6
      destory door = 7
      shield door 8
     */
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