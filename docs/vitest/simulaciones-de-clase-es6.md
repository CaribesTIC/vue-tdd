# Simulaciones de Clase ES

Vitest se puede usar para burlarse de las clases de ES6 que se importan a los archivos que desea probar.

Las clases de ES6 son funciones constructoras con algo de azúcar sintáctica. Por lo tanto, cualquier simulación de una clase ES6 debe ser una función o una clase ES6 real (que es, de nuevo, otra función). Entonces puedes burlarte de ellos usando [funciones simuladas](../vitest/funciones-simuladas.html).

## Un Ejemplo de Clase ES6

Usaremos un ejemplo artificial de una clase que reproduce archivos de sonido, `SoundPlayer`, y una clase de consumidor que usa esa clase, `SoundPlayerConsumer`. Simularemos `SoundPlayer` en nuestras pruebas para `SoundPlayerConsumer`.

```js
// src/sound-player.js
export default class SoundPlayer {
  constructor() {
    this.foo = 'bar';
  }

  playSoundFile(fileName) {
    console.log('Playing sound file ' + fileName);
  }
}
```

```js
// src/sound-player-consumer.js
import SoundPlayer from '@/sound-player';

export default class SoundPlayerConsumer {  
  constructor() {
    this.soundPlayer = new SoundPlayer();
  }

  playSomethingCool() {
    const coolSoundFileName = 'song.mp3';
    this.soundPlayer.playSoundFile(coolSoundFileName);    
  }
}
```













## Limpiando entre pruebas

Para borrar el registro de llamadas a la función constructora simulada y sus métodos, llamamos a [mockClear()](https://vitest.dev/api/#mockclear) en la función `beforeEach()`:

```js
beforeEach(() => {
  SoundPlayer.mockClear();
  mockPlaySoundFile.mockClear();
});
```

## Espiando métodos de nuestra clase

Nuestra clase simulada deberá proporcionar cualquier función miembro (`playSoundFile` en el ejemplo) que se llamará durante nuestras pruebas, o de lo contrario obtendremos un error por llamar a una función que no existe. Pero probablemente también querremos espiar las llamadas a esos métodos, para asegurarnos de que se hayan llamado con los parámetros esperados.

Se creará un nuevo objeto cada vez que se llame a la función constructora simulada durante las pruebas. Para espiar las llamadas a métodos en todos estos objetos, completamos `playSoundFile` con otra función simulada y almacenamos una referencia a esa misma función simulada en nuestro archivo de prueba, para que esté disponible durante las pruebas.

```js
// tests/sound-player.spec.js
import SoundPlayer from '@/sound-player';
vi.mock('@/sound-player'); // SoundPlayer is now a mock constructor
const mockPlaySoundFile = vi.fn();
SoundPlayer = vi.fn().mockImplementation(() => {
  return {playSoundFile: mockPlaySoundFile}
});
```

El equivalente simulado manual de esto sería:
```js
// src/__mocks__/sound-player.js
export const mockPlaySoundFile = vi.fn();
const mock = vi.fn().mockImplementation(() => {
  return {playSoundFile: mockPlaySoundFile};
});
export default mock;
// Import this named export into your test file
```

El uso es similar a la función de fábrica de módulos, excepto que quedará más limpia su prueba. Recuerde que debe importar el método simulado a su archivo de prueba, ya que ya no está definido allí. Use la ruta del módulo original para esto; no incluya `__mocks__`.

## Ejemplo Completo

Aquí hay un ejemplo completo que usa el parámetro de fábrica del módulo para `vi.mock`:

```js
// tests/sound-player-1.spec.js
import SoundPlayer from '@/sound-player';
import SoundPlayerConsumer from '@/sound-player-consumer';

vi.mock('@/sound-player'); // SoundPlayer is now a mock constructor
const mockPlaySoundFile = vi.fn();
SoundPlayer = vi.fn().mockImplementation(() => {
  return {playSoundFile: mockPlaySoundFile}
});

beforeEach(() => {
  // Clear all instances and calls to constructor and all methods:
  SoundPlayer.mockClear();
  mockPlaySoundFile.mockClear();
});

it('We can check if the consumer called the class constructor', () => {
  const soundPlayerConsumer = new SoundPlayerConsumer();
  expect(SoundPlayer).toHaveBeenCalledTimes(1);
});

it('We can check if the consumer called a method on the class instance', () => {
  const soundPlayerConsumer = new SoundPlayerConsumer();
  const coolSoundFileName = 'song.mp3';
  soundPlayerConsumer.playSomethingCool();
  expect(mockPlaySoundFile.mock.calls[0][0]).toEqual(coolSoundFileName);
});
```

Finalmente, aquí hay otro ejemplo completo que usa la simulación manual para `vi.mock`:

```js
// tests/sound-player-2.spec.js
import SoundPlayer, { mockPlaySoundFile } from '@/sound-player';
import SoundPlayerConsumer from '@/sound-player-consumer';
vi.mock('@/sound-player'); // SoundPlayer is now a mock constructor

beforeEach(() => {
  SoundPlayer.mockClear();
  mockPlaySoundFile.mockClear();
});

it('The consumer should be able to call new() on SoundPlayer', () => {
  const soundPlayerConsumer = new SoundPlayerConsumer();
  // Ensure constructor created the object:
  expect(soundPlayerConsumer).toBeTruthy();
});

it('We can check if the consumer called the class constructor', () => {
  // Show that mockClear() is working:
  expect(SoundPlayer).not.toHaveBeenCalled();
  
  const soundPlayerConsumer = new SoundPlayerConsumer();
  expect(SoundPlayer).toHaveBeenCalledTimes(1);
});

it('We can check if the consumer called a method on the class instance', () => {
  const soundPlayerConsumer = new SoundPlayerConsumer();
  const coolSoundFileName = 'song.mp3';
  soundPlayerConsumer.playSomethingCool();
  expect(mockPlaySoundFile).toHaveBeenCalledWith(coolSoundFileName);
});
```
