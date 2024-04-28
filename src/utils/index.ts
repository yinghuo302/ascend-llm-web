import mitt from "mitt"

type MyEvent = {
	SendMsg:string
}

export const bus = mitt<MyEvent>();