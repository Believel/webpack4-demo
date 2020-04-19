module.exports = class Compile {
    constructor(options) {
        const { entry, output } = options
        this.entry = entry;
        this.output = output;
    }
    run() {
        const entryModule = this.buildModule(this.entry, true)

    }
    buildModule(filename, isEntry) {

    }
    // 输出文件
    emitFiles() {

    }
}