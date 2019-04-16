# Pseudonymization module

## Usage

```
import {pseudonymize} from 'pseudonymization'

pseudonymize('Karlstad', ['city']) // returns random city

pseudonymize('Karlstad', ['city', '1']) // returns random city
pseudonymize('Karlstad', ['city', '1']) // returns Karlstad again

pseudonymize('Karlstad', ['city', '2']) // returns random city, but not Karlstad

```

## Bugs

`package.json` contains too many dependencies due to copy-paste, find out which
ones are needed for the tests.

## Changing data

For now, all the named entities live in `src/names.ts` and may be changed there.

## Development

Use `yarn test` and `yarn build` before committing.