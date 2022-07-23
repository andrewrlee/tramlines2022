const fs = require('fs')
const eta = require('eta')


const extractAct = (actStr) => {
    const act = actStr.replace(/\n/g, " ").replace(/\s+/g, " ")
    const time = /<span class="actTime">(.*?)<\/span>/.exec(act)[1]
    const name = /class="actNm">(.*?)<\/span>/m.exec(act)[1]
    return { time, name }
}

const extractStage = (stage) => {
    const name = stage.split("</h3>")[0]
    const acts = stage.split("<div ").slice(1).map(act => extractAct(act))
    return { name, acts }
}

const template = fs.readFileSync('template.html').toString()
const stages = fs.readFileSync('data.raw').toString()
    .split("<h3>")
    .slice(1)
    .map(stage => extractStage(stage))

const rendered = eta.render(template, { stages })

fs.writeFileSync('./index.html', rendered)