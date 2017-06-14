interface DraggableOptions {
  drag?: Function;
  start?: Function;
  end?: Function;
  preventClick?: Boolean;
  minDistance?: number;
  cancelBubble?: boolean;
}

interface DragState {
  startLeft: number;
  startTop: number;
}

const PREVENT_CLICK_PROP = 'PREVENT_CLICK';
const EVENT_BOUND = 'rr-event-bound';

const isBound = function(el: Element) {
  return el.hasAttribute(EVENT_BOUND);
};

const markBound = function(el: Element) {
  if (el && el.setAttribute) {
    el.setAttribute(EVENT_BOUND, 'DONE');
  } else {
    throw new Error('[markBound] element is required!');
  }
};

export default function(element: Element, options: DraggableOptions) {
  if (isBound(element)) {
    return;
  } else {
    markBound(element);
  }

  let isDragging = false;
  options = options || {};
  const minDistance = options.minDistance || 3;
  const preventClick = typeof options.preventClick === 'undefined' ? true : options.preventClick;
  const cancelBubble = typeof options.cancelBubble === 'undefined' ? true : options.cancelBubble;

  const dragState: DragState = {
    startLeft: null,
    startTop: null
  };

  const start = (event: Event) => {
    if (options.start) {
      const result = options.start(event);
      isDragging = result !== false;
    } else {
      isDragging = true;
    }
  };

  const end = (event: Event) => {
    dragState.startLeft = null;
    dragState.startTop = null;
    if (isDragging && options.end) {
      options.end(event);
    }
    isDragging = false;
  };

  const moveFn = function(event: MouseEvent) {
    if (!isDragging) {
      const { startLeft, startTop } = dragState;
      const deltaLeft = Math.abs(event.clientX - startLeft);
      const deltaTop = Math.abs(event.clientY - startTop);
      if (deltaLeft > minDistance || deltaTop > minDistance) {
        start(event);
      }
    }
    if (isDragging && options.drag) {
      options.drag(event);
    }
  };

  const upFn = function(event: MouseEvent) {
    setTimeout(() => {
      if (preventClick && element.getAttribute(PREVENT_CLICK_PROP)) {
        element.removeAttribute(PREVENT_CLICK_PROP);
      }
    }, 0);
    document.removeEventListener('mousemove', moveFn);
    document.removeEventListener('mouseup', upFn);
    document.onselectstart = null;
    document.ondragstart = null;

    end(event);
  };

  element.addEventListener('click', function(event: Event) {
    if (preventClick && element.getAttribute(PREVENT_CLICK_PROP)) {
      event.stopPropagation();
      element.removeAttribute(PREVENT_CLICK_PROP);
    }
  });

  element.addEventListener('mousedown', function(event: MouseEvent) {
    if (isDragging) return;
    document.onselectstart = function() { return false; };
    document.ondragstart = function() { return false; };
    document.addEventListener('mousemove', moveFn);
    document.addEventListener('mouseup', upFn);

    if (cancelBubble) {
      event.stopPropagation();
    }

    if (preventClick) {
      element.setAttribute(PREVENT_CLICK_PROP, 'true');
    }

    if (minDistance > 0) {
      dragState.startLeft = event.clientX;
      dragState.startTop = event.clientY;
    } else {
      start(event);
    }
  });
};
