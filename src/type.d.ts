type ModalState = {
	component: any,
	props?:any
	open: boolean
}

interface IMenuItem{
	content:string
	tip?:string
	className?:string
	subMenu?:IMenuItem[]
	click?:(editor:IEditor,e:Event)=>void
}

interface IArticle{
	fileId:string,
	name:string,
	user?:IUser
	description:string,
	content?:string
}

interface IFileOP{
	type:string,
	name?:string,
	otherName?:string
}


interface IFileList{
	name:string
	description:string
	fileId?:string
}

interface IUser{
	nickname:string,
	avatar:string,
	description:string
}