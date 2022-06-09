import React, { useState, useEffect } from 'react'

import { createRoot } from 'react-dom/client'

import { root, dom } from '../dom'

window = dom.window
document = dom.document

const Counter = () => {
  const [counter, setCounter] = useState(0)

  useEffect(
    () => {
      counter !== ITERATIONS
        ? Promise.resolve(1).then(() => setCounter(counter + 1))
        : console.timeEnd("test")
    },
    [counter],
  )

  return (
    <div>
      <p>
        Counter: <fast-text text={counter} />
      </p>
    </div>
  )
}

const fiberRoot = createRoot(root as HTMLElement)

fiberRoot.render(<Counter />)

console.time("test")
