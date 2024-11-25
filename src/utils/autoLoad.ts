// Auto-register all components from components directory
const registerComponents = async (app: any) => {
  const components = import.meta.glob('../components/**/*.vue')
  
  for (const [path, component] of Object.entries(components)) {
    // Extract component name from file path
    // Example: ../components/PageHeader.vue -> PageHeader
    const componentName = path
      .split('/')
      .pop()
      ?.replace('.vue', '')
    
    if (componentName) {
      const AsyncComponent = await component()
      app.component(componentName, AsyncComponent.default)
    }
  }
}

// Auto-register all stores from stores directory
const registerStores = async () => {
  const stores = import.meta.glob('../stores/**/*.ts', { eager: true })
  return Object.values(stores).reduce((acc: any, store: any) => {
    if (store.default) {
      acc = { ...acc, ...store.default }
    }
    return acc
  }, {})
}

export { registerComponents, registerStores }