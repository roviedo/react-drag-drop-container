var React = require('react');
var ReactDOMClient = require('react-dom/client');
import BasicDragDemo from './BasicDragDemo';
import DragFoodToAnimalsDemo from './DragFoodToAnimals/DragFoodToAnimalsDemo';
import DragThingsToBoxesDemo from './DragThingsToBoxes/DragThingsToBoxesDemo';
import DragElementWithClickHandlers from './DragElementWithClickHandlers';

class App extends React.Component {
	constructor(props) {
    super(props);
    this.state = {};
  }

	render () {
		return (
			<div>
				<DragThingsToBoxesDemo/>
				<hr />
				<DragFoodToAnimalsDemo/>
				<hr />
				<BasicDragDemo />
				<hr />
				<DragElementWithClickHandlers />
			</div>
		);
	}
};

const rootElement = document.getElementById("app");
const root = ReactDOMClient.createRoot(rootElement);
root.render(
	<React.StrictMode>
		<App />
	</React.StrictMode>
);
