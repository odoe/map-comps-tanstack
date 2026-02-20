import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useState } from 'react'

import '@esri/calcite-components/components/calcite-action'
import '@esri/calcite-components/components/calcite-action-bar'
import '@esri/calcite-components/components/calcite-loader'
import '@esri/calcite-components/components/calcite-navigation'
import '@esri/calcite-components/components/calcite-navigation-logo'
import '@esri/calcite-components/components/calcite-shell'

export const Route = createFileRoute('/')({ component: App })

function App() {
  const [MapSection, setMapSection] = useState<React.FC | null>(null)

  useEffect(() => {
    import('../components/map-section').then((module) => {
      setMapSection(() => module.MapSection)
    })
  }, [])

  return (
    <calcite-shell className="calcite-mode-dark">
      <calcite-navigation slot="header">
        <calcite-navigation-logo
          heading={'Visualizing Multidimensional Data with FlowRenderer'}
          heading-level="1"
          slot="logo"
        ></calcite-navigation-logo>
      </calcite-navigation>
      {!MapSection ? (
        <calcite-loader label="Loading..."></calcite-loader>
      ) : (
        <MapSection />
      )}
    </calcite-shell>
  )
}
