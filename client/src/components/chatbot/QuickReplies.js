import React, { Component } from 'react';
import QuickReply from './QuickReply';

class QuickReplies extends Component {
    constructor(props) {
        super(props);
        this._handleClick = this._handleClick.bind(this);
    }

    _handleClick(event, payload, text) {
        this.props.replyClick(event, payload, text);
    }

    renderQuickReply(reply, i) {
        return <QuickReply key={i} click={this._handleClick} reply={reply} />;
    }

    renderQuickReplies(quickReplies) {
        if (quickReplies) {
            return quickReplies.map((reply, i) => {
                    return this.renderQuickReply(reply, i);
                }
            )
        } else {
            return null;
        }
    }

    render() {
        return (
            <div className="col s12 m8 offset-m2 l6 offset-l3">
                <div className="card-panel grey lighten-5 z-depth-1">
                    <div className="row">
                        <img className='col-3 rounded-circle' alt="bot" src={require('../img/bot.png')} style={{height:'50px', width: '80px'}} />
                        
                        <div id="quick-replies"  className="col-9">
                            {this.props.text && <p>
                                {this.props.text.stringValue}
                            </p>
                            }
                            {this.renderQuickReplies(this.props.payload)}
                            </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default QuickReplies;