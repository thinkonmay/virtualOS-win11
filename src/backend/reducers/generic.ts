import * as actions from './index'
export const dispatch_generic = ({type,payload}:{type: string,payload:any}) => {
    if((actions as Record<string,any>)[type] == undefined) {
        console.log(actions,type,(actions as Record<string,any>)[type])
        return
    }

    return (actions as Record<string,any>)[type](payload)
}