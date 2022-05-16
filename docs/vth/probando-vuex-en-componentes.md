# Probando Vuex en componentes

## Estado y Captadores





## Testing Vuex in components

The source code for the test described on this page can be found here

## Using global.plugins to test $store.state

In a regular Vue app, we install Vuex using app.use(store), which installs a globally available Vuex store in the app. In a unit test, we can do exactly the same thing. Unlike a regular Vue app, we don't want to share the same Vuex store across every test - we want a fresh one for each test. Let's see how we can do that. First, a simple `<ComponentWithGetters>` component that renders a username in the store's base state.
