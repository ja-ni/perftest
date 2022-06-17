import React, { useState, useEffect } from 'react'

import { createRoot } from 'react-dom/client'

import { root, dom } from '../dom'

window = dom.window
document = dom.document

const Component = () => {
  const [counter, setCounter] = useState(0)

  useEffect(
    () => {
      counter !== ITERATIONS
        ? Promise.resolve(1).then(() => {
          setCounter(counter + 1)
        })
        : console.timeEnd("test")
    },
    [counter],
  )

  return (
    <div>
      { counter % 2 && (
        <p>
          Counter: <span>{counter}</span>
        </p>
      )}
    </div>
  )
}

const fiberRoot = createRoot(root as HTMLElement)

fiberRoot.render(<Component />)

console.time("test")
