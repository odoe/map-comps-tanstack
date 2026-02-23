'use client'

import type { RefObject } from 'react'
import { useEffect, useRef, useState } from 'react'

import '@esri/calcite-components/components/calcite-action'
import '@esri/calcite-components/components/calcite-action-bar'
import '@esri/calcite-components/components/calcite-navigation'
import '@esri/calcite-components/components/calcite-navigation-logo'
import '@esri/calcite-components/components/calcite-shell'

import { watch } from '@arcgis/core/core/reactiveUtils.js'
import type ImageryTileLayer from '@arcgis/core/layers/ImageryTileLayer.js'

import { MultidimensionalFilterPanel } from '@/components/multidimensional-filter-panel'
import {
  createWindLayer,
  updateLayerDefinition,
  updateLayerElevation,
  updateLayerVisualVariables,
} from '@/utils/layer-utils'
import Basemap from '@arcgis/core/Basemap'

export function MapSection({ theme }: { theme: 'light' | 'dark' }) {
  const [mapReady, setMapReady] = useState(false)
  const [lightBasemap, setLightBasemap] = useState<Basemap | null>(null)
  const [darkBasemap, setDarkBasemap] = useState<Basemap | null>(null)
  const [windTileLayer, setWindTileLayer] = useState<ImageryTileLayer | null>(
    null,
  )
  const [showCompass, setShowCompass] = useState(false)
  const [currentPressureValue, setCurrentPressureValue] = useState(17500) // Default to "Aviation" scenario
  const [currentTimeSlice, setCurrentTimeSlice] = useState(1) // Default to January
  const [currentOffsetValue, setCurrentOffsetValue] = useState(8000) // Default offset value for "Aviation" scenario
  const [panelWidth, setPanelWidth] = useState('420px') // Initial width of the panel

  const mapRef = useRef<HTMLArcgisMapElement>(null)

  useEffect(() => {
    Promise.all([
      import('@arcgis/map-components/components/arcgis-map'),
      import('@arcgis/map-components/components/arcgis-compass'),
      import('@arcgis/map-components/components/arcgis-expand'),
      import('@arcgis/map-components/components/arcgis-legend'),
    ])
  }, [])

  useEffect(() => {
    if (!mapReady || windTileLayer || !mapRef.current) return

    // Create the ImageryTileLayer with the FlowRenderer
    const tileLayer = createWindLayer(currentPressureValue, currentTimeSlice)

    setWindTileLayer(tileLayer)
  }, [mapReady, windTileLayer, currentPressureValue, currentTimeSlice])

  useEffect(() => {
    if (mapReady && mapRef.current && windTileLayer) {
      setDarkBasemap(mapRef.current.map?.basemap ?? null)
      setLightBasemap(
        new Basemap({ portalItem: { id: '1ca7cffca342442da140c6be4a83faa6' } }),
      )
      mapRef.current.map?.add(windTileLayer)

      watch(
        () => mapRef.current?.rotation,
        (rotation) => {
          setShowCompass(rotation !== 0)
        },
        { initial: true },
      )
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

  useEffect(() => {
    if (mapReady && mapRef.current?.map) {
      const basemapToApply = theme === 'light' ? lightBasemap : darkBasemap
      if (basemapToApply) {
        mapRef.current.map.basemap = basemapToApply
      }
    }
    if (windTileLayer) {
      updateLayerVisualVariables(windTileLayer, theme)
    }
  }, [theme])

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
        mapElement={mapRef.current}
        setCurrentPressureValue={setCurrentPressureValue}
        setCurrentOffsetValue={setCurrentOffsetValue}
        setCurrentTimeSlice={setCurrentTimeSlice}
      />
      <section className="flex h-full">
        <arcgis-map
          ref={mapRef as RefObject<HTMLArcgisMapElement>}
          className="w-full"
          item-id="a77d428c4f644ae1bde3926a004aa633"
          onarcgisViewReadyChange={() => setMapReady(true)}
        >
          <arcgis-compass
            className={!showCompass ? 'hidden' : ''}
            slot="top-left"
          />
        </arcgis-map>
        <div
          className="w-2.5 h-full bg-blue-500 hover:bg-blue-100 hover:cursor-pointer"
          onClick={resizePanel}
        />
      </section>
    </>
  )
}
