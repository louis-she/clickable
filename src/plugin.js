class Plugin {

  static register(pluginName, pluginClass) {
    Plugin.registedPlugins[pluginName] = pluginClass
    return pluginClass
  }

  static attributes() {
    const pluginOptions = Object.keys(Plugin.registedPlugins).filter((pluginName) => {
      const pluginClass = Plugin.registedPlugins[pluginName]
      return pluginClass.configurable()
    }).map((pluginName) => {
      const pluginClass = Plugin.registedPlugins[pluginName]
      return {
        label: pluginClass.name(),
        value: pluginName
      }
    })

    return [
      { name: 'pluginType', label: '动作名称', input: 'Select', options: pluginOptions }
    ]
  }

  static configurable() {
    return true
  }
}

Plugin.registedPlugins = {}

export default Plugin
