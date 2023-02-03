console.log('1---------')
// プロセスが終了した際に実行される
process.on('exit', (code) => {
    console.log('2---------')
    console.log(`About to exit with code: ${code}`);
});
console.log('3---------')
process.exit()
process.on('exit', (code) => {
    setTimeout(() => {
        console.log('This will not run');
    }, 0);
});
console.log('4---------')
