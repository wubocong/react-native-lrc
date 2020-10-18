# react-native-lrc [![version](https://img.shields.io/npm/v/react-native-lrc)](https://www.npmjs.com/package/react-native-lrc) [![license](https://img.shields.io/npm/l/react-native-lrc)](https://github.com/wubocong/react-native-lrc/blob/master/LICENSE)

The react native component that display lyric from lrc format. Inspired by [Mebtte's react-lrc](https://github.com/mebtte/react-lrc)

## Feature

- Pure javascript, cross platform
- Auto scroll smoothly
- User srcollable
- Custom style

## Requirement

- `react >= 16.8` with `hook`
- If used on browser `react-native-web >= 0.11`

## Usage

```sh
npm install --save react-native-lrc
```

```jsx
import React, { useCallback } from 'react';
import { Text } from 'react-native';
import { Lrc } from 'react-native-lrc';

const Lyric = ({ lrc, currentTime }) => {
  const lineRenderer = useCallback(
    ({ lrcLine: { millisecond, content }, index, active }) => (
      <Text
        style={{ textAlign: 'center', color: active ? 'green' : 'inherit' }}>
        {content}
      </Text>
    ),
    [],
  );
  const onCurrentLineChange = useCallback(
    ({ lrcLine: { millisecond, content }, index }) =>
      console.log(index, millisecond, content),
    [],
  );

  return (
    <Lrc
      lrc={lrc}
      currentTime={currentTime}
      lineRenderer={lineRenderer}
      onCurrentLineChange={onCurrentLineChange}
    />
  );
};

export default Lyric;
```

### `Lrc` Props

| prop                      | description                                                                          | type                                                                                                             | default                                                                                                                          |
| ------------------------- | ------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| lrc                       | lrc string                                                                           | string                                                                                                           | required                                                                                                                         |
| lineRenderer              | lrc line render method                                                               | ({ lrcLine: { id: string, millisecond: number, content: string }, index: number, active: boolean }) => ReactNode | ({ lrcLine: { content }, active }) => (<Text style={{ textAlign: 'center', color: active ? 'green' : '#666' }}>{content}</Text>) |
| currentTime               | current time                                                                         | number, **millisecond**                                                                                          | 0                                                                                                                                |
| autoScroll                | whether auto scroll                                                                  | boolean                                                                                                          | true                                                                                                                             |
| autoScrollAfterUserScroll | auto scroll after user scroll                                                        | number, **millisecond**                                                                                          | 6000                                                                                                                             |
| spaceTop                  | space on lrc component top, percent of lrc component                                 | number, 0~1                                                                                                      | 0.4                                                                                                                              |
| onCurrentLineChange       | when current line change                                                             | ({ index: number, lrcLine: { id: string, millisecond: number, content: string } \| null }) => void               | null                                                                                                                             |
| `other props`             | other react-native [ScrollView](https://reactnative.dev/docs/scrollview#props) Props |                                                                                                                  |                                                                                                                                  |

### `Lrc` Methods

| method              | description                                | type                                                                                           |
| ------------------- | ------------------------------------------ | ---------------------------------------------------------------------------------------------- |
| scrollToCurrentLine | scroll to current line and set auto scroll | () => void                                                                                     |
| getCurrentLine      | get the current lrc line                   | () => { lrcLine: { id: string, millisecond: number, content: string } \| null, index: number } |

## Other API

### parseLrc

```jsx
import { parseLrc } from 'react-native-lrc';

parseLrc(lrcString); // { id: string, millesecond: number, content: string }[]
```

### useLrc

```jsx
import React from 'react';
import { useLrc } from 'react-native-lrc';

const Component = () => {
  const lrcLineList = useLrc(lrcString); // { id: string, millesecond: number, content: string }[]
  // ...
};
```

## Question

### Why lrc component do not auto scroll

You probably do not give `height` to `Lrc`. The `height` make `Lrc` scrollable.

### How to prevent user scroll

```jsx
<Lrc scrollEnabled={false} autoScrollAfterUserScroll={0} {...otherProps} />
```

## Typescript

`react-native-lrc` export type `LrcLine`.

```tsx
import React from 'react';
import { LrcLine } from 'react-native-lrc';

const Component = () => {
  const lineRenderer = React.useCallback(
    ({ lrcLine }: { lrcLine: LrcLine }) => {
      // ...
    },
    [],
  );
  // ...
  return <Lrc lineRenderer={lineRenderer} {...otherProps} />;
};
```

## License

MIT
