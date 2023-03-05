// const jest = require('jest-mock')
// const expect = require('expect')

const obj = {
    foo: 'foo',
    bar: 1
}
test('テストのテスト', () => {
    expect(obj.foo).toBe('foo')

})
test('テストのテスト', () => {
    expect(obj).toEqual({
        foo: 'foo',
        bar: 1
    })
})
test('jest.spyOn()の使い方', () => {
    jest.spyOn(console, 'log')  // console.logを監視する
    if (true) {
        console.log('hoge')
    } else {
        console.log('huga')
    }
    // console.logでhogeと出力されることを期待する
    expect(console.log).toHaveBeenCalledWith('hoge');  // あくまで出力ではなくconsolelogで受け取った値を検証
    expect(console.log).toHaveBeenCalledTimes(1);
    // expect(console.log).toHaveBeenCalledWith('foo');  // 通らない
    // expect(console.log).toHaveBeenCalledTimes(2);  // 通らない
});
test('jest.spyOnはスタブに相当するため、だいたい実装も定義できる', () => {
    jest.spyOn(console, 'log')  // console.logを監視する
    console.log.mockReturnValue(true)
    console.log('foo')
    console.log.mockImplementation((arg1, arg2) => arg1 + arg2)
    console.log('foo', 'bar')
})
test('jest.fn', () => {
    jest.spyOn(console, 'log')  // console.logを監視する
    const emptyMock = jest.fn()
    emptyMock(10, 29)
    expect(emptyMock).toHaveBeenCalledTimes(1)
    const multipulyMock = jest.fn((a, b) => a * b)
    multipulyMock(10, 29)
    expect(multipulyMock).toHaveBeenCalledTimes(1)
})

test('jest.mock', () => {
    const uuid = require('uuid')
    uuid.v4 = 'foo'  // 文字列への置換はできない

    // モックの生成
    jest.mock('uuid')
    // モックがaという文字列を返すようにする
    uuid.v4.mockReturnValue('a')
    // 第二引数に代替実装を返す関数を与えることで、1行で済ませることも可能
    // jest.mock('uuid', () => ({ v4: () => 'a' }))



})