# Perftest

This repository is used to run low level performance tests on the `react-facets` library and benchmark the results against the standard version of `react`.

These tests are run on the v8 engine directly to closer provide parity to the v8 utilization within the GameFace library.

> [Link to Data Visualisation](https://starboard.gg/space-shell/perftest-nzsGlap)

## Requirements

All requirements can be installed via your systems package manager such as `choco`, `brew`, `yay`, etc...

- Deno
- Yarn / NPM
- v8

## Writing Tests

Tests cases go in the `tests` folder and are written in Typescript using `tsx`. The idea behind the test cases is to maintain consistency across the different frameworks.

The general timing pattern is as follows, mount the component, begin timer, run iterations, end timer.

## Running Tests

Run the `main.ts` entry script using Deno.

The test can also be run using the pre-configured `tests` Deno task as shown below:

```shell
$ deno task tests
```

## Application Overview

The `main.ts` is the initial entry point to the application and performs a series of tasks to produce an output `results-[epochtime].json` file. The series of actions are as follows.

- Clean the temporary file storage directory
- Read the `.tsx` filenames from the `tests` directory
- Compile the test files to es5 bundles via `esbuild`
- Read the output `.js` filenames from the temporary `runs` folder
- Run the `.js` files from the `runs` folder via `d8`
- Collet the `stdout` from each run
- Write output to a `results-[epochtime].json` file to the `results` directory
- Cleanup the temporary `runs` directory
- Close handles and exit the application

## Deployment

The resulting output data is stored within Github pages / releases for later data processing and visualisation.

## Considerations

The resulting output data may be best stored on disk in some other format such as `csv` or `sqlite`.
