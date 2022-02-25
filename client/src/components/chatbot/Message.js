import React from 'react';

const Message = (props) => {
    return (
        <div className='row w-100 '>
            {props.speaks === 'ITClan' &&
                <div className='row align-items-end m-2'>
                    <img className='col-2 rounded-circle' alt="bot" src={require('../img/bot.png')} style={{ height: '35px', width: '65px' }} />
                    <div className="col">
                        <div className="chat border-0">
                            <div className="yours messages">
                                <div className="message last">
                                    <span className="black-text ">
                                        {props.text}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            }

            {props.speaks === 'user' &&
                <div className='row align-items-end'>
                     <div className="col">
                        <div className="chat border-0">
                            <div className="mine messages">
                                <div className="message last">
                                    <span className="black-text ">
                                        {props.text}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <img className='col-2 rounded-circle' alt="user" src={require('../img/user.png')} style={{ height: '35px', width: '65px' }} />
                </div>
            }
        </div>
    );
};

export default Message;