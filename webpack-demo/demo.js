const { SyncHook, AsyncParallelHook } = require('tapable')
const hook = new SyncHook(["arg1", "arg2", 'arg3']);

// 绑定事件
hook.tap('hook1', (arg1, arg2, arg3) => {
    console.log(arg1, arg2, arg3)
})

hook.call(1, 2, 3)

class Car {
    constructor() {
        this.hooks = {
            accelerate: new SyncHook(['newSpeed']),
            brake: new SyncHook(),
            calculateRoutes: new AsyncParallelHook(["source", "target", "routesList"])
        }
    }
}
const myCar = new Car()
// 绑定同步钩子
myCar.hooks.brake.tap("WarningLampPlugin", () => console.log("WarningLampPlugin"))

// 绑定同步钩子 并传参
myCar.hooks.accelerate.tap("LoggerPlugin", newSpeed => console.log(`Accelerating to ${newSpeed}`))
// 执行同步钩子
myCar.hooks.accelerate.call(100)

// 绑定一个异步promise钩子
myCar.hooks.calculateRoutes.tapPromise("calculateRoutes tapPromise", (source, target, routesList) => {
    console.log('source', source)
    // return a promise
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            console.log(`tapPromise to ${source}${target}${routesList}`)
            resolve()
        }, 1000)
    })
})
// 执行异步钩子
console.time('cost')
myCar.hooks.calculateRoutes.promise('Async', 'hook', 'demo').then(() => {
    console.timeEnd('cost')
}, err => {
    console.error(err)
    console.timeEnd('cost')
})


