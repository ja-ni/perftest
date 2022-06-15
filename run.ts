/// <reference lib="esnext" />

import * as R from "https://esm.sh/ramda@0.28.0";

import { join } from "https://deno.land/std@0.142.0/path/mod.ts";

import { build, stop } from "https://deno.land/x/esbuild@v0.14.38/mod.js";

const INDIR = "tests";
const OUTDIR = "runs";

const iterations = [
  100,
  1_000,
  10_000,
  100_000,
  1_000_000,
];

// Get source files from the test directory
const entryPoints = Array.from(Deno.readDirSync("tests"))
  .map(({ name }) => join(INDIR, name));

// Clean any existing output directories
try {
  Deno.removeSync(OUTDIR, { recursive: true });
} catch {
}

// Expand the test files for each number of iterations
const tests = iterations.map((iteration) =>
  build({
    entryPoints,
    entryNames: `[name]_${iteration}`,
    outdir: OUTDIR,
    bundle: true,
    minify: true,
    // write: false,
    define: {
      ITERATIONS: `${iteration}`,
    },
  })
);

await Promise.allSettled(tests);

// Run the newly compiled test files using d8 and return the stdout result
const runs = Array.from(Deno.readDirSync("runs"))
  .map(async ({ name }: any) => {
    const run = Deno.run({
      cmd: ["d8", join(OUTDIR, name)],
      stdin: "piped",
      stdout: "piped",
    });

    await run.status();

    const output = new TextDecoder().decode(await run.output())

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

// Print the test results on screen
const results = (await Promise.allSettled(runs))
  .filter(({ status }) => status === "fulfilled")
  .map(({ value }: any) => value);

const json = results.reduce((acc, [lib, test, iterations, time]) => ({
  ...acc,
  [lib]: {
    ...acc[lib] ?? {},
    [test]: {
      ...acc?.[lib]?.[test] ?? {},
      [iterations]: time,
    },
  },
}), {});

console.log(json);

// Cleanup
try {
  Deno.removeSync(OUTDIR, { recursive: true });
} catch {
}

stop();

Deno.exit();
