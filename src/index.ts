//----------------------------------------------------------------------------//
//                        Svelte Action Touch-to-Mouse                        //
//----------------------------------------------------------------------------//
import type {
  TouchToMouse,
  TouchToMouseParams,
  TouchToMouseReturn,
  ValueOf,
} from './types';
/**
 * Svelte action that converts automatically touch events into mouse events. Recommended for dragging elements
 * Add the parameter `deep` to true to capture touch events from the current element and its children.
 * This will add the following style properties inline to the main element:
 * ```css
 *   -webkit-touch-callout:none;
 *   -ms-touch-action: none;
 *   touch-action: none;
 * ```
 * see https://stackoverflow.com/questions/1517924/javascript-mapping-touch-events-to-mouse-events
 * and https://stackoverflow.com/questions/5885808/includes-touch-events-clientx-y-scrolling-or-not
 *
 * @example <button use:touchToMouse={{deep: true}} on:mousedown={onMouseDown}>
 * <svelte:window on:mousemove={onMouseMove} />
 */
export const touchToMouse: TouchToMouse = (
  node: HTMLElement,
  params: TouchToMouseParams = {}
) => {
  if (typeof params !== 'object' || Array.isArray(params) || params === null) {
    console.error('Svelte Touch to Mouse: params must be an object');
    return;
  }
  params = { deep: false, ...params };
  const TouchEventMapper = (originalEvent: TouchEvent) => {
    let target = originalEvent.target as Element;

    if (params?.deep && !node.contains(target)) return;
    else if (node !== target) return;

    const mapType = {
      touchstart: 'mousedown',
      touchmove: 'mousemove',
      touchend: 'mouseup',
      touchcancel: 'mouseup',
    } as const;

    const simulatedEventType: ValueOf<typeof mapType> | undefined =
      mapType[originalEvent.type as keyof typeof mapType];
    if (!simulatedEventType) return;

    let firstTouch = originalEvent.changedTouches[0];

    let clientX = firstTouch.clientX,
      pageX = firstTouch.pageX,
      PageXOffset = window.scrollX;
    let clientY = firstTouch.clientY,
      pageY = firstTouch.pageY,
      PageYOffset = window.scrollY;
    if (
      (pageX === 0 && Math.floor(clientX) > Math.floor(pageX)) ||
      (pageY === 0 && Math.floor(clientY) > Math.floor(pageY))
    ) {
      clientX -= PageXOffset;
      clientY -= PageYOffset;
    } else if (clientX < pageX - PageXOffset || clientY < pageY - PageYOffset) {
      clientX = pageX - PageXOffset;
      clientY = pageY - PageYOffset;
    }

    let simulatedEvent = new MouseEvent(simulatedEventType, {
      bubbles: true,
      cancelable: true,
      screenX: firstTouch.screenX,
      screenY: firstTouch.screenY,
      clientX,
      clientY,
      // @ts-ignore we definitely want "pageX" and "pageY"
      pageX,
      pageY,
      buttons: 1,
      button: 0,
      ctrlKey: originalEvent.ctrlKey,
      shiftKey: originalEvent.shiftKey,
      altKey: originalEvent.altKey,
      metaKey: originalEvent.metaKey,
    });

    firstTouch.target.dispatchEvent(simulatedEvent);
    //    originalEvent.preventDefault()
  };

  document.addEventListener('touchstart', TouchEventMapper, true);
  document.addEventListener('touchmove', TouchEventMapper, true);
  document.addEventListener('touchend', TouchEventMapper, true);
  document.addEventListener('touchcancel', TouchEventMapper, true);

  const attributes = node.getAttribute('style');
  (node as HTMLElement).setAttribute(
    'style',
    `${
      attributes ? `${attributes};` : ''
    } -webkit-touch-callout:none; -ms-touch-action: none; touch-action: none;`
  );

  return {
    destroy() {
      // self clean events to avoid memory leaks when the component is destroyed and recreated
      document.removeEventListener('touchstart', TouchEventMapper, true);
      document.removeEventListener('touchmove', TouchEventMapper, true);
      document.removeEventListener('touchend', TouchEventMapper, true);
      document.removeEventListener('touchcancel', TouchEventMapper, true);
    },
  };
};
