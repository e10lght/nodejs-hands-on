// 非同期関数のみ
// async function getData() {
//     const data1 = await (await fetch('https://jsonplaceholder.typicode.com/users')).json()
//     const data2 = await (await fetch('https://jsonplaceholder.typicode.com/posts')).json()
//     // console.log(data1)
//     return { data1, data2 }
// }
// console.log(getData())


const updateStatus = async (str) => {
    return str;
}
// 複雑化してしまう...
async function getData2() {
    console.log('status:0/2')
    const data1 = await (await fetch('https://jsonplaceholder.typicode.com/users/1')).json()
    console.log('status:1/2', data1)
    const data2 = await (await fetch('https://jsonplaceholder.typicode.com/users/2')).json()
    console.log('status:2/2', data1)
    return { data1, data2 }
}
getData2()
// async function main2() {
//     const result = await getData2()
//     console.log(result)
// }
// main2()

// 非同期ジェネレータで、すっきり
async function* getData3() {
    yield { status: '0/2' }
    const data1 = await (await fetch('https://jsonplaceholder.typicode.com/users/1')).json()
    yield { status: '1/2', data1 }
    const data2 = await (await fetch('https://jsonplaceholder.typicode.com/users/2')).json()
    yield { status: '2/2', data2 }
}
// const asyncIterator = getData3;
// const pro = asyncIterator.next()
// console.log(pro)

async function main3() {
    for await (const message of getData3()) {
        console.log(message)
    }
}
main3()

