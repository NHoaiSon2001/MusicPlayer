import { useContext } from "react";
import { Modal, Text, View, StyleSheet } from "react-native";
import AppContext from "../utils/context/AppContext";

const Message = () => {
    const appContext = useContext(AppContext);

    return (
        <Modal
            animationType="face"
            transparent={true}
            visible={appContext.messageVisible}
        >
            <View style={styles.centeredView}>
                <View style={styles.modalView}>
                    <Text>{appContext.message}</Text>
                </View>
            </View>
        </Modal>
    )
}

export default Message;

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: "flex-end",
        alignItems: "center",
        marginBottom: 60,
    },
    modalView: {
        backgroundColor: '#fbfbfb',
        borderRadius: 30,
        paddingVertical: 8,
        paddingHorizontal: 20,
    },
})