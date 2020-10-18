import { useState, useLayoutEffect, useCallback, RefObject } from 'react';
import { ScrollView, View } from 'react-native';

import { LrcLine } from '../constant';
// import debounce from '../util/debounce';

export default ({
  lrcLineList,
  lrcLineNodeList,
  lrcRef,
  spaceTop,
}: {
  lrcLineList: LrcLine[];
  lrcLineNodeList: View[];
  lrcRef: RefObject<ScrollView>;
  spaceTop: number;
}) => {
  const [indexMapScrollTop, setIndexMapScrollTop] = useState<{
    [key: number]: number;
  }>({});
  const caculate = useCallback(() => {
    const map: { [key: number]: number } = {};
    const lrcNode = lrcRef.current?.getInnerViewNode() as View;
    lrcNode?.measureInWindow((_x, lrcNodeY, _width, lrcNodeHeight) => {
      for (let i = 0, { length } = lrcLineNodeList; i < length; i += 1) {
        const lrcLineNode = lrcLineNodeList[i];
        lrcLineNode.measureInWindow((_, lrcLineNodeY) => {
          map[i] = lrcLineNodeY - lrcNodeY - lrcNodeHeight * spaceTop;
        });
      }
      setIndexMapScrollTop(map);
    });
  }, [spaceTop, lrcRef, lrcLineNodeList]);

  useLayoutEffect(() => {
    caculate();
  }, [caculate, lrcLineList]);

  return indexMapScrollTop;
};
