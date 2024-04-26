import markdownit from 'markdown-it'
import hljs from 'highlight.js'
import {  Setter, createMemo, onMount } from 'solid-js';
import "../assets/css/md-root.css"
import "../assets/css/hljs.css"
import texmath from 'markdown-it-texmath';
import { light as emoji } from 'markdown-it-emoji'
import "../assets/css/katex.min.css"
const mdRender = markdownit({
	breaks: true,
	highlight: function (str, lang) {
		if (lang && hljs.getLanguage(lang)) {
			try {
				return '<pre><code class="hljs">' +
					hljs.highlight(str, { language: lang, ignoreIllegals: true }).value +
					'</code></pre>';
			} catch (__) { }
		}

		return '<pre><code class="hljs">' + mdRender.utils.escapeHtml(str) + '</code></pre>';
	}
}).use(texmath,emoji);
export default function MarkdownRoot(props:{content:string,setProcess:Setter<boolean>}) {
	let root:HTMLDivElement = null
	onMount(()=>{
		root.innerHTML=props.content;
		createMemo(()=>{
			props.setProcess(true)
			if(root) root.innerHTML = mdRender.render(props.content)
			props.setProcess(false)
		})
	})
	return <div ref={root} class='md-root'></div>

}