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

export default function(element: Element, options: DraggableOptions) {
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
    isDragging = true;

    if (options.start) {
      options.start(event);
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
