/// <reference lib="esnext" />

import { join } from "https://deno.land/std@0.142.0/path/mod.ts";

import { build, stop } from "https://deno.land/x/esbuild@v0.14.38/mod.js";

const INDIR = "tests";
const TMPDIR = "runs";

const iterations = [
  ...Array.from({ length: 9 }, (_, i) => (i + 1) * 1),
  ...Array.from({ length: 9 }, (_, i) => (i + 1) * 10),
  // ...Array.from({ length: 9 }, (_, i) => (i + 1) * 100),
  // ...Array.from({ length: 9 }, (_, i) => (i + 1) * 1000),
  // ...Array.from({ length: 9 }, (_, i) => (i + 1) * 10_000),
  // ...Array.from({ length: 9 }, (_, i) => (i + 1) * 100_000),
  // 1_000_000,
];

// Clean any existing output directories
try {
  Deno.removeSync(TMPDIR, { recursive: true });
} catch {
}

// Get source files from the test directory
const entryPoints = Array.from(Deno.readDirSync("tests"))
  .map(({ name }) => join(INDIR, name));

// Expand the test files for each number of iterations
const tests = iterations.map((iteration) =>
  build({
    entryPoints,
    entryNames: `[name]_${iteration}`,
    outdir: TMPDIR,
    bundle: true,
    minify: true,
    define: {
      ITERATIONS: `${iteration}`,
    },
  })
);

await Promise.allSettled(tests);

// Run the newly compiled test files using d8 and return the stdout result
const runs = Array.from(Deno.readDirSync("runs"))
  .map(({ name }: any) => async () => {
    const run = Deno.run({
      cmd: ["d8", join(TMPDIR, name)],
      stdin: "piped",
      stdout: "piped",
      stderr: "piped",
    });

    await run.status();

    const output = new TextDecoder().decode(await run.output())
    
    // console.log(output)

    const [_, time] = output
      .split(",")
      .map((part: string) => part.trim());

    run.close();

    return [
      ...name
        .replace(/\.js$/, "")
        .split("_"),
      time,
    ];
  });

// Filter any erronous runs and return the output values
// const results = (await Promise.allSettled(runs))
//   .filter(({ status }) => status === "fulfilled")
//   .map(({ value }: any) => value);

const asyncSyncArray = async ([x, ...xs], rs = []) => (
  xs.length
    ? asyncSyncArray(xs, [...rs, await x()])
    : [...rs, await x()]
)

const results = await asyncSyncArray(runs)

// Structure the output data into a nested json object
const json = results.reduce((acc, [lib, test, iterations, time]) => ({
  ...acc,
  [test]: {
    ...acc[test] ?? {},
    [lib]: {
      ...acc?.[test]?.[lib] ?? {},
      [iterations]: time,
    },
  },
}), {});

// Load existing results
const previous = (async () => {
  try {
    return JSON.parse(await Deno.readTextFile('results.json'))
  } catch {
    return {}
  }
})()


// Write ouput results to file
const jsonText = new TextEncoder().encode(JSON.stringify({
  ...previous,
  [Date.now()]: json
}))

await Deno.writeFile('results.json', jsonText)

// Cleanup
try {
  Deno.removeSync(TMPDIR, { recursive: true });
} catch {
}

stop();

console.log('Results updated!')

Deno.exit();
