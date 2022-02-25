import React, { Component } from 'react';
import axios from "axios/index";
import Cookies from 'universal-cookie';
import { v4 as uuid } from 'uuid';
import Message from './Message';
import Card from './Card';
import QuickReplies from './QuickReplies';
import '../css/chatbot.css'


const cookies = new Cookies();
class Chatbot extends Component {
    messagesEnd;
    talkInput;
    constructor(props) {
        super(props);
        // This binding is necessary to make `this` work in the callback
        this._handleInputKeyPress = this._handleInputKeyPress.bind(this);
        this._handleQuickReplyPayload = this._handleQuickReplyPayload.bind(this);
        this.hide = this.hide.bind(this);
        this.show = this.show.bind(this);

        this.state = {
            messages: [],
            showBot: false,
        };
        if (cookies.get('userID') === undefined) {
            cookies.set('userID', uuid(), { path: '/' });
        }
    }


    async df_text_query(queryText) {
        let says = {
            speaks: 'user',
            msg: {
                text: {
                    text: queryText
                }
            }
        }
        this.setState({ messages: [...this.state.messages, says] })
        const res = await axios.post('/api/df_text_query', { text: queryText, userID: cookies.get('userID') })
        for (let msg of res.data.fulfillmentMessages) {
            says = {
                speaks: 'ITClan',
                msg: msg
            }
            this.setState({ messages: [...this.state.messages, says] })
        }
    };


    async df_event_query(eventName) {
        const res = await axios.post('/api/df_event_query', { event: eventName, userID: cookies.get('userID') })
        for (let msg of res.data.fulfillmentMessages) {
            let says = {
                speaks: 'ITClan',
                msg: msg
            }
            this.setState({ messages: [...this.state.messages, says] })
        }
    }


    componentDidMount() {
        this.df_event_query('Welcome');
    }


    componentDidUpdate() {
        this.messagesEnd.scrollIntoView(true, { behavior: "smooth", alignToTop: 'false' });

        if (this.talkInput) {
            this.talkInput.focus();
        }
    }

    show(event) {
        event.preventDefault();
        event.stopPropagation();

        this.setState({ showBot: true });
        this.componentDidUpdate()
    }

    hide(event) {
        event.preventDefault();
        event.stopPropagation();
        this.setState({ showBot: false });
    }


    _handleQuickReplyPayload(event, payload, text) {
        event.preventDefault();
        event.stopPropagation();

        this.df_text_query(text);
    }


    renderCards(cards) {
        return cards.map((card, i) => <Card key={i} payload={card.structValue} />);
    }


    renderOneMessage(message, i) {
        if (message.msg && message.msg.text && message.msg.text.text) {
            return <Message key={i} speaks={message.speaks} text={message.msg.text.text} />;
        }
        else if (message.msg && message.msg.payload.fields.cards) { //message.msg.payload.fields.cards.listValue.values

            return <div key={i} >
                <div className="card-panel grey lighten-5 z-depth-1">
                    <div style={{ overflow: 'hidden' }}>
                        <div style={{ overflowY: 'hidden' }}>
                            <div className='row' style={{ width: message.msg.payload.fields.cards.listValue.values.length * 270 }}>
                                {this.renderCards(message.msg.payload.fields.cards.listValue.values)}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        }
        else if (message.msg &&
            message.msg.payload &&
            message.msg.payload.fields &&
            message.msg.payload.fields.quick_replies) {
            return <QuickReplies
                text={message.msg.payload.fields.text ? message.msg.payload.fields.text : null}
                key={i}
                replyClick={this._handleQuickReplyPayload}
                speaks={message.speaks}
                payload={message.msg.payload.fields.quick_replies.listValue.values}
            />;
        }
    }


    renderMessages(returnedMessages) {
        if (returnedMessages) {
            return returnedMessages.map((message, i) => {
                return this.renderOneMessage(message, i);
            }
            )
        } else {
            return null;
        }
    }


    _handleInputKeyPress(e) {
        if (e.key === 'Enter') {
            this.df_text_query(e.target.value);
            e.target.value = '';
        }
    }


    render() {
        if (this.state.showBot) {
            return (
                <div style={{ minHeight: 600, maxHeight: 800, width: 400, position: 'absolute', bottom: 0, right: 0, border: '1px solid lightgray', margin: 50 }}>

                    <div className="blue" style={{ height: '60px' }}>
                        <div className="row">
                            <div className='col left align pt-2'>
                                <div className='icon-container'>
                                    <img className='bot-img' alt="bot" src={require('../img/bot.png')} />
                                    <div className='status-circle'></div>
                                </div>
                            </div>
                            <div className='col font-monospace white-font text-light'>
                                <div className='fs-4 text-uppercase center fw-bold lh-1 pt-2'>itclan</div>
                                <div className='center fw-lighter'>Online</div>
                            </div>
                            <div className='col right-align'>
                                <img type="button" className='btn-link ' src={require('../img/preferences.png')} alt="settings" height='25px' width='25px' />
                                <img type="button" className='btn-link m-3' src={require('../img/close.png')} alt="close" height='25px' width='25px' onClick={this.hide} />
                            </div>
                        </div>
                    </div>

                    <div style={{ minHeight: 588, maxHeight: 588, width: '100%', overflow: 'auto' }}>
                        {this.renderMessages(this.state.messages)}
                        <div ref={(el) => { this.messagesEnd = el; }}
                            style={{ float: "left", clear: "both" }}>
                        </div>
                    </div>

                    <div className="col s12" >
                        <input style={{ margin: 0, paddingLeft: '1%', paddingRight: '1%', width: '98%' }} ref={(input) => { this.talkInput = input; }} placeholder="type a message:" onKeyPress={this._handleInputKeyPress} id="user_says" type="text" />
                    </div>
                </div>
            );
        } else {
            return (
                <div className='border border-white m-5' style={{ minHeight: 40, maxHeight: 500, width: 100, position: 'absolute', bottom: 0, right: 0, border: '1px solid lightgray' }}>
                    <div ref={(el) => { this.messagesEnd = el; }}
                        style={{ float: "left", clear: "both" }}>
                    </div>
                    <img className='btn rounded-circle' onClick={this.show} alt="bot" src={require('../img/bot.png')} style={{ height: '50px', width: '80px' }} />

                </div>
            );
        }
    }




}
export default Chatbot;