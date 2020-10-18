import React, { useRef, useImperativeHandle, useEffect } from 'react';
import { ScrollView, Text, View } from 'react-native';

import { LrcLine, AUTO_SCROLL_AFTER_USER_SCROLL } from '../constant';
import useLrc from '../util/use_lrc';
import useIndexMapScrollTop from './use_index_map_scroll_top';
import useCurrentIndex from './use_current_index';
import useLocalAutoScroll from './use_local_auto_scroll';

interface Props {
  /** lrc string */
  lrc: string;
  /** lrc line render */
  lineRenderer: ({
    lrcLine,
    index,
    active,
  }: {
    lrcLine: LrcLine;
    index: number;
    active: boolean;
  }) => React.ReactNode;
  /** audio currentTime, millisecond */
  currentTime?: number;
  /** whether auto scroll  */
  autoScroll?: boolean;
  /** auto scroll after user scroll */
  autoScrollAfterUserScroll?: number;
  /** space on lrc component top, percent of lrc component */
  spaceTop?: number;
  /** when current line change */
  onCurrentLineChange?: ({
    index,
    lrcLine,
  }: {
    index: number;
    lrcLine: LrcLine | null;
  }) => void;
  [key: string]: any;
}

// eslint-disable-next-line no-spaced-func
const Lrc = React.forwardRef<
  {
    scrollToCurrentLine: () => void;
    getCurrentLine: () => {
      index: number;
      lrcLine: LrcLine | null;
    };
  },
  Props
>(function Lrc(
  {
    lrc,
    lineRenderer = ({ lrcLine: { content }, active }) => (
      // eslint-disable-next-line react-native/no-inline-styles
      <Text style={{ textAlign: 'center', color: active ? 'green' : '#666' }}>
        {content}
      </Text>
    ),
    currentTime = 0,
    spaceTop = 0.4,
    autoScroll = true,
    autoScrollAfterUserScroll = AUTO_SCROLL_AFTER_USER_SCROLL,
    onCurrentLineChange,
    ...props
  }: Props,
  ref,
) {
  const lrcRef = useRef<ScrollView>(null);
  const lrcLineNodesRef = useRef<View[]>([]);
  const lrcLineList = useLrc(lrc);
  const indexMapScrollTop = useIndexMapScrollTop({
    lrcLineList,
    lrcLineNodeList: lrcLineNodesRef.current,
    lrcRef,
    spaceTop: autoScroll ? spaceTop : 0,
  });
  const currentIndex = useCurrentIndex({ lrcLineList, currentTime });
  const {
    localAutoScroll,
    resetLocalAutoScroll,
    onScroll,
  } = useLocalAutoScroll({
    autoScroll,
    autoScrollAfterUserScroll,
  });

  // auto scroll
  useEffect(() => {
    if (localAutoScroll) {
      lrcRef.current?.scrollTo({
        y: indexMapScrollTop[currentIndex] || 0,
        animated: true,
      });
    }
  }, [currentIndex, localAutoScroll, indexMapScrollTop]);

  // on current line change
  useEffect(() => {
    onCurrentLineChange &&
      onCurrentLineChange({
        index: currentIndex,
        lrcLine: lrcLineList[currentIndex] || null,
      });
  }, [lrcLineList, currentIndex, onCurrentLineChange]);

  useImperativeHandle(ref, () => ({
    getCurrentLine: () => ({
      index: currentIndex,
      lrcLine: lrcLineList[currentIndex] || null,
    }),
    scrollToCurrentLine: () => {
      resetLocalAutoScroll();
      lrcRef.current?.scrollTo({
        y: indexMapScrollTop[currentIndex] || 0,
        animated: true,
      });
    },
  }));

  return (
    <ScrollView
      {...props}
      ref={lrcRef}
      scrollEventThrottle={40}
      onScroll={onScroll}>
      <View>
        {autoScroll ? <View style={{ height: `${spaceTop * 100}%` }} /> : null}
        {lrcLineList.map((lrcLine, index) => (
          <View
            key={lrcLine.id}
            ref={(node) => {
              if (node) {
                lrcLineNodesRef.current[index] = node;
              }
            }}>
            {lineRenderer({ lrcLine, index, active: currentIndex === index })}
          </View>
        ))}
        {autoScroll ? (
          <View style={{ height: `${(1 - spaceTop) * 100}%` }} />
        ) : null}
      </View>
    </ScrollView>
  );
});

export default Lrc;
