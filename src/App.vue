<script setup lang="ts">
import { ref, onMounted, computed } from "vue"
import Header from "./components/Header.vue"
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
  let x = Math.floor(Math.random() * WIDTH)
  let arr = [0, 600]
  let r = Math.floor(Math.random() * arr.length)
  let y = arr[r]
  return { x, y }
}

function init() {
  const { x, y } = randomInitPostion()

  step({
    start: { x, y },
    length: 5,
    theta: y ? -Math.PI / 4 : Math.PI / 4,
  })
}

const penddingTasks: Function[] = []

function step(b: Branch, depth = 0) {
  const end = getEndPoint(b)
  drawBranch(b)
  if (Math.random() < 0.5 || depth < 4) {
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
  if (Math.random() < 0.5 || depth < 4) {
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
    framesCount += 1
    if (framesCount % 3 === 0) {
      frame()
    }
    startFrame()
  })
}
startFrame()
function lineTo(p1: Point, p2: Point) {
  const ctx = ctxVal.value!
  ctx.strokeStyle = "rgba(107, 114, 128, 0.2)"
  ctx.shadowOffsetX = 0.5
  ctx.shadowOffsetY = 0.5
  ctx.shadowColor = "rgba(107, 114, 128, 0.2)"
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
function reDraw() {
  ctxVal.value?.clearRect(0, 0, WIDTH, HEIGHT)
  init()
}
onMounted(() => {
  init()
})
</script>

<template>
  <div ref="box" relative h-100vh top-0 bottom-0 left-0 right-0>
    <Header />

    <div
      absolute
      transform
      select-none
      style="translate: -50% -50%"
      class="top-50% left-50%"
    >
      <p style="font-family: French Script MT; font-size: 50px">
        <span>Plum</span>
      </p>

      <canvas
        ref="el"
        :width="WIDTH"
        :height="HEIGHT"
        border="~ gray/30"
        rounded
      ></canvas>
      <button
        border="~ gray/30"
        rounded
        p-2
        mt-3
        cursor-pointer
        @click="reDraw"
        hover="bg-gray-300/10"
      >
        Redraw
      </button>
    </div>
  </div>
</template>
