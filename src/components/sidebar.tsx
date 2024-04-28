import { For } from "solid-js"
import { bus } from "../utils"

export default function Sidebar() {
	const questions = [
		"What is the biggest animal in the world?",
		"Who is the fastest runner?",
		"Write a short story about the war of elves and dwarves."
	]
	const tips = [
		"对话会保留之前的语义信息，按左侧按钮可以清除过去的语义，开始新的对话",
		"回答还没结束不能继续提问或清除过去的语义信息",
		"点击快速提问中的问题可以直接提问"
	]

	return <div class="w-[400px] h-full grid grid-cols-1 bg-slate-100 px-6 py-8 rounded-xl">
		<div>
			<h2 class="text-2xl text-center">注意事项</h2>
			<ol class="list-decimal space-y-2 py-2">
				<For each={tips}>
					{(item) => <li>{item}</li>}
				</For>
			</ol>
		</div>
		<div>
			<h2 class="text-2xl text-center">快速提问</h2>
			<ol class="list-none space-y-2 py-2 text-lg">
				<For each={questions}>
					{(item) => <li class="hover:text-teal-600" onclick={
						() => {console.log("emit"); bus.emit("SendMsg",item)}
					}>{item}</li>}
				</For>
			</ol>
		</div>
	</div>
}