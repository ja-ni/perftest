import React from 'react'

import { useFacetState, useFacetEffect, Map, useFacetWrap, useFacetMap } from '@react-facet/core'
import { createFiberRoot, createReconciler } from '@react-facet/dom-fiber'

import { root, dom } from '../dom'

window = dom.window
document = dom.document

const Component = () => {
  const [counter, setCounter] = useFacetState(0)
  const list = useFacetWrap([])

  useFacetEffect(
    (value) => {
      value !== ITERATIONS
        ? Promise.resolve(1).then(() => setCounter(value + 1))
        : console.timeEnd("test")
    },
    [],
    [counter]
  )

  const listUpdate = useFacetMap(() => Array.from({length: parseInt(Math.random() * 20)}, () => '' + Math.random()), [], [counter])

  return (
    <div>
      <Map array={listUpdate}>
        {(item) => (
          <p>
            Map: <fast-text text={item} />
          </p>
        )}
      </Map>
    </div>
  )
} 

const reconcilerInstance = createReconciler()

const fiberRoot = createFiberRoot(reconcilerInstance)(root as HTMLElement)

reconcilerInstance.updateContainer(<Component />, fiberRoot, null, () => {})

console.time("test")
