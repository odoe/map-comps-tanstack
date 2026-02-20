'use client'

import { useEffect, useRef, useState } from 'react'

import '@esri/calcite-components/components/calcite-action'
import '@esri/calcite-components/components/calcite-action-bar'
import '@esri/calcite-components/components/calcite-navigation'
import '@esri/calcite-components/components/calcite-navigation-logo'
import '@esri/calcite-components/components/calcite-shell'

import type ImageryTileLayer from '@arcgis/core/layers/ImageryTileLayer.js'
import type Constraints from '@arcgis/core/views/3d/constraints/Constraints.js'
import type WebMap from '@arcgis/core/WebMap.js'

import { MultidimensionalFilterPanel } from '@/components/multidimensional-filter-panel'
import {
  createWindLayer,
  updateLabels,
  updateLayerDefinition,
  updateLayerElevation,
} from '@/utils/layer-utils'

export function MapSection() {
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

    updateLabels(mapRef.current.map as WebMap)

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
      updateLayerDefinition(
        windTileLayer,
        currentPressureValue,
        currentTimeSlice,
      )
    }
  }, [currentPressureValue, currentTimeSlice, windTileLayer])

  useEffect(() => {
    if (windTileLayer) {
      updateLayerElevation(windTileLayer, currentOffsetValue)
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
    <>
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
    </>
  )
}
