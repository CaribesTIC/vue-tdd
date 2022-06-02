# Simulaciones de Temporizador

Las funciones de temporizador nativas (es decir, `setTimeout()`, `setInterval()`, `clearTimeout()`, `clearInterval()`) son menos que ideales para un entorno de prueba, ya que dependen del tiempo real para transcurrir. Vitest puede intercambiar temporizadores con funciones que te permiten controlar el paso del tiempo. [¡Gran Scott!](https://www.youtube.com/watch?v=QZoJ2Pt27BY)

:::info Información
Consulte también la documentación de la [API de temporizadores falsos](https://vitest.dev/api/#vi-usefaketimers).
:::


## Habilitar Temporizadores Falsos

En el siguiente ejemplo, habilitamos temporizadores falsos llamando a vi.useFakeTimers(). Esto reemplaza la implementación original de `setTimeout()` y otras funciones de temporizador. Los temporizadores se pueden restaurar a su comportamiento normal con `vi.useRealTimers()`.

```js
// timerGame.js
const timerGame = (callback) => {
  console.log('Ready....go!');
  setTimeout(() => {
    console.log("Time's up -- stop!");
    callback && callback();
  }, 1000);
}

export default timerGame;
```

```js
// timerGame.spec.js
import timerGame from '@/timerGame';

vi.useFakeTimers();

test('waits 1 second before ending the game', () => {
  vi.spyOn(global, 'setTimeout');

  timerGame();

  expect(setTimeout).toHaveBeenCalledTimes(1);
  expect(setTimeout).toHaveBeenLastCalledWith(expect.any(Function), 1000);
});
```

## Ejecutar Todos los Temporizadores

Otra prueba que podríamos querer escribir para este módulo es una que afirme que la devolución de llamada se llama después de 1 segundo. Para hacer esto, vamos a usar las API de control de temporizador de Vitest para acelerar el tiempo justo en el medio de la prueba:

```js
test('calls the callback after 1 second', () => {  
  const callback = vi.fn();

  timerGame(callback);

  // At this point in time, the callback should not have been called yet
  expect(callback).not.toBeCalled();

  // Fast-forward until all timers have been executed
  vi.runAllTimers();

  // Now our callback should have been called!
  expect(callback).toBeCalled();
  expect(callback).toHaveBeenCalledTimes(1);
});
```

## Ejecutar Temporizadores Pendientes

También hay escenarios en los que podría tener un temporizador recursivo, es decir, un temporizador que establece un nuevo temporizador en su propia devolución de llamada. Para estos, ejecutar todos los temporizadores sería un ciclo sin fin, lanzando el siguiente error: _"Aborting after running 100000 timers, assuming an infinite loop!"_.

Si ese es tu caso, usar `vi.runOnlyPendingTimers()` resolverá el problema:

```js
// infiniteTimerGame.js
const infiniteTimerGame = (callback) => {
  console.log('Ready....go!');

  setTimeout(() => {
    console.log("Time's up! 10 seconds before the next game starts...");
    callback && callback();

    // Schedule the next game in 10 seconds
    setTimeout(() => {
      infiniteTimerGame(callback);
    }, 10000);
  }, 1000);
};

export default infiniteTimerGame;
```

```js
// infiniteTimerGame.spec.js
import infiniteTimerGame from '@/infiniteTimerGame';

vi.useFakeTimers();

describe('infiniteTimerGame', () => {
  test('schedules a 10-second timer after 1 second', () => {
    vi.spyOn(global, 'setTimeout');
    const callback = vi.fn();

    infiniteTimerGame(callback);

    // At this point in time, there should have been a single call to
    // setTimeout to schedule the end of the game in 1 second.
    expect(setTimeout).toHaveBeenCalledTimes(1);
    expect(setTimeout).toHaveBeenLastCalledWith(expect.any(Function), 1000);

    // Fast forward and exhaust only currently pending timers
    // (but not any new timers that get created during that process)
    vi.runOnlyPendingTimers();

    // At this point, our 1-second timer should have fired its callback
    expect(callback).toBeCalled();

    // And it should have created a new timer to start the game over in
    // 10 seconds
    expect(setTimeout).toHaveBeenCalledTimes(2);
    expect(setTimeout).toHaveBeenLastCalledWith(expect.any(Function), 10000);
  });
});
```

## Temporizadores de avance por tiempo

Otra posibilidad es usar `vi.advanceTimersByTime(msToRun)`. Cuando se llama a esta API, todos los temporizadores avanzan `msToRun` milisegundos. Se ejecutarán todas las "macrotareas" pendientes que se hayan puesto en cola a través de `setTimeout()` o `setInterval()`, y que se ejecutarían durante este período de tiempo. Además, si esas macrotareas programan nuevas macrotareas que se ejecutarían en el mismo período de tiempo, se ejecutarán hasta que no queden más macrotareas en la cola que deban ejecutarse en `msToRun` milisegundos.

```js
// timerGame
const timerGame = (callback) => {
  console.log('Ready....go!');
  setTimeout(() => {
    console.log("Time's up -- stop!");
    callback && callback();
  }, 1000);
}

export default timerGame;
```

```js
// timerGame.spec.js
import timerGame from '@/timerGame';

vi.useFakeTimers();

// ...

it('calls the callback after 1 second via advanceTimersByTime', () => {  
  const callback = vi.fn();

  timerGame(callback);

  // At this point in time, the callback should not have been called yet
  expect(callback).not.toBeCalled();

  // Fast-forward until all timers have been executed
  vi.advanceTimersByTime(1000);

  // Now our callback should have been called!
  expect(callback).toBeCalled();
  expect(callback).toHaveBeenCalledTimes(1);
});
```

Por último, ocasionalmente puede ser útil en algunas pruebas poder borrar todos los temporizadores pendientes. Para esto, tenemos `vi.clearAllTimers()`.

## Falsificación Selectiva

A veces, su código puede requerir evitar sobrescribir la implementación original de una u otra API. Si ese es el caso, puede usar la opción `doNotFake`. Por ejemplo, así es como podría proporcionar una función simulada personalizada para `performance.mark()` en el entorno jsdom:

```js
/**
 * @vitest-environment jsdom
 */
 
// redefining readonly property of the performance object
Object.defineProperty(performance, "mark", {
  value: vi.fn(),
  configurable: true,
  writable: true
});

const mockPerformanceMark = vi.fn();
window.performance.mark = mockPerformanceMark;

test('allows mocking `performance.mark()`', () => {
  vi.useFakeTimers({doNotFake: ['performance']});

  expect(window.performance.mark).toBe(mockPerformanceMark);
});
```
