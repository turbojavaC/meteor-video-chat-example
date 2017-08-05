import React from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { Layout, Icon } from 'antd';
const {Content} = Layout;
import {Header, Footer} from '../';
import { CallUsers } from '../../users';

class Wrapper extends React.Component{
    constructor(){
        super();
        Meteor.VideoCallServices.RTCConfiguration = {"iceServers":[{url:'stun:stun.l.google.com:19302'},
            {url:'stun:stun1.l.google.com:19302'},
            {url:'stun:stun2.l.google.com:19302'},
            {url:'stun:stun3.l.google.com:19302'},
            {url:'stun:stun4.l.google.com:19302'}]};
        Meteor.VideoCallServices.onReceivePhoneCall = (showChat) => {
            this.setState({
                showChat
            });
            Meteor.VideoCallServices.answerPhoneCall(this.refs.caller, this.refs.target);
        };
        this.state = {
          showChat:false
        };
    }
    callUser(showChat){
        const user = Meteor.users.findOne({
            _id:showChat
        });
        if(!user || !user.status.online)
            throw new Meteor.Error(500, "user offline");
        this.setState({
            showChat
        });
        Meteor.VideoCallServices.call(showChat, this.refs.caller, this.refs.target);
    }
    render(){
        const { WrapperContent } = this.props;

        return (  <Layout className="layout">
            <Header/>
            <Content style={{ padding: '0 50px' }}>
                <div style={{ background: '#fff', padding: 24, minHeight: 280 }}>
                    <CallUsers callUser={this.callUser.bind(this)}/>

                </div>
            </Content>
        <Footer/>
            <video ref="caller"/>
            <video ref="target"/>
        </Layout>);
    }
}
export default createContainer(()=>{
    if(!(Meteor.loggingIn() || Meteor.user()))
        FlowRouter.go("/login");
    return {

    };
}, Wrapper);