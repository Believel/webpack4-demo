// import React, {Component} from 'react'
// import './index.css'
// import Img from './imgs/Group 12.png'
// import { common } from '../../common/utils.js'
// import { a } from './tree-shaking.js'
const React = require('react')
const Img = require('./imgs/Group 12.png')
const {common} = require('../../common/utils')
const {a} = require('./tree-shaking.js')
require('./index.css')
class Demo extends React.Component {
    constructor() {
        super(...arguments)
        this.state = {
            Text: null
        }
    }
    componentDidMount() {
        common()
    }
    // 动态加载组件
    loadComponent = () => {
        import('./component/text.js').then(Text => {
            console.log(Text)
            this.setState({
                Text: Text.default
            })
        })
    }
    render() {
        const { Text } = this.state
        return (
           <>
            <div className="box">我的Demo组件{a()}</div>
            <img src={Img} width="20" height="30" onClick={this.loadComponent}/>
            {
                Text && <Text/>
            }
           </>
        )
    }
}
module.exports =  <Demo />