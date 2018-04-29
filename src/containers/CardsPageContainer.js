import React, {Component} from 'react'
import DeckAdapter from '../adapters/DeckAdapter'
import Card from './Card'
import CardsContainer from './CardsContainer'
import CardAdapter from '../adapters/CardAdapter'
import CardForm from './CardForm'

export default class CardsPageContainer extends Component {

  constructor(props){
    super(props);

    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleInput = this.handleInput.bind(this)
    this.formState = this.formState.bind(this)
  }

  state = {
    cards: [],
    title: '',
    question: '',
    answer: '',
  }

  handleInput(e){
    this.setState({
      [e.target.name]: e.target.value
    }, console.log(this.state))
  }

  formState(){
    return {title: this.state.title, question: this.state.question, answer: this.state.answer, deckId: this.props.match.params.deckId}
  }

  handleSubmit(e){
    e.preventDefault()
    //Add submitting behavior
    CardAdapter.post(this.formState()).then( rsp => rsp.json())
    .then( json => {
      //new card is created
      let newCard = (<Card key={json.id} answer={json.answer} question={json.question} title={json.title} />)
      debugger
      this.setState( prevState => {
        console.log(prevState.cards)
        debugger
        return {
          cards: [...prevState.cards,newCard]
        }
      })
    })
  }


  componentDidMount(){
    DeckAdapter.get(this.props.match.params.deckId).then( res => res.json())
    .then( json => {
      let data = json.map( card => <Card key={card.id} answer={card.answer} question={card.question} title={card.title} />)
      this.setState({
        cards: data
      })
    })
  }

  render(){
    return(
      <div>
        <CardForm deckId={this.props.match.params.deckId} handleChange={this.handleInput} submitFunction = {this.handleSubmit}/>
        <CardsContainer {...this.props} cards={this.state.cards} handleSubmit={this.handleSubmit}/>
      </div>
    )
  }
}
