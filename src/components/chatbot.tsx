import { createStore } from "solid-js/store";
import { ajax } from "../utils/ajax";
import { For, createSignal, onMount } from "solid-js";
import botAvator from "../assets/imgs/ascend.svg"
import userAvator from "../assets/imgs/avatar.png"
import MarkdownRoot from "./md";
export default function ChatBot() {
	const [messages, setMessages] = createStore([
		{ text: '你好,我是聊天机器人助手,很高兴为你服务!', isBot: true, idx: 0 },
	]);
	const [process, setProcess] = createSignal(false)
	let input: HTMLTextAreaElement = null
	let button: HTMLButtonElement = null
	const getMesgTimeout = 800
	const changeLastMsg = (new_msg) => {
		setMessages(messages.map((val) => { return val.idx == messages.length - 1 ? new_msg : val }))
	}

	const getMessage = () => {
		if (process()) {
			setTimeout(getMessage, getMesgTimeout)
			return 
		}
		ajax.ajax({
			type: "GET",
			url: "/api/getMsg",
		}).then((res) => {
			if (res.code != 200) {
				changeLastMsg({ text: "服务器故障", isBot: true, idx: messages.length - 1 })
				button.disabled = false
			} else {
				changeLastMsg({ text: res.message, isBot: true, idx: messages.length - 1 })
				if (!res.isEnd) {
					setTimeout(getMessage, getMesgTimeout)
				} else {
					button.disabled = false
				}

			}
		}, () => {
			changeLastMsg({ text: "网络异常", isBot: true, idx: messages.length - 1 })
			button.disabled = false
		})
	}

	const handleSendMessage = () => {
		let inputText = input.value
		if (inputText.length==0) return
		if (inputText.trim()) {
			setMessages([...messages, { text: inputText, isBot: false, idx: messages.length }]);
			input.value = ""
			button.disabled = true
			ajax.ajax({
				type: "POST",
				url: "/api/chat",
				data: {message:inputText},
			}).then((res) => {
				if (res.code != 200) {
					setMessages([...messages, { text: "服务器故障", isBot: true, idx: messages.length }])
					button.disabled = false
				} else {
					setMessages([...messages, { text: "", isBot: true, idx: messages.length }])
					setTimeout(getMessage, getMesgTimeout)
				}
			}, () => {
				setMessages([...messages, { text: "网络异常", isBot: true, idx: messages.length }])
				button.disabled = false
			})
		}
	};

	const clearHistory = () => {
		ajax.ajax({
			type: "GET",
			url: "/api/reset",
		}).then((res) => {
			if (res.code != 200) {
				window.alert("清除历史失败")
			} else {
				setMessages([{ text: '你好,我是聊天机器人助手,很高兴为你服务!', isBot: true, idx: 0 }])
			}
		}, () => {
			window.alert("清除历史失败")
		})
	}

	onMount(()=>{
		input.addEventListener('keydown', function(event) {
			if (event.ctrlKey && event.key === "Enter") {
				handleSendMessage()
			}
		});
	})

	return (
		<div class="w-full h-full flex flex-col justify-between">
			<div class="w-full self-center text-center h-auto text-3xl bg-emerald-200"> Ascend LLM</div>
			<div class="overflow-y-scroll h-full">
				<For each={messages}>
					{(item, index) => (
						<div class={(item.isBot ? "flex-row " : "flex-row-reverse ") + 'flex my-4'}>
							<img class="rounded-full w-[50px] h-[50px]" id="avatar" src={item.isBot ? botAvator : userAvator} />
							<div class={(item.isBot ? "bg-yellow-100" : "bg-blue-100") + " p-4 mx-8 rounded-lg"}><MarkdownRoot content={item.text} setProcess={setProcess}></MarkdownRoot></div>
						</div>

					)}
				</For>
			</div>
			<div class="flex w-full items-center">
				<div class="overflow-scroll [&amp;:has(textarea:focus)]:border-token-border-xheavy [&amp;:has(textarea:focus)]:shadow-[0_2px_6px_rgba(0,0,0,.05)] flex flex-col w-full flex-grow relative border dark:text-white rounded-2xl bg-token-main-surface-primary border-token-border-medium justify-center">
					<button class="absolute left-2 rounded-lg border border-black bg-black p-0.5 text-white transition-colors enabled:bg-black disabled:text-gray-400 disabled:opacity-10 dark:border-white dark:bg-white dark:hover:bg-white md:left-3" data-testid="clear-button" onclick={clearHistory} >
						<span><svg width="24" height="24" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg"><path d="M19.54 3.66c-.13-.49-.45-.9-.89-1.16-.44-.26-.95-.32-1.45-.19-.49.13-.9.45-1.16.89l-3.48 6.03L10.42 8a.738.738 0 0 0-1.02.27L8.28 10.2c-.1.17-.13.38-.08.57.05.19.18.36.35.46l.31.18c-2.21 2.1-6.06 3.64-6.1 3.66-.26.1-.45.35-.47.63-.03.28.11.55.35.7l2.01 1.25c.19.12.42.15.63.08.03-.01.48-.16 1.07-.42-.1.15-.18.24-.18.24-.15.16-.22.39-.2.61.03.22.16.42.35.54l4.99 3.1c.12.08.26.11.4.11.16 0 .32-.05.45-.15.11-.09 2.63-2.04 3.74-6.29l.31.18a.746.746 0 0 0 1.02-.27l1.12-1.93c.1-.17.13-.38.08-.57a.77.77 0 0 0-.35-.46l-2.21-1.27 3.48-6.03c.25-.45.32-.97.19-1.46Zm-7.91 16.56-3.84-2.39c.28-.49.59-1.2.65-2.07a.758.758 0 0 0-.38-.71.747.747 0 0 0-.8.04c-.74.52-1.65.91-2.13 1.09l-.49-.3c1.51-.71 3.96-2.04 5.56-3.7l4.33 2.5c-.69 3.03-2.2 4.84-2.9 5.54Zm4.68-6.26L9.96 10.3l.36-.63 4.15 2.39 2.2 1.27-.36.63Zm1.74-9.6-3.48 6.03-.7-.4 3.48-6.03c.11-.19.36-.26.55-.15a.405.405 0 0 1 .15.55ZM16.75 21.14a1.25 1.25 0 1 0 0-2.5 1.25 1.25 0 0 0 0 2.5ZM19 17.5a1 1 0 1 0 0-2 1 1 0 0 0 0 2ZM20.25 19.5a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z"></path></svg></span>
					</button>
					<textarea id="prompt-textarea" tabindex="0" data-id="433be95d-99e1-4924-ba99-b4c68e55cea1" dir="auto" rows="1" placeholder="给Ascend LLM发送消息" class="m-0 w-full resize-none border-0 bg-transparent focus:ring-0 focus-visible:ring-0 dark:bg-transparent pr-10 py-3.5 md:pr-12 max-h-52 placeholder-black/50 dark:placeholder-white/50 pl-10 md:pl-14 outline-none" style="height: 52px; overflow-y: hidden;" ref={input}></textarea>
					<button class="absolute  right-2 rounded-lg border border-black bg-black p-0.5 text-white transition-colors enabled:bg-black disabled:text-gray-400 disabled:opacity-10 dark:border-white dark:bg-white dark:hover:bg-white md:right-3" data-testid="send-button" >
						<span class="" data-state="closed" ref={button} onclick={handleSendMessage}>
							<svg width="24" height="24" viewBox="0 0 24 24" fill="none" class="text-white dark:text-black"><path d="M7 11L12 6L17 11M12 18V7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg></span>
					</button>
				</div>
			</div>
		</div>
	);
}