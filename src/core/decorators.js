function decorateToggle(target, stateProp, prop, bool) {
  const descriptor = Object.getOwnPropertyDescriptor(target, prop);

  if (descriptor) {
    const fn = descriptor.value;

    descriptor.value = function (...args) {
      if (this[stateProp] === bool) {
        return;
      }
      this[stateProp] = bool;

      fn.call(this, ...args);
    };

    Object.defineProperty(target, prop, descriptor);
  } else {
    target[prop] = function () {
      if (this[stateProp] === bool) {
        return;
      }
      this[stateProp] = bool;
    };
  }
}

export function toggle(state, on, off, initialValue = false) {
  return function decorator(target) {
    const privateProp = `_${state}`;

    target.prototype[privateProp] = initialValue;

    decorateToggle(target.prototype, privateProp, on, true);
    decorateToggle(target.prototype, privateProp, off, false);

    target.prototype[state] = function () {
      return this[privateProp];
    };
  };
}

export function visible(initialValue = false) {
  return toggle('visible', 'show', 'hide', initialValue);
}

export function objectVisible(initialValue = false) {
  return toggle('objectVisible', 'show', 'hide', initialValue);
}

export function active(initialValue = false) {
  return toggle('active', 'activate', 'deactivate', initialValue);
}

export function enabled(initialValue = false) {
  return toggle('enabled', 'enable', 'disable', initialValue);
}

export function started(initialValue = false) {
  return toggle('started', 'start', 'stop', initialValue);
}

export function focused(initialValue = false) {
  return toggle('focused', 'focus', 'blur', initialValue);
}

export function selected(initialValue = false) {
  return toggle('selected', 'select', 'deselect', initialValue);
}

export function opened(initialValue = false) {
  return toggle('opened', 'open', 'close', initialValue);
}
