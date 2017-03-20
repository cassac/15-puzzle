const app = {
  gameBoard: document.getElementById('game-board'),
  moves_count_span: document.getElementById('moves-count'),
  board: [],
  moves_count: 0,
  game_running: false,
  start_button: document.getElementById('btn-text'),
  initGame: () => {
    app.moves_count_span.innerText = 0
    app.moves_count = 0
    app.board = app.initBoard()
    app.renderPieces()
  },
  initBoard: () => {
    const array = new Array(16)
    for (var i = 1; i <array.length; i++) {
      array[i] = String(i)
    }
    let currentIndex = array.length, temporaryValue, randomIndex
    while (1 !== currentIndex) {
      randomIndex = Math.floor(Math.random() * currentIndex)
      currentIndex--
      temporaryValue = array[currentIndex]
      array[currentIndex] = array[randomIndex]
      array[randomIndex] = temporaryValue
    }
    var undefined_index = array.indexOf(undefined)
    array[undefined_index] = 'blank'
    return array
  },
  renderPieces: () => {
    let html = ''
    app.board.map((piece, i)=> {
      const color = i % 2 === 0 ? 'red' : 'white'
      el = piece === 'blank' ? 
        `<div id="blank" class="piece">blank</div>` : 
        `<div class="piece ${color} num-piece">${piece}</div>`
      html += el
    })
    app.gameBoard.innerHTML = html
    app.addEventListeners()
  },
  addEventListeners: () => {
    const num_pieces = document.querySelectorAll('.num-piece')
    num_pieces.forEach(piece => {
      piece.addEventListener('click', app.pieceOnClick)
    })
    app.start_button.addEventListener('click', app.startButtonOnClick)
  },
  returnBlankIndex: (num_index) => {
    if (app.board[num_index-4] === 'blank') {
      return num_index - 4 // top
    } else if (app.board[num_index-1] === 'blank') {
      return num_index - 1 // left
    } else if (app.board[num_index+1] === 'blank') {
      return num_index + 1 // right
    } else if (app.board[num_index+4] === 'blank') {
      return num_index + 4 // bottom
    }
    return -1
  },
  isValidClick: (num) => {
    if (!app.game_running) return
    if (num === 'blank') return
    const num_index = app.board.indexOf(num)
    const blank_index = app.board.indexOf('blank')
    if (app.returnBlankIndex(num_index) === -1 ) {
      return
    }
    app.movePiece(num_index, blank_index)
  },
  pieceOnClick: ({target}) => {
    app.isValidClick(target.innerText)
  },
  startButtonOnClick: () => {
    if (!app.game_running) {
      app.game_running = true
      app.start_button.innerText = 'Restart Game'
    } else {
      app.initGame()
    }
  },
  updateCounter: () => {
    app.moves_count_span.innerHTML = ++app.moves_count
  },
  movePiece: (num_index, blank_index) => {
    const temp = app.board[num_index]
    app.board[num_index] = app.board[blank_index]
    app.board[blank_index] = temp
    app.renderPieces()
    app.updateCounter()
    setTimeout(() => app.winDetection() )
  },
  winDetection: () => {
    if (app.board[app.board.length - 1] !== 'blank') {
      return false
    }
    for (var i = 0; i < 15; i++) {
      if (Number(app.board[i-1]) > Number(app.board[i])) {
        return false
      }
    }
    window.alert(`You won in ${app.moves_count} moves`)
    app.game_running = false
    return
  },
  fakeWin: () => {
    app.board.sort((a,b) => {
      if (a === 'blank') return 1
      a = Number(a)
      b = Number(b)
      if (a > b) {
        return 1
      }
      return -1
    })
    app.renderPieces()
    setTimeout(() => { app.winDetection() }, 500 )
    app.game_running = false
    app.start_button.innerText = 'Start Game'
  }
}