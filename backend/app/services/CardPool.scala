package services
import models._
import play.api.{Logger}
import scala.util.Random

object CardPool {

  private val logger: Logger = Logger(this.getClass())


  val CREATE_TAG = "Create"
  val DESTROY_TAG = "Destroy"
  val SHIELD_TAG = "Shield"

  private val card_options = Array(
    Card("Window", "Create Window", CREATE_TAG,0),
    Card("Window", "Destroy Window", DESTROY_TAG,1),
    Card("Window", "Shield Window", SHIELD_TAG,2),
    Card("Roof", "Create roof", CREATE_TAG, 3),
    Card("Roof", "Destroy roof", DESTROY_TAG, 4),
    Card("Roof", "Shield roof", SHIELD_TAG ,5),
    Card("Door", "Create Door", CREATE_TAG,6),
    Card("Door", "Destroy Door", DESTROY_TAG,7),
    Card("Door", "Shield Door", SHIELD_TAG,8)
  )

  private var currentCard = 0

  private val AMOUNT_OF_CARDS = 108
  private val AMOUNT_OF_WINDOWS = 6 * 3 * 3
  private val AMOUNT_OF_REST = 3
  private var deck = new Array[Card](AMOUNT_OF_CARDS)

  for(i <- 0 until AMOUNT_OF_WINDOWS) {

     deck(i) = card_options((i % 3))
  }


  for( i <- AMOUNT_OF_WINDOWS until  deck.length ) {
    deck(i) = card_options((i % 6) + 3)
  }

  def shuffleDeck = {
    logger.warn("Shuffling the deck!")
    deck = Random.shuffle(deck.toSeq).toArray
  }

  shuffleDeck

  def resetDeck = {
    currentCard = 0
    shuffleDeck
  }


  def createGoal : Array[Card] = {
    return Array(
      card_options(0),
      card_options(0),
      card_options(3),
      card_options(7)
    )
  }

  def getCard : Card ={
    val card = deck(currentCard)
    if(currentCard >= deck.length) {
      resetDeck
    } else {
      currentCard += 1
    }
    card
  }




}