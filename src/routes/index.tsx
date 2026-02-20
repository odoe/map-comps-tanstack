import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useRef, useState } from 'react'

import '@esri/calcite-components/components/calcite-action'
import '@esri/calcite-components/components/calcite-action-bar'
import '@esri/calcite-components/components/calcite-navigation'
import '@esri/calcite-components/components/calcite-navigation-logo'
import '@esri/calcite-components/components/calcite-shell'

import type FeatureLayer from '@arcgis/core/layers/FeatureLayer.js'
import type ImageryTileLayer from '@arcgis/core/layers/ImageryTileLayer.js'
import DimensionalDefinition from '@arcgis/core/layers/support/DimensionalDefinition.js'
import type LabelSymbol3D from '@arcgis/core/symbols/LabelSymbol3D.js'
import type Constraints from '@arcgis/core/views/3d/constraints/Constraints.js'

import { MultidimensionalFilterPanel } from '@/components/multidimensional-filter-panel'
import { createWindLayer } from '@/utils/layer-utils'

export const Route = createFileRoute('/')({ component: App })

function App() {
  const [mapReady, setMapReady] = useState(false)
  const [windTileLayer, setWindTileLayer] = useState<ImageryTileLayer | null>(
    null,
  )
  const [currentPressureValue, setCurrentPressureValue] = useState(17500) // Default to "Aviation" scenario
  const [currentTimeSlice, setCurrentTimeSlice] = useState(1) // Default to January
  const [currentOffsetValue, setCurrentOffsetValue] = useState(8000) // Default offset value for "Aviation" scenario
  const [panelWidth, setPanelWidth] = useState('420px') // Initial width of the panel

  const mapRef = useRef<HTMLArcgisSceneElement>(null)

  useEffect(() => {
    import('@arcgis/map-components/components/arcgis-scene')
    import('@arcgis/map-components/components/arcgis-expand')
    import('@arcgis/map-components/components/arcgis-legend')
  }, [])

  useEffect(() => {
    if (!mapReady || windTileLayer || !mapRef.current) return

    const labelsLayer = mapRef.current.map?.allLayers.find(
      (layer) => layer.title === 'Places and Labels',
    ) as FeatureLayer | undefined

    labelsLayer?.labelingInfo?.forEach((labelClass) => {
      labelClass.labelPlacement = 'above-center'
      ;(labelClass.symbol as LabelSymbol3D).verticalOffset = {
        screenLength: 8,
      }
    })
    mapRef.current.constraints = {
      altitude: {
        min: 1000000,
      },
    } as Constraints

    // Create the ImageryTileLayer with the FlowRenderer
    const tileLayer = createWindLayer(currentPressureValue, currentTimeSlice)

    setWindTileLayer(tileLayer)
  }, [mapReady, windTileLayer, currentPressureValue, currentTimeSlice])

  useEffect(() => {
    if (mapReady && mapRef.current && windTileLayer) {
      mapRef.current.map?.add(windTileLayer)
    }
  }, [mapReady, windTileLayer])

  useEffect(() => {
    if (windTileLayer) {
      windTileLayer.multidimensionalDefinition = [
        new DimensionalDefinition({
          variableName: 'Vector-MagDir',
          dimensionName: 'StdPressure',
          values: [currentPressureValue],
          isSlice: true,
        }),
        new DimensionalDefinition({
          variableName: 'Vector-MagDir',
          dimensionName: 'StdTime',
          values: [currentTimeSlice],
          isSlice: true,
        }),
      ]
    }
  }, [currentPressureValue, currentTimeSlice, windTileLayer])

  useEffect(() => {
    if (windTileLayer) {
      windTileLayer.elevationInfo = {
        mode: 'absolute-height',
        offset: currentOffsetValue,
      }
    }
  }, [currentOffsetValue, windTileLayer])

  function resizePanel() {
    if (panelWidth === '420px') {
      setPanelWidth('0')
    } else {
      setPanelWidth('420px')
    }
  }

  return (
    <calcite-shell className="calcite-mode-dark">
      <calcite-navigation slot="header">
        <calcite-navigation-logo
          heading={'Visualizing Multidimensional Data with FlowRenderer'}
          heading-level="1"
          slot="logo"
        ></calcite-navigation-logo>
      </calcite-navigation>
      <MultidimensionalFilterPanel
        panelWidth={panelWidth}
        currentTimeSlice={currentTimeSlice}
        sceneElement={mapRef.current}
        setCurrentPressureValue={setCurrentPressureValue}
        setCurrentOffsetValue={setCurrentOffsetValue}
        setCurrentTimeSlice={setCurrentTimeSlice}
      />
      <section className="flex h-full">
        <arcgis-scene
          ref={mapRef}
          className="w-full"
          item-id="e3d224978b384d7288bafee99e34c75a"
          onarcgisViewReadyChange={() => setMapReady(true)}
        />
        <div
          className="w-2.5 h-full bg-blue-500 hover:bg-blue-100 hover:cursor-pointer"
          onClick={resizePanel}
        />
      </section>
    </calcite-shell>
  )
}
