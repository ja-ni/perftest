import React, { useRef } from 'react'

import { useFacetEffect, useFacetState } from '@react-facet/core'
import { createFiberRoot, createReconciler } from '@react-facet/dom-fiber'
 
import { root, dom } from '../dom'

window = dom.window
document = dom.document

const Counter = () => {
  const [counter, setCounter] = useFacetState(0)

  const ref = useRef<HTMLSpanElement>(null)
 
  useFacetEffect(
    (value) => {
      if (ref.current === null) return

      value !== ITERATIONS
        ? Promise.resolve(1).then(() => setCounter(value + 1))
        : console.timeEnd("test")
 
      ref.current.textContent = `${value ?? 0}`
    },
    [],
    [counter],
  )
 
  return (
    <div>
      <p>
        Counter: <span ref={ref} />
      </p>
    </div>
  )
}

const reconcilerInstance = createReconciler()

const fiberRoot = createFiberRoot(reconcilerInstance)(root as HTMLElement)

reconcilerInstance.updateContainer(<Counter />, fiberRoot, null, () => {})

console.time("test")
