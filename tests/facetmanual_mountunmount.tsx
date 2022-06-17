import React, { useRef } from 'react'

import { useFacetEffect, useFacetState } from '@react-facet/core'
import { createFiberRoot, createReconciler } from '@react-facet/dom-fiber'
 
import { root, dom } from '../dom'

window = dom.window
document = dom.document

const Component = () => {
  const [counter, setCounter] = useFacetState(0)

  const ref = useRef<HTMLSpanElement>(null)

  const refParent = useRef<HTMLParagraphElement>(null)
 
  useFacetEffect(
    (value) => {
      if (ref.current === null) return
      if (refParent.current === null) return

      value !== ITERATIONS
        ? Promise.resolve(1).then(() => {
            setCounter(value + 1)
        })
        : console.timeEnd("test")

      if(value % 2) {
        refParent.current.insertAdjacentElement('beforeend', ref.current)

        ref.current.textContent = `${value ?? 0}`
      } else {
        refParent.current.removeChild(ref.current)
      }
 
    },
    [],
    [counter],
  )
 
  return (
    <div>
      <p ref={refParent}>
        Counter: <span ref={ref} />
      </p>
    </div>
  )
}

const reconcilerInstance = createReconciler()

const fiberRoot = createFiberRoot(reconcilerInstance)(root as HTMLElement)

reconcilerInstance.updateContainer(<Component />, fiberRoot, null, () => {})

console.time("test")
