class Card {
    constructor(number, char, icon, color) {
        this.number = number
        this.icon = icon
        this.color = color
        this.char = char
        this.left = 0
        this.top = 0
        this.id = this.icon + this.number
        this.setup()
    }
    static new(number, char, icon, color) {
        var i = new this(number, char, icon, color)
        return i
    }
    setup() {
        this.display = false
        this.imageCard = ''
        this.imageBack = './img/back.png'
        this.image = this.imageBack
    }
    setDisplay(show) {
        this.display = show || false
        if (show) {
            this.image = './img/' + this.imageCard
        } else {
            this.image = this.imageBack
        }
    }
    generateNode(l, t) {
        var name = this.char + this.color + this.icon
        if (this.back) {
            name += '正'
        }
        var left = (l != undefined ? l : this.left)
        var top = (t != undefined ? t : this.top)
        var style = `style="left: ${left}px; top: ${top}px;background-image:url(${this.image});background-size: 100% 100%;"`
        var attr = `data-image="${this.imageCard}"`
        var events = `ondragstart="drag(event)" ondrop="drop(event)" ondragover="allowDrop(event)"`
        var type = `type="${this.type}"`
        var h = `<div ${type} class="item" id="${this.id}"  ${attr} draggable="${this.display}" ${events} ${style}>
        </div>`
        $('#board').append(h)
    }
    move() {
        var ele = $('#' + this.id)
        log('ele', ele)
        ele.css({'left': this.left})
        ele.css({'top': this.top})
    }

}
$("#board").on("click", function(event) {
    var self = event.target
    var isDeliver = $(self).attr('type') === 'deliver-card'
    if (isDeliver) {
        log('click isDeliver', self)
        // 遍历牌库，所有牌初始位置0，0，背面展示
        // 如果存在上一张点击牌（根据位置非0，0判断），则移动元素到牌库最底部
        for (var i = 0; i < cardLib.length; i++) {
            var c = cardLib[i]
            var id = c['id']
            // if (selfId == id) {
            //     // 目标card在牌库中的对应元素
            //     targetItem = c
            //     targetIndex = i
            // }
            var l = $('#' + id).css('left')
            var t = $('#' + id).css('top')
            var hasLast = (l === '60px') && (t === '0px')
            if (hasLast) {
                var lastId = id
                var first = '#' + cardLib[0].id
                $("#" + lastId).insertBefore(first)
                // cardLib 数组相对应改变
                var cut = cardLib.splice(i, i)
                cardLib.unshift(cut[0])
            }
            $('#' + id).attr('type', 'deliver-card').css('left', '0px').css('background-image', 'url(./img/back.png)')
        }
        log('last card id', lastId, cardLib)
        // 点击牌移动到右侧
        self.style.left = '60px'
        // 正面展示
        var selfId = self.id
        changeDisplay(selfId)
        // 可drag，不可drop
        $(selfId).attr('type', '')
    }
})
function drag(event) {
    log('dragstart', event)
    var id = $(event.target).attr('id')
    event.dataTransfer.setData("Text", id)
    log('drag', id)
}
function drop(ev) {
    // 反面的牌不能 drag drop
    var self = ev.target
    var draggable = self.draggable
    if (!draggable) {
        return
    }
    // 正面牌，最后一张如果符合规则可drop
    ev.preventDefault()
    var data = ev.dataTransfer.getData("Text")
    var node = document.getElementById(data)
    dragging(node, ev)
}

