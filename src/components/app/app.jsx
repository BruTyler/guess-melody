import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import {connect} from "react-redux";
import {ActionCreator} from "../../reducer.js";

import {GameType} from "../../const.js";
import GameScreen from './../game-screen/game-screen.jsx';
import WelcomeScreen from './../welcome-screen/welcome-screen.jsx';
import QuestionGenreScreen from '../question-genre-screen/question-genre-screen.jsx';
import QuestionArtistScreen from '../question-artist-screen/question-artist-screen.jsx';
import withActivePlayer from '../../hocs/with-active-player/with-active-player.jsx';
import withUserAnswer from '../../hocs/with-user-answer/with-user-answer.jsx';
import GameOverScreen from '../game-over-screen/game-over-screen.jsx';
import GameWinScreen from '../game-win-screen/game-win-screen.jsx';

const QuestionGenreScreenWrapped = withActivePlayer(withUserAnswer(QuestionGenreScreen));
const QuestionArtistScreenWrapped = withActivePlayer(QuestionArtistScreen);

class App extends PureComponent {
  _renderGameScreen() {
    const {
      errorCount,
      questions,
      onUserAnswer,
      onWelcomeButtonClick,
      step,
      currentGameMistakes,
      onResetGame,
    } = this.props;
    const question = questions[step];

    if (step === -1) {
      return <WelcomeScreen
        error={errorCount}
        onWelcomeButtonClick={onWelcomeButtonClick}/>;
    } else if (currentGameMistakes >= errorCount) {
      return <GameOverScreen
        onReplayButtonClick={onResetGame}/>;
    } else if (step >= questions.length) {
      const correctAnswersCount = step - currentGameMistakes;
      return <GameWinScreen
        onReplayButtonClick={onResetGame}
        mistakesCount={currentGameMistakes}
        answeredQuestionsCount={correctAnswersCount}
      />;
    }

    if (question) {
      switch (question.type) {
        case (GameType.ARTIST):
          return (
            <GameScreen gameType={question.type}>
              <QuestionArtistScreenWrapped
                onAnswer={onUserAnswer}
                question={question}
              />
            </GameScreen>
          );
        case (GameType.GENRE):
          return (
            <GameScreen gameType={question.type}>
              <QuestionGenreScreenWrapped
                onAnswer={onUserAnswer}
                question={question}
              />
            </GameScreen>);
        default:
          return null;
      }
    }

    return null;
  }

  render() {
    return <BrowserRouter>
      <Switch>
        <Route exact path="/">
          {this._renderGameScreen()}
        </Route>
      </Switch>
    </BrowserRouter>;
  }
}

App.propTypes = {
  errorCount: PropTypes.number.isRequired,
  questions: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  onUserAnswer: PropTypes.func.isRequired,
  onWelcomeButtonClick: PropTypes.func.isRequired,
  onResetGame: PropTypes.func.isRequired,
  step: PropTypes.number.isRequired,
  currentGameMistakes: PropTypes.number.isRequired,
};

const mapStateToProps = (state) => ({
  questions: state.questions,
  step: state.step,
  errorCount: state.maxMistakes,
  currentGameMistakes: state.mistakes,
});

const mapDispatchToProps = (dispatch) => ({
  onWelcomeButtonClick() {
    dispatch(ActionCreator.incrementStep());
  },
  onUserAnswer(question, userAnswer) {
    dispatch(ActionCreator.incrementMistakes(question, userAnswer));
    dispatch(ActionCreator.incrementStep());
  },
  onResetGame() {
    dispatch(ActionCreator.resetGame());
  },
});

export {App};
export default connect(mapStateToProps, mapDispatchToProps)(App);
