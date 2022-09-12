export function waitUntilExistsFrom<T>(fn: () => T, maxRetries = 20, timeout = 10): Promise<T> {
  return new Promise(resolve => {
    retry(fn, resolve, maxRetries, timeout);
  });
}

export function getParentsOf($element: HTMLElement, selector = ''): HTMLElement[] {
  const $parents = [];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  for (; $element && $element !== (document as any); $element = $element.parentNode as HTMLElement) {
    if (selector) {
      if ($element.matches(selector)) {
        $parents.push($element);
      }

      continue;
    }

    $parents.push($element);
  }

  return $parents;
}

function retry<T>(fn: () => T, resolve: (response: T) => void, maxRetries = 20, timeout = 10, retries = 0): void {
  retries++;

  setTimeout(() => {
    const response = fn();

    if ((!response || response === undefined) && retries < maxRetries) {
      retry(fn, resolve, maxRetries, timeout, retries);
    } else {
      resolve(response);
    }
  }, timeout);
}
