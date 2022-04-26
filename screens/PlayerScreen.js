import { Component, createRef } from 'react';
import { Dimensions, View, ScrollView, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { Modalize } from 'react-native-modalize';
import AppContext from '../AppContext';
import QueueScreen from './QueueScreen';

const SCREEN_HEIGHT = Dimensions.get('screen').height;
const PLAYER_SCREEN_HEIGHT = SCREEN_HEIGHT / 1.1;

export default class PlayerScreen extends Component {
    static contextType = AppContext;

    constructor() {
        super();
    }

    render() {
        return (
            <Modalize
                ref={this.context.playerScreenRef}
                modalHeight={PLAYER_SCREEN_HEIGHT}
                threshold={PLAYER_SCREEN_HEIGHT/4}
                velocity={100}
            >
                <View style = {{backgroundColor:"#ff0000", height: PLAYER_SCREEN_HEIGHT, width:"100%"}}>
                    <TouchableOpacity onPress={()=>this.context.queueScreenRef.current?.open('top')}>
                        <Text>press</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={()=>this.context.queueScreenRef.current?.close('alwaysOpen')}>
                        <Text>close</Text>
                    </TouchableOpacity>
                    <QueueScreen PLAYER_SCREEN_HEIGHT = {PLAYER_SCREEN_HEIGHT}/>
                </View>
            </Modalize>
        )
    }
}

const styles = StyleSheet.create({

});
