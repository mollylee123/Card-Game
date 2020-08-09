// 1 发牌功能
// 发牌函数
// 发牌效果
// 牌正面反面
// 牌位置

const charDict = function() {
    var o = {
        '1': 'A',
        '2': '2',
        '3': '3',
        '4': '4',
        '5': '5',
        '6': '6',
        '7': '7',
        '8': '8',
        '9': '9',
        '10': '10',
        '11': 'J',
        '12': 'Q',
        '13': 'K',
    }
    return o
}

function generateList(list, name, color) {
    var cs = list
    for (var i = 1; i <= 13; i++) {
        var number = i
        var char = `${i}`
        char = charDict()[char]
        var icon = name
        var color = color
        var c = Card.new(number, char, icon, color)
        cs.push(c)
    }
}

function setPosition(card, columnIndex, rowIndex) {
    var baseL = 0
    var baseT = 0 + 100
    // 一列牌列宽度 48px, 牌列间距 20px
    var lpadding = (48 + 18)
    // 上线牌重叠间距 20px
    var tpadding = 20
    var left = columnIndex * lpadding + baseL
    card.left = left
    var top = rowIndex * tpadding + baseT
    card.top = top
}

function setStatus(card, i, j) {
    card.back = false
    if (i === j) {
        card.back = true
    }
}

// moveCard(stacks, 0, 0, 1)
var __main = function() {
    var cs = []
    // init 13个 黑桃
    generateList(cs, '黑桃', 'black')
    generateList(cs, '红心', 'red')
    generateList(cs, '梅花', 'black')
    generateList(cs, '方块', 'red')
    log(cs)
    // 图片地址
    for (var i = 0; i < cs.length; i++) {
        var c = cs[i]
        c.imageCard = i + 1 + '.png'
    }
    // 洗牌
    for (var i = 0; i < cs.length; i++) {
        var c = cs[i]
        var r = randomInt(i, cs.length)
        var c1 = cs[r]
        cs[i] = c1
        cs[r] = c
    }
    // 接下来放牌堆
   // 牌堆就是 7 个 1 2 3 4 5 6 7 数量的数组
   // 剩下的就是牌库
   // stacks 是 7 个牌库(总计 28 张牌)
   stacks = [
       [],
       [],
       [],
       [],
       [],
       [],
       [],
   ]
   // index 是所有牌的下标
   var index = 0
   for (var i = 0; i < 7; i++) {
       var s = stacks[i]
       for (var j = 0; j < i + 1; j++) {
           var card = cs[index]
           card.type = 'stack-card'
           // 牌库 card 加定位坐标（用position定位，因此设置 left 和 top，重叠牌上下差距 20px
           setPosition(card, i, j)
           // 每个牌库最后一张牌正面展示，其它返回展示
           setStatus(card, i, j)
           card.index = index
           // 默认牌背面，stack 最后一个正面展示
           if (j == i) {
                card.setDisplay(true)
           }
           // 发牌
           card.generateNode()
           s.push(card)
           index = index + 1
       }
   }
   log('stacks', stacks)
   // cardLib 是牌库
   cardLib = []
   for (var i = index; i < 52; i++) {
       cs[i].type = 'deliver-card'
       cardLib.push(cs[i])
   }
   for (var i = 0; i < cardLib.length; i++) {
       var c = cardLib[i]
       c.generateNode(0, 0)
   }
   log('cardLib', cardLib)
}


__main()
