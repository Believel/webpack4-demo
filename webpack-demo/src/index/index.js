import React, {Component} from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import Img from './imgs/Group 12.png'
import bg from './imgs/child.jpeg'
import { common } from '../../common/utils.js'
import { a } from './tree-shaking.js'
import LargeNumber from 'large-number-zpp'

class Demo extends Component {
    constructor() {
        super(...arguments)
        this.state = {
            Text: null,
            num: ''
        }
    }
    componentDidMount() {
        common()
        this.setState({
            num: LargeNumber('999', '1')
        })

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
        const { Text, num } = this.state
        return (
           <>
            <div className="box">我的Demo组件{a()}</div>
            <img src={Img} width="20" height="30" onClick={this.loadComponent}/>
            {
                Text && <Text/>
            }
            <div>{num}</div>
            <img src={ bg } width="1000" height="901"/>
           </>
        )
    }
}
ReactDOM.render(<Demo/>, document.getElementById('root'))