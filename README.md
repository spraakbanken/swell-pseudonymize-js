# Pseudonymization module

## Usage

```
import {psedonymize} from 'pseudonymization'

pseudonymize('Karlstad', ['city']) // returns random city

pseudonymize('Karlstad', ['city', '1']) // returns random city
pseudonymize('Karlstad', ['city', '1']) // returns Karlstad again

pseudonymize('Karlstad', ['city', '2']) // returns random city, but not Karlstad

```

## Bugs

There is an issue with the pseudonymizer failing to return the same named
entity even though the running number is the same (sometimes).

Maybe an issue that the it can randomly select the same named entity twice, for
different running numbers.

Also we should return a different named entity every time it is called without
running numbers for simplicity.

The fancy import statement above, has not been tested.

`package.json` contains too many dependencies due to copy-paste, find out which
ones are needed for the tests.

## Changing data

For now, all the named entities live in `src/names.ts` and may be changed there.
