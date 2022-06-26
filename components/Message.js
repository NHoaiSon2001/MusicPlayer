import { useContext } from "react";
import { Modal, Text, View, StyleSheet } from "react-native";
import AppContext from "../utils/context/AppContext";

const Message = () => {
    const appContext = useContext(AppContext);
    const darkMode = appContext.darkMode;

    return (
        <Modal
            animationType="face"
            transparent={true}
            visible={appContext.messageVisible}
        >
            <View style={styles.centeredView}>
                <View style={[styles.modalView, {backgroundColor: darkMode ? '#666666' : '#fbfbfb'}]}>
                    <Text style = {{color: darkMode ? '#e3e3e3' : '#1e1e1e'}}>{appContext.message}</Text>
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
        borderRadius: 30,
        paddingVertical: 8,
        paddingHorizontal: 20,
    },
})