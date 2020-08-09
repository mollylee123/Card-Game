class Pile {
    constructor(left, top, type) {
        this.setup(left, top, type)
    }
    static new(left, top, type) {
        var i = new this(left, top, type)
        return i
    }
    setup(left, top, type) {
        this.image = './img/pile.png'
        this.left = left
        this.top = top
        // deliver stack 4a
        this.type = type
        this.generateNode()
    }
    generateNode() {
        var left = this.left
        var top = this.top
        var drop = this.drop
        var allowDrop = this.allowDrop
        var style = `style="left: ${left}px; top: ${top}px;background-image:url(${this.image});background-size: 100% 100%;"`
        var events = `ondrop="${drop}" ondragover="${allowDrop}"`
        var h = `<div type="${this.type}" class="item pile-item" id="${this.id}" ${style}></div>`
        $('#board').append(h)
    }
    drop(event) {
        log('pile moved')
        var self = event.target
        event.preventDefault()
        var data = event.dataTransfer.getData("Text")
        var node = document.getElementById(data)
        event.target.appendChild(node)
    }
    allowDrop(event) {
        log('pile allow')
        event.preventDefault()
    }
}
$("#board")[0].ondrop = function(event) {
    var self = event.target
    var data = event.dataTransfer.getData("Text")
    var node = document.getElementById(data)
    var isPile = $(self).hasClass('pile-item')
    if (isPile) {
        log('pile moved')
        event.preventDefault()
        event.target.appendChild(node)
        $(node).css({left: 0, top: 0})
        // 从src中删除该card
        var isDeliver = $(node).attr('type') === 'deliver-card'
        if (isDeliver) {
            log('delet src card from lib')
            for (var i = 0; i < cardLib.length; i++) {
                var c = cardLib[i]
                var id = c['id']
                if (id === node.id) {
                    cardLib.splice(i, i)
                }
            }
        } else {
            log('delet src card from stack')
            var idMoved = node.id
            var idDistLast = event.target.id
            log(`移动元素id(${idMoved}), 被移入元素id(${idDistLast})`)
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
            // 移入元素遍历stacks，从原stack中删除; dist 中添加移入元素
            var src = stacks[noSrc]
            var itemInSrc = src.splice(indexInSrc, indexInSrc)
            // var dist = stacks[noDist]
            // dist.push(itemInSrc[0])
            // 原stack如果上一张牌反面，展示正面
            if (src.length != 0) {
                var last = src.slice(-1)[0]
                var idLast = last['id']
                changeDisplay(idLast)
            }
        }
    }
}
$("#board")[0].ondragover = function(event) {
    var self = event.target
    var isPile = $(self).hasClass('pile-item')
    if (isPile) {
        // log('pile allow', self)
        event.preventDefault()
    }
}
// deliver
Pile.new(0, 0, 'deliver-pile')
// stack
for (var i = 0; i < 7; i++) {
    const baseL = 0
    const baseT = 100
    const lpadding = (48 + 18)
    const l = i * lpadding + baseL
    const t = baseT
    Pile.new(l, t, 'stack-pile')
}
// 4a
for (var i = 0; i < 4; i++) {
    const baseL = 198
    const baseT = 0
    const lpadding = (48 + 18)
    const l = i * lpadding + baseL
    const t = baseT
    Pile.new(l, t, 'a4-pile')
}
