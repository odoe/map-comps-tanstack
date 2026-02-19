import { createFileRoute } from '@tanstack/react-router'

import '@esri/calcite-components/components/calcite-action'
import '@esri/calcite-components/components/calcite-action-bar'
import '@esri/calcite-components/components/calcite-shell'
import '@esri/calcite-components/components/calcite-panel'
import '@esri/calcite-components/components/calcite-block'
import '@esri/calcite-components/components/calcite-tile'
import '@esri/calcite-components/components/calcite-tile-group'
import '@esri/calcite-components/components/calcite-notice'
import '@esri/calcite-components/components/calcite-button'
import '@esri/calcite-components/components/calcite-navigation'
import '@esri/calcite-components/components/calcite-navigation-logo'

import ImageryTileLayer from '@arcgis/core/layers/ImageryTileLayer.js'
import DimensionalDefinition from '@arcgis/core/layers/support/DimensionalDefinition.js'
import ColorVariable from '@arcgis/core/renderers/visualVariables/ColorVariable.js'

import type Constraints from '@arcgis/core/views/3d/constraints/Constraints.js'

import { useEffect, useRef, useState } from 'react'
import type FeatureLayer from '@arcgis/core/layers/FeatureLayer'
import type LabelSymbol3D from '@arcgis/core/symbols/LabelSymbol3D'

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
    if (windTileLayer) return
    if (mapRef.current) {
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
      } as unknown as Constraints

      // Create the ImageryTileLayer with the FlowRenderer
      const tileLayer = new ImageryTileLayer({
        url: 'https://tiledimageservices.arcgis.com/P3ePLMYs2RVChkJx/arcgis/rest/services/Global_Average_Wind_Speeds_Month_Altitude/ImageServer',
        elevationInfo: {
          mode: 'absolute-height',
          offset: 8000,
        },
        renderer: {
          type: 'flow',
          trailLength: 20,
          flowSpeed: 3,
          trailWidth: 2.5,
          visualVariables: [
            new ColorVariable({
              field: 'Magnitude',
              stops: [
                { value: 0, color: [0, 100, 255, 1], label: '0 m/s' },
                { value: 0.1, color: [0, 150, 255, 1] },
                { value: 3, color: [0, 200, 255, 1] },
                { value: 7, color: [0, 220, 130, 1] },
                { value: 15, color: [80, 255, 70, 1] },
                { value: 25, color: [200, 255, 40, 1] },
                { value: 40, color: [255, 255, 0, 1], label: '>40 m/s' },
              ],
            }),
          ],
        },
        multidimensionalDefinition: [
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
        ],
      })

      setWindTileLayer(tileLayer)
    }
  }, [mapReady])

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
      <calcite-panel
        slot="panel-end"
        id="filter-panel"
        heading="Multidimensional Filter"
        className={`w-[${panelWidth}]`}
        scale="s"
        description="Filter the multidimensional layer to visualize a single slice defined as a combination of pressure and time."
      >
        <calcite-block
          collapsible
          heading="Vertical Z dimension (StdPressure)"
          expanded
          icon-start="altitude"
        >
          <calcite-tile-group
            alignment="start"
            layout="vertical"
            selection-appearance="border"
            selection-mode="single-persist"
            label="Vertical Z dimension (StdPressure) options"
          >
            <calcite-tile
              selected
              icon="plane"
              heading="Wind at ~8km (Aviation)"
              onClick={() => {
                setCurrentPressureValue(17500)
                setCurrentOffsetValue(8000)
              }}
              description="Winds data used for JetStream or aviation use cases.
                     They are collected at a pressure of 17,500 Pa (~8km above the sea level)"
            ></calcite-tile>
            <calcite-tile
              icon="find-add-path"
              heading="Wind at ~1.5km (Bird migration)"
              onClick={() => {
                setCurrentPressureValue(85000)
                setCurrentOffsetValue(1500)
              }}
              description="Winds data used to study the bird migration. They are collected and visualized at a pressure of 85,000 Pa (~1.5 kilometers above the sea level)"
            ></calcite-tile>
            <calcite-tile
              icon="relative-to-ground-elevation"
              heading="Wind at ~10m (Surface winds)"
              onClick={() => {
                setCurrentPressureValue(100000)
                setCurrentOffsetValue(10)
              }}
              description="Winds data used for surface winds analysis. They are collected at a pressure of 100,000 Pa (~10m above the terrain)"
            ></calcite-tile>
          </calcite-tile-group>
        </calcite-block>
        <calcite-block
          collapsible
          expanded
          heading="Time dimension (StdTime)"
          icon-start="clock"
        >
          <div id="month-grid" className="grid grid-cols-4 gap-2 mb-4">
            <calcite-button
              round
              appearance={currentTimeSlice === 1 ? 'solid' : 'outline-fill'}
              value="1"
              onClick={() => setCurrentTimeSlice(1)}
            >
              Jan
            </calcite-button>
            <calcite-button
              round
              appearance={currentTimeSlice === 4 ? 'solid' : 'outline-fill'}
              value="4"
              onClick={() => setCurrentTimeSlice(4)}
            >
              Apr
            </calcite-button>
            <calcite-button
              round
              appearance={currentTimeSlice === 7 ? 'solid' : 'outline-fill'}
              value="7"
              onClick={() => setCurrentTimeSlice(7)}
            >
              Jul
            </calcite-button>
            <calcite-button
              round
              appearance={currentTimeSlice === 10 ? 'solid' : 'outline-fill'}
              value="10"
              onClick={() => setCurrentTimeSlice(10)}
            >
              Oct
            </calcite-button>
          </div>
          <calcite-notice scale="s" open icon="open-book">
            <span slot="message">
              The wind data shown are monthly averages from 2005 to 2024,
              providing insight into long-term patterns at each pressure level.
            </span>
          </calcite-notice>
        </calcite-block>
        <calcite-block
          collapsible
          expanded
          heading="Legend"
          icon-start="legend"
        >
          <arcgis-legend
            referenceElement={mapRef.current ?? undefined}
            className="w-full"
          />
        </calcite-block>
      </calcite-panel>
      <section className="flex h-full">
        <arcgis-scene
          ref={mapRef}
          className="w-full"
          item-id="e3d224978b384d7288bafee99e34c75a"
          onarcgisViewReadyChange={() => setMapReady(true)}
        />
        <div
          className="w-[10px] h-full bg-blue-500 hover:bg-blue-100 hover:cursor-pointer"
          onClick={resizePanel}
        />
      </section>
    </calcite-shell>
  )
}
