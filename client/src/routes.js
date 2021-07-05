import Home from './components/Home.vue'
import Game from './components/Game.vue'
export default [
    { path: '/', component: Home },
    { path: '/game', component: Game, params: {count: true} },
]

