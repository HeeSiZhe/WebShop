import Mock from "mockjs";
//webpack默认对外暴露的：图片、json数据格式
import banner from './banner.json'
import floor from './floor.json'

//mock数据：第一个参数请求地址   第二个地址：请求数据
Mock.mock("/mock/banner",{code:200,data:banner})
Mock.mock("/mock/floor",{code:200,data:floor})