const express = require('express')
const app = express();
const path = require('path')
const { I18n } = require('i18n')

const i18n = new I18n({
    locales: ['en', 'de', 'ja'],
    defaultLocale: 'ja',
    directory: path.join(__dirname, 'locales')
})

// app.use(express.json());

app.use(i18n.init)
// どうやら文字化けしてしまう。utf8対応とかしてないのかな？
app.get('/', (req, res) => {
    // レスポンスヘッダでcontentTypeがなにであるか、
    // 文字エンコーディングがutf-8であることを設定している。

    // res.set('Content-Type', 'text/html; charset=utf-8');
    res.set('Content-Type', 'application/json; charset=utf-8');  // これでもおｋ
    res.end(res.__('Hello'))
    // res.end(res.__('Hi'))
})
/**
 * ■Contenttypeが必要な理由
 * Content-Type」ヘッダーが設定されていない、あるいは不正確に設定されている場合、
 * ブラウザはコンテンツを正しく解釈することができず、
 * 結果としてコンテンツが正しく表示されなかったり、
 * まったく表示されなかったりする可能性があります。
 */

app.listen('3009', () => {
    console.log('起動しました')
})