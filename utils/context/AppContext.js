import { Component, createContext, createRef } from "react";

const AppContext = createContext();

export class AppProvider extends Component {
	constructor() {
		super();
		this.playerScreenRef = createRef();
		this.queueScreenRef = createRef();
		this.state = {
			audioFile: [],
		}
	}

	openPlayer = (timeout) => {
		this.playerScreenRef.current?.open();
		setTimeout(() => {
			this.playerScreenRef.current?.open('top');
		}, timeout);
	}

	render() {
		return (
			<AppContext.Provider value={{
				audioFile: this.state.audioFile,
				playerScreenRef: this.playerScreenRef,
				queueScreenRef: this.queueScreenRef,
				openPlayer: this.openPlayer,
			}}>
				{this.props.children}
			</AppContext.Provider>
		)
	}
}

export default AppContext;