const { test1, test2, obj } = require('./test');

test('sum関数に1と2を渡したら3を返すかテスト', () => {
    expect(test1(1, 2)).toBe(3);
});

// jest.mock('../test')
// beforeEach(() => {
//     // すべてのインスタンスとコンストラクタおよびすべてのメソッドの呼び出しをクリアします。
//     test2.mockClear();
// });

describe('MyClass', () => {
    let myClass;

    beforeEach(() => {
        myClass = new test2('山田');
    });
    test('getName()で名前返る', () => {
        expect(myClass.getName()).toBe('山田');
    });
    test('getNameAdd()で名前返る', () => {
        expect(myClass.getNameAdd('さん')).toBe('山田さん');
    });
    afterAll(() => console.log('hello'))
});

test('オブジェクトの等価判定', () => {
    expect(obj).toEqual({
        name: 'ito',
        age: 25
    })
})
