/* @refresh reload */
import { render } from 'solid-js/web';
import './index.css';
import ChatBot from './components/chatbot';

const root = document.getElementById('root');

if (import.meta.env.DEV && !(root instanceof HTMLElement)) {
	throw new Error(
		'Root element not found. Did you forget to add it to your index.html? Or maybe the id attribute got mispelled?',
	);
}
window.addEventListener("dragover", function (e) {
	e.preventDefault();
}, false);
window.addEventListener("drop", function (e) {
	e.preventDefault();
}, false);
render(
	() => (
		<>
			<div class='fixed top-0 left-0 flex flex-row w-screen h-screen'>
				<ChatBot></ChatBot>
			</div>
		</>
	),
	root!
);

