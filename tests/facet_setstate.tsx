import React, { useState, useEffect } from 'react'

// import { useFacetState, useFacetEffect } from '@react-facet/core'
import { createFiberRoot, createReconciler } from '@react-facet/dom-fiber'

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

const reconcilerInstance = createReconciler()

const fiberRoot = createFiberRoot(reconcilerInstance)(root as HTMLElement)

reconcilerInstance.updateContainer(<Counter />, fiberRoot, null, () => {})

console.time("test")
