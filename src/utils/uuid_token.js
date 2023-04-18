import { v4 as uuidv4 } from 'uuid'
//要生成一个随机字符串且永久保存
export const getUUID = () => {
    //先从本地存储获取uuid（看一下本地存储里面是否拥有）
    let uuid_token = localStorage.getItem('UUIDTOKEN')
    if(!uuid_token){
        let uuid_token = uuidv4()
        localStorage.setItem('UUIDTOKEN',uuid_token)
    }
    return uuid_token
}