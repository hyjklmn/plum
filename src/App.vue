<script setup lang="ts">
import { ref, onMounted, computed } from "vue"
const el = ref<HTMLCanvasElement>()
const ctxVal = computed(() => el.value!.getContext("2d"))
const WIDTH = 800
const HEIGHT = 600

interface Point {
  x: number
  y: number
}

interface Branch {
  start: Point
  length: number
  theta: number
}
function randomInitPostion() {
  let x = Math.random() * WIDTH
  let y = Math.random() * HEIGHT
  return { x, y }
}

function init() {
  const { x, y } = randomInitPostion()
  step({
    start: { x: WIDTH / 2, y: HEIGHT },
    length: Math.random() * 50,
    theta: -Math.PI / 2,
  })
}

const penddingTasks: Function[] = []

function step(b: Branch, depth = 0) {
  const end = getEndPoint(b)
  drawBranch(b)
  if (Math.random() < 0.5 || depth < 5) {
    penddingTasks.push(() =>
      step(
        {
          start: end,
          length: b.length + (Math.random() * 10 - 5),
          theta: b.theta - 0.3 * Math.random(),
        },
        depth + 1
      )
    )
  }
  if (Math.random() < 0.5 || depth < 5) {
    penddingTasks.push(() =>
      step(
        {
          start: end,
          length: b.length + (Math.random() * 10 - 5),
          theta: b.theta + 0.3 * Math.random(),
        },
        depth + 1
      )
    )
  }
}
function frame() {
  const tasks = [...penddingTasks]
  penddingTasks.length = 0
  tasks.forEach((fn) => fn())
}
let framesCount = 0

function startFrame() {
  requestAnimationFrame(() => {
    if (framesCount % 10 === 0) {
      frame()
      startFrame()
    }
  })
}
startFrame()
function lineTo(p1: Point, p2: Point) {
  const ctx = ctxVal.value!
  ctx.strokeStyle = "rgba(0,0,0,.15)"
  ctx.shadowOffsetX = 0.5
  ctx.shadowOffsetY = 0.5
  ctx.shadowColor = "rgba(0, 0, 0, 0.15)"
  ctx.beginPath()
  ctx.moveTo(p1.x, p1.y)
  ctx.lineTo(p2.x, p2.y)
  ctx.stroke()
}

function getEndPoint(b: Branch): Point {
  return {
    x: b.start.x + b.length * Math.cos(b.theta),
    y: b.start.y + b.length * Math.sin(b.theta),
  }
}

function drawBranch(b: Branch) {
  lineTo(b.start, getEndPoint(b))
}
onMounted(() => {
  init()
})
</script>

<template>
  <div
    ref="box"
    relative
    h-100vh
    top-0
    bottom-0
    left-0
    right-0
    pointer-events-none
  >
    <div
      absolute
      transform
      style="translate: -50% -50%"
      class="top-50% left-50%"
    >
      <p style="font-family: French Script MT; font-size: 50px">Plum</p>
      <canvas ref="el" :width="WIDTH" :height="HEIGHT" border rounded></canvas>
    </div>
  </div>
</template>
