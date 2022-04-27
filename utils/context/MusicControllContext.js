import { Component, createContext } from "react";

const MusicControllContext = createContext();

export class MusicControllProvider extends Component {
	constructor() {
		super();
		this.state = {
			
		}
	}

	render() {
		return (
			<MusicControllContext.Provider value={{

			}}>
				{this.props.children}
			</MusicControllContext.Provider>
		)
	}
}

export default MusicControllContext;