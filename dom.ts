import { parseHTML } from 'linkedom';

export const dom = parseHTML(`
  <!doctype html>
  <html lang="en">
    <head>
      <title>TestPerf</title>
    </head>
    <body>
      <root>
      </root>
    </body>
  </html>
`);

export const root = dom.window.document.querySelector('root')

