import React from 'react'

import { useFacetState, useFacetEffect, useFacetMap, Mount, NO_VALUE } from '@react-facet/core'
import { createFiberRoot, createReconciler } from '@react-facet/dom-fiber'

import { root, dom } from '../dom'

window = dom.window
document = dom.document

const Component = () => {
  const [counter, setCounter] = useFacetState(0)

  useFacetEffect(
    (value) => {
      value !== ITERATIONS
        ? Promise.resolve(1).then(() => {
          setCounter(value + 1)
        })
        : console.timeEnd("test")
    },
    [],
    [counter],
  )

  // NOTE - JN - Tested with useFacetMap and useFacetState, similar results
  const mount = useFacetMap((value) => value !== null && Boolean(value % 2), [], [counter])

  return (
    <div>
      <Mount when={mount}>
        <p>
          Counter: <fast-text text={counter} />
        </p>
      </Mount>
    </div>
  )
}

const reconcilerInstance = createReconciler()

const fiberRoot = createFiberRoot(reconcilerInstance)(root as HTMLElement)

reconcilerInstance.updateContainer(<Component />, fiberRoot, null, () => { })

console.time("test")
