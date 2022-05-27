window.__windicss_dynamic_color_plugin__ = ({ addDynamic, theme }) => {
  ['text', 'bg', 'border'].forEach((type) => {
    const hitPrefix = `${type}-`

    function notNumberLead(i) {
      return /^\d/.test(i) ? undefined : i
    }

    // https://github.com/windicss/windicss/blob/main/src/config/order.ts
    const pluginOrder = {
      textColor: 8000,
      borderColor: 1900,
      backgroundColor: 1100,
    }

    addDynamic(
        `${hitPrefix}#`,
        ({ Utility }) => {
          const color = Utility.raw.replace(hitPrefix, '')

          const colorHandle = Utility._h(Utility, color)

          /**
           * https://github.com/windicss/windicss/blob/main/src/lib/utilities/dynamic.ts
           */
          if (type === 'text') {
            return colorHandle
              .handleOpacity(theme('textOpacity'))
              .handleSquareBrackets(notNumberLead)
              .handleVariable()
              .createColorStyle(Utility.class, 'color', '--tw-text-opacity')
              ?.updateMeta('utilities', 'textColor', pluginOrder.textColor, 0, true)
          }

          if (type === 'bg') {
            return colorHandle
              .handleOpacity(theme('backgroundOpacity'))
              .handleSquareBrackets(notNumberLead)
              .handleVariable()
              .createColorStyle(Utility.class, 'background-color', '--tw-bg-opacity')
              ?.updateMeta('utilities', 'backgroundColor', pluginOrder.backgroundColor, 0, true)
          }

          return colorHandle
            .handleOpacity(theme('borderOpacity'))
            .handleSquareBrackets(notNumberLead)
            .handleVariable(variable => Utility.raw.startsWith('border-$') ? `var(--${variable})` : undefined)
            .createColorStyle(Utility.class, 'border-color', '--tw-border-opacity')
            ?.updateMeta('utilities', 'borderColor', pluginOrder.borderColor, 2, true)
        },
        {
          layer: 'components',
        },
    )
  })
}
