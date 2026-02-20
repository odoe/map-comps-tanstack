import '@esri/calcite-components/components/calcite-block'
import '@esri/calcite-components/components/calcite-button'
import '@esri/calcite-components/components/calcite-notice'
import '@esri/calcite-components/components/calcite-panel'
import '@esri/calcite-components/components/calcite-tile'
import '@esri/calcite-components/components/calcite-tile-group'

import type { Dispatch, SetStateAction } from 'react'

type MultidimensionalFilterPanelProps = {
  panelWidth: string
  currentTimeSlice: number
  sceneElement: HTMLArcgisSceneElement | null
  setCurrentPressureValue: Dispatch<SetStateAction<number>>
  setCurrentOffsetValue: Dispatch<SetStateAction<number>>
  setCurrentTimeSlice: Dispatch<SetStateAction<number>>
}

export function MultidimensionalFilterPanel({
  panelWidth,
  currentTimeSlice,
  sceneElement,
  setCurrentPressureValue,
  setCurrentOffsetValue,
  setCurrentTimeSlice,
}: MultidimensionalFilterPanelProps) {
  return (
    <calcite-panel
      slot="panel-end"
      id="filter-panel"
      heading="Multidimensional Filter"
      style={{ width: panelWidth }}
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
            appearance={currentTimeSlice === 2 ? 'solid' : 'outline-fill'}
            value="2"
            onClick={() => setCurrentTimeSlice(2)}
          >
            Feb
          </calcite-button>
          <calcite-button
            round
            appearance={currentTimeSlice === 3 ? 'solid' : 'outline-fill'}
            value="3"
            onClick={() => setCurrentTimeSlice(3)}
          >
            Mar
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
            appearance={currentTimeSlice === 5 ? 'solid' : 'outline-fill'}
            value="5"
            onClick={() => setCurrentTimeSlice(5)}
          >
            May
          </calcite-button>
          <calcite-button
            round
            appearance={currentTimeSlice === 6 ? 'solid' : 'outline-fill'}
            value="6"
            onClick={() => setCurrentTimeSlice(6)}
          >
            Jun
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
            appearance={currentTimeSlice === 8 ? 'solid' : 'outline-fill'}
            value="8"
            onClick={() => setCurrentTimeSlice(8)}
          >
            Aug
          </calcite-button>
          <calcite-button
            round
            appearance={currentTimeSlice === 9 ? 'solid' : 'outline-fill'}
            value="9"
            onClick={() => setCurrentTimeSlice(9)}
          >
            Sep
          </calcite-button>
          <calcite-button
            round
            appearance={currentTimeSlice === 10 ? 'solid' : 'outline-fill'}
            value="10"
            onClick={() => setCurrentTimeSlice(10)}
          >
            Oct
          </calcite-button>
          <calcite-button
            round
            appearance={currentTimeSlice === 11 ? 'solid' : 'outline-fill'}
            value="11"
            onClick={() => setCurrentTimeSlice(11)}
          >
            Nov
          </calcite-button>
          <calcite-button
            round
            appearance={currentTimeSlice === 12 ? 'solid' : 'outline-fill'}
            value="12"
            onClick={() => setCurrentTimeSlice(12)}
          >
            Dec
          </calcite-button>
        </div>
        <calcite-notice scale="s" open icon="open-book">
          <span slot="message">
            The wind data shown are monthly averages from 2005 to 2024,
            providing insight into long-term patterns at each pressure level.
          </span>
        </calcite-notice>
      </calcite-block>
      <calcite-block collapsible expanded heading="Legend" icon-start="legend">
        <arcgis-legend
          referenceElement={sceneElement ?? undefined}
          className="w-full"
        />
      </calcite-block>
    </calcite-panel>
  )
}
