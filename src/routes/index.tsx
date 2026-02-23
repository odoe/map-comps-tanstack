import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useState } from 'react'

import '@esri/calcite-components/components/calcite-action'
import '@esri/calcite-components/components/calcite-action-bar'
import '@esri/calcite-components/components/calcite-icon'
import '@esri/calcite-components/components/calcite-label'
import '@esri/calcite-components/components/calcite-loader'
import '@esri/calcite-components/components/calcite-navigation'
import '@esri/calcite-components/components/calcite-navigation-logo'
import '@esri/calcite-components/components/calcite-shell'
import '@esri/calcite-components/components/calcite-switch'

export const Route = createFileRoute('/')({ component: App })

function App() {
  const [MapSection, setMapSection] = useState<React.FC<{ theme: 'light' | 'dark' }> | null>(null)
  const [theme, setTheme] = useState<'light' | 'dark'>('dark')

  useEffect(() => {
    import('../components/map-section').then((module) => {
      setMapSection(() => module.MapSection)
    })
  }, [])

  return (
    <calcite-shell className={`calcite-mode-${theme}`}>
      <calcite-navigation slot="header">
        <calcite-navigation-logo
          heading={'Visualizing Multidimensional Data with FlowRenderer'}
          heading-level="1"
          slot="logo"
        ></calcite-navigation-logo>
        <div slot="content-end" className="p-5">
          <calcite-label layout="inline">
            <calcite-icon icon="brightness" scale="s"></calcite-icon>
            <calcite-switch
              checked
              oncalciteSwitchChange={(event) => {
                const isChecked = event.target.checked
                setTheme(isChecked ? 'dark' : 'light')
              }}
            ></calcite-switch>
            <calcite-icon icon="moon" scale="s"></calcite-icon>
          </calcite-label>
        </div>
      </calcite-navigation>
      {!MapSection ? (
        <calcite-loader label="Loading..."></calcite-loader>
      ) : (
        <MapSection theme={theme} />
      )}
    </calcite-shell>
  )
}