function actionFromLib(node, ev) {
    var idMoved = node.id
    var idDistLast = ev.target.id
    log(`移动元素id(${idMoved}), 被移入元素id(${idDistLast})`)
    // 获取移入移出stack序号，移动牌处于src的index
    var noDist
    var indexInSrc
    for (var i = 0; i < 7; i++) {
        var s = stacks[i]
        for (var j = 0; j < s.length; j++) {
            var item = s[j]
            var idItem = item.id
            // log('idItem', idItem)
            if (idItem === idDistLast) {
                noDist = i
            }
        }
    }
    for (var i = 0; i < cardLib.length; i++) {
        var c = cardLib[i]
        var idItem = c.id
        if (idItem === idMoved) {
            indexInSrc = i
        }
    }
    log(`indexInSrc(${indexInSrc}), noDist(${noDist})`)
    // 判断是否可以移入(被移入最小大于移入组最大，并花色不同)
    var biggest = stacks[noDist].slice(-1)[0]
    var smallest = cardLib[indexInSrc]
    var checkBig = bigger(biggest, smallest)
    var checkDiffColor = diffColor(biggest, smallest)
    var condition = checkBig && checkDiffColor
    if (condition) {
        ev.target.appendChild(node)
        $(node).css({left: 0, top: '20px'})
        // 移入元素遍历stacks，从原stack中删除; dist 中添加移入元素
        var src = cardLib
        var itemInSrc = src.splice(indexInSrc, indexInSrc)
        var dist = stacks[noDist]
        dist.push(itemInSrc[0])
    } else {
        var reason = checkDiffColor ? '数字大小不合适' : '花色不符合'
        log('cant move card!!', reason)
    }
}
function actionFromStack(node, ev) {
    var idMoved = node.id
    var idDistLast = ev.target.id
    log(`移动元素id(${idMoved}), 被移入元素id(${idDistLast})`)
    // 获取移入移出stack序号，移动牌处于src的index
    var noSrc
    var noDist
    var indexInSrc
    for (var i = 0; i < 7; i++) {
        var s = stacks[i]
        for (var j = 0; j < s.length; j++) {
            var item = s[j]
            var idItem = item.id
            // log('idItem', idItem)
            if (idItem === idMoved) {
                noSrc = i
                indexInSrc = j
            } else if (idItem === idDistLast) {
                noDist = i
            }
        }
    }

    log(`noSrc(${noSrc}), indexInSrc(${indexInSrc}), noDist(${noDist})`)
    // 判断是否可以移入(被移入最小大于移入组最大，并花色不同)
    var biggest = stacks[noDist].slice(-1)[0]
    var smallest = stacks[noSrc][indexInSrc]
    var checkBig = bigger(biggest, smallest)
    var checkDiffColor = diffColor(biggest, smallest)
    var condition = checkBig && checkDiffColor
    if (condition) {
        ev.target.appendChild(node)
        $(node).css({left: 0, top: '20px'})
        updateStack(noSrc, noDist, indexInSrc)
    } else {
        var reason = checkDiffColor ? '数字大小不合适' : '花色不符合'
        log('cant move card!!', reason)
    }
}

function dragging(node, ev) {
    // 判断是否是牌库里移动来的card
    // 如果是需要更改src
    var isDeliver = $(node).attr('type') === 'deliver-card'
    if (isDeliver) {
        actionFromLib(node, ev)
    } else {
        actionFromStack(node, ev)
    }
}
function updateStack(noSrc, noDist, indexInSrc) {
    // 移入元素遍历stacks，从原stack中删除; dist 中添加移入元素
    var src = stacks[noSrc]
    var itemInSrc = src.splice(indexInSrc, indexInSrc)
    var dist = stacks[noDist]
    dist.push(itemInSrc[0])
    // 原stack如果上一张牌反面，展示正面
    if (src.length != 0) {
        var last = src.slice(-1)[0]
        var idLast = last['id']
        changeDisplay(idLast)
    }
}
function allowDrop(event) {
    var self = event.target
    var canDrag = self.draggable
    if (canDrag) {
        event.preventDefault()
        // log('allowDrop', event)
    }
}
function changeDisplay(id) {
    var ele = $(`#${id}`)
    var url = './img/' + ele[0].dataset.image
    ele.css('background-image', `url(${url})`)
    // 可 drag drop
    ele.attr({'draggable': true})
}
function bigger(card1, card2) {
    var num1 = card1.number
    var num2 = card2.number
    var condition = (num1 - num2) == 1
    return condition
}
function diffColor(card1, card2) {
    var color1 = card1.color
    var color2 = card2.color
    var condition = (color1 !== color2)
    return condition
}
// function moveCard(stacks, a0, a1, a2) {
//     // 从 a0 列，第 a1 个，移动到 a2 末尾
//     // 需要移动的数组
//     var arrWillMove = stacks[a0].slice(a1)
//     var src = stacks[a0]
//     var dst = stacks[a2]
//     // 判断是否可以移入(被移入最小大于移入组最大，并花色不同)
//     var biggest = arrWillMove[0]
//     var smallest = dst.slice(-1)[0]
//     var enableMove = bigger(smallest, biggest)
//     // 移动
//     var left = smallest.left
//     var top = smallest.top
//     if (enableMove) {
//         // 删除旧 stack 中的牌
//         stacks[a0] = src.slice(0, a1) || []
//         var newSrc = stacks[a0]
//         // 移入新 stack
//         stacks[a2] = dst.concat(arrWillMove)
//         for (var i = 0; i < arrWillMove.length; i++) {
//             var a = arrWillMove[i]
//             a.left = left
//             a.top = top + 20 * (i + 1)
//             a.move()
//         }
//     } else {
//         log('cant move card!!')
//     }
// }
// 1 洗牌
// 2 A 区域
// 3 发牌区点击事件，右侧如果没有牌展示牌，如有替换牌
