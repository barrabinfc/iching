import isEmpty from 'lodash/isEmpty';

import { Component } from 'preact';
import { connect } from 'preact-redux';

import CSSTransitionGroup from 'react-transition-group/CSSTransitionGroup'

import { withRouter } from 'react-router'

import { getHexagram } from '../../constants/IchingLookup';
import { getAsset } from '../../constants/utils';

import * as actions from '../../actions/play';

import HexagramInfoCard from '../../components/HexagramInfoCard';

class PlayPage extends Component {

  constructor(props) {
    super(props)
    console.log("PlayPage CONSTRUCTOR!")
  }

  getInitialState(){
    return { already_played: false }
  }

  render() {
    return (
      <div className="playpage-container">

        <CSSTransitionGroup className="iching-card" transitionName="hexagram-preview"
          transitionEnterTimeout={0} transitionLeaveTimeout={0} >
          {this.renderPreviewCard({onClick: this.goToHexagram.bind(this)})}
        </CSSTransitionGroup>

        <div className="canvas">
          <div className="infoArea">
            <CSSTransitionGroup transitionName="question" 
              transitionEnterTimeout={400} transitionLeaveTimeout={0} >
                  {this.renderQuestion()}
            </CSSTransitionGroup>
          </div>

          <div className="ichingDragArea">
            <button className="gongo" ref={el => this.gongo = el}
              onPointerDown={this.onGongoHold} aria-label="Play" />
            <audio ref={el => this.gongosound = el} src={getAsset('audio/bell-resonanceG.mp3')} preload="auto" />
          </div>
        </div>

      </div>
    );
  }

  renderPreviewCard( opts={} ) {
    let { hexagram } = this.props;
    
    if (!isEmpty(hexagram)) {
      return (<HexagramInfoCard key={hexagram.number} 
                                hexagram={hexagram} 
                                display_trigrams 
                                {...opts} />);
    } else {
      return (false);
    }
  }

  renderQuestion() {
    if (!this.state.already_played) {
      return (
        <div className="question">
          <h2 className="title" key="question">Concentrate and ask a question</h2>
        </div>
      )
    }
  }

  onGongoHold = (ev) => {
    this.gongo.className = 'gongo down';
    window.addEventListener('pointerup', this.onGongoRelease);
  }

  onGongoRelease = (ev) => {
    window.removeEventListener('pointerup', this.onGongoRelease);

    // add animation
    this.gongo.className = 'gongo hit';

    // play sound
    if(this.props.preferences['enable_gongosound']){
      let au = this.gongosound;
      if (au.play) {
        au.currentTime = 0.0;
        au.play();
      }
    }

    this.props.clearHexagram();

    setTimeout( () => {
       //window.store.dispatch(HexagramActions.clearHexagram());
      this.props.generateHexagram().then( () => {
        this.setState({already_played: true})
        this.goToHexagram()
      })
    }, this.props.animation_timeout);
  }

  goToHexagram = () => {
    this.props.history.push(`/details/${this.props.hexagram.number}`);
  }

}

PlayPage.defaultProps = {
  hexagram: {},
  animation_timeout: 300
};


export default withRouter(
  connect(
    state => ({ 
      hexagram: getHexagram( state.play_hexagram ),
      preferences: state.preferences 
    }),
    dispatch => ({
        generateHexagram: () => (dispatch(actions.generateHexagram())),
        clearHexagram: () => {
          dispatch(actions.clearHexagram()); 
        }
    })
  )(PlayPage)
);