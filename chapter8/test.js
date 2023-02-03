function test1(a, b) {
    // return a + b;
    return 3;
}

class test2 {
    name;
    constructor(name) {
        this.name = name;
    }
    getName() {
        return this.name;
    }
    getNameAdd(str) {
        return this.name+str;
    }
}

const obj = {
    name: 'ito',
    age: 25
}

const test = new test2('山田')
console.log(test.getName())
console.log(test.getNameAdd('www'))

module.exports = { test1, test2, obj };

