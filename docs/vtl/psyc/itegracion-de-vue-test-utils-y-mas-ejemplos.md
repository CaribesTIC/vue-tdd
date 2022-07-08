# Integración de Vue Test Utils y más ejemplos

:::info Prueba
[Esta lección en video](https://www.youtube.com/watch?v=fi4gwBkryxE&list=PLC2LZCNWKL9YdD4Z4V6guveajQoKN8rui&index=8)
:::

Hasta ahora hemos visto varias características de Vue Testing Library. Hemos visto:

- Cómo podemos desestructurar el retorno de la función `render`.
- Cómo poder usar el método `screen.getByRole` para encontrar algo de una manera amigable y accesible.
- Cómo personalizar aserciones, por ejemplo `toBeDisabled`.
- Cómo podemos activar eventos como `fireEvent.update`.
- Cómo hacer click en el botón con `fireEvent.click`.
- Cómo podemos afirmar contra eventos emitidos y verificar el envío de la carga útil.

```js
// tests/components/myform.spec.js
import { render, screen, fireEvent, waitFor } from "@testing-library/vue"
import "@testing-library/jest-dom"
import MyForm from "@/components/MyForm.vue"

describe("MyForm.vue", () => {
  it("enable button and emit event", async () => {    
    const { emitted } = render(MyForm)

    const button = screen.getByRole("button", {name: "Submit"})
    expect(button).toBeDisabled()
    
    await fireEvent.update(
      screen.getByLabelText('Name'), 'John'
    )
            
    expect(button).not.toBeDisabled()

    fireEvent.click(button)

    expect(emitted().submit[0][0]).toEqual({ name: 'John' })
    
  })
})
```
